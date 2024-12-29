import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Typography,
  Checkbox,
  FormControlLabel,
  Box,
  Button,
  Paper,
  useTheme,
} from "@mui/material";
import { cookiesConsentLoad, cookiesConsentSave } from "../libs/Misc";


const CookieConsent = (props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [technicalConsent] = useState(true); // always true for mandatory cookies
  const [isConsentGiven, setIsConsentGiven] = useState(true); // assume true to avoid blinking...
  const [profilingConsent, setProfilingConsent] = useState(false);
  const [statisticsConsent, setStatisticsConsent] = useState(false);

  const [showCustomization, setShowCustomization] = useState(false);

  // accept all cookies
  const handleAcceptAll = () => {
    const consent = {
      technical: true,
      profiling: true,
      statistics: true,
    };
    setProfilingConsent(true);
    setStatisticsConsent(true);
    cookiesConsentSave(consent);
    setIsConsentGiven(consent);
    if (props.onClose) {
      props.onClose();
    }
  };

  const handleCustomization = () => {
    setShowCustomization(true);
  };

  // save custom preferences
  const handleSavePreferences = () => {
    const consent = {
      technical: true,
      profiling: profilingConsent,
      statistics: statisticsConsent,
    };
    cookiesConsentSave(consent);
    setIsConsentGiven(consent);
    if (props.onClose) {
      props.onClose();
    }
  };

  useEffect(() => {
    const consent = cookiesConsentLoad();
    setIsConsentGiven(consent);
    if (consent) {
      setProfilingConsent(consent.profiling);
      setStatisticsConsent(consent.statistics);
    } else {
      setIsConsentGiven(null); // trigger consent modal display
    }
  }, []);

  // do not show consent banner if valid consent is given, or if we are in setup mode...
  if (isConsentGiven !== null && !props.customizeOnly) {
    return null;
  }

  let ContainerComponent, containerComponentProps;
  if (props.customizeOnly) {
    ContainerComponent = Box;
    containerComponentProps = {};
  } else {
    ContainerComponent = Paper;
    containerComponentProps = {
      elevation: 6,
      sx: {
        position: "fixed",
        bottom: theme.spacing(2),
        left: "50%",
        transform: "translateX(-50%)",
        maxWidth: 600,
        width: "90%",
        padding: theme.spacing(3),
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        zIndex: 9999, // above other elements
      }
    }
  }
      
  return (
    <ContainerComponent {...containerComponentProps}>
      {!props.customizeOnly && (
        <>
          <Typography variant="h6" gutterBottom>
            {t("We use Cookies")}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {t("We uses cookies to ensure you get the best experience")}.
          </Typography>
        </>
      )}

      {(showCustomization || props.customizeOnly) && (
        <Box mt={2} ml={2} display="flex" flexDirection="column">
          <FormControlLabel
            control={<Checkbox checked={technicalConsent} disabled />}
            label={t("Technical cookies (mandatory)")}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={profilingConsent}
                onChange={(e) => setProfilingConsent(e.target.checked)}
              />
            }
            label={t("Profiling cookies")}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={statisticsConsent}
                onChange={(e) => setStatisticsConsent(e.target.checked)}
              />
            }
            label={t("Statistics cookies")}
          />
        </Box>
      )}

      <Box mt={3} sx={{ textAlign: "right", "& button": { mr: 1 } }}>
        <Button
          variant="contained"
          size="small"
          color="success"
          onClick={handleAcceptAll}
          sx={{
            my: 0.5,
            textTransform: "uppercase",
          }}
        >
          {t("Accept all")}
        </Button>
        {(!showCustomization && !props.customizeOnly) && (
          <Button
            variant="contained"
            size="small"
            color="default"
            onClick={handleCustomization}
            sx={{
              my: 0.5,
              opacity: "66%",
            }}
          >
            {t("Customize")}
          </Button>
        )}
        {(showCustomization || props.customizeOnly) && (
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={handleSavePreferences}
            sx={{
              my: 0.5,
            }}
          >
            {t("Save Preferences")}
          </Button>
        )}
      </Box>
    </ContainerComponent>
  );
};

export default React.memo(CookieConsent);
