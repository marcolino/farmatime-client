import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Container,
  Grid,
  Typography,
  FormControlLabel,
  Switch,
  Box,
  Button,
  Link,
  Paper,
  useTheme,
} from "@mui/material";
//import { SectionHeader } from "./custom";
import { useSnackbarContext } from "../hooks/useSnackbarContext";
import { cookiesConsentLoad, cookiesConsentSave } from "../libs/Misc";
import config from "../config";


const PreferencesCookie = (props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { showSnackbar } = useSnackbarContext();
  const [showCustomization, setShowCustomization] = useState(false);
  const [open, setOpen] = useState(props.customizeOnly);
  const [cookies, setCookies] = useState(() => {
    const retval = cookiesConsentLoad();
    if (retval) { // cookies consent already expressed
      if (!props.customizeOnly) {
        setOpen(false);
      }
      return retval;
    } else { // cookies consent never expressed, or expired
      setOpen(true);
      return config.cookies.default;
    }
  });

  const toggleCookie = (section, key) => {
    setCookies((prevCookies) => {
      const updatedCookies = { ...prevCookies, [key]: !prevCookies[key] };
      return updatedCookies;
    });
  };

  // accept all cookies
  const handleAcceptAll = () => {
    Object.keys(cookies).forEach(key => cookies[key] = true);
    setCookies(cookies);
    savePreferences();
  };

  const handleCustomization = () => {
    setShowCustomization(true);
  };

  // sync state changes to local storage
  const savePreferences = () => {
    cookiesConsentSave(cookies);
    showSnackbar(t("Cookie preferences saved successfully"), "success");
    close();
  };

  const close = () => {
    setOpen(false);
    props.onClose && props.onClose();
  };

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
        backgroundColor: theme.palette.background.cookies,
        color: theme.palette.text.primary,
        zIndex: 9999, // above other elements
      }
    }
  }

  const renderSection = (sectionTitle, section, items) => {
    return (
      <Grid container spacing={1} alignItems="flex-start">
        {/* switches on right */}
        <Grid item xs={12} /*md={9}*/>
          {items.map(([title, description, key, mandatory]) => (
            <Box key={key} sx={{ mb: 1 }}>
              <Grid container alignItems="center">
                <Grid item xs={10}>
                  <Typography variant="body1" fontWeight="bold">
                    {title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {description}
                  </Typography>
                </Grid>
                {(props.action !== "unsubscribe") && (
                  <Grid item xs={2} sx={{ pl: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={cookies[key]}
                          onChange={() => toggleCookie(section, key)}
                          disabled={mandatory}
                        />
                      }
                      label=""
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          ))}
        </Grid>
      </Grid>
    );
  };
  
  if (!open) {
    return;
  }

  return (
    <ContainerComponent {...containerComponentProps}>
      {/* {(showCustomization || props.customizeOnly) && (
        <SectionHeader>
          {t("Cookie preferences")}
        </SectionHeader>
      )} */}
      {!(showCustomization || props.customizeOnly) && (
        <Box sx={{ whiteSpace: "pre-wrap" }}>        
           <Typography component="h1" variant="body2" color="textSecondary" align="center">
            {t("We use cookies to provide, improve, protect and promote our services; to learn more, please see our")} <Link href="/privacy-policy" color="textPrimary">{t("privacy policy")}</Link>.
          </Typography>
        </Box>
      )}

      <Container maxWidth="md">
        <Box>
          {(showCustomization || props.customizeOnly) && renderSection("", "cookies",
            [
              [
                t("Technical cookies (mandatory)"),
                t("The cookies necessary for the app operativity"),
                "technical",
                true, // mandatory
              ],
              [
                t("Statistics cookies"),
                t("The cookies to collect anonymous statistics"),
                "statistics",
                false, // optional
              ],
              [
                t("Profiling cookies"),
                t("The cookies that allow users profiling"),
                "profiling",
                false, // optional
              ],
            ]
          )}

          <Box sx={{ my: 4 }}></Box>

          <Box sx={{ textAlign: "end" }}>
            <Button
              color="success"
              variant="contained"
              onClick={handleAcceptAll}
              sx={{
                m: 0.5,
                textTransform: "uppercase",
              }}
            >
              {t("Accept all")}
            </Button>
            {!(showCustomization || props.customizeOnly) && (
              <Button
                variant="contained"
                _size="small"
                color="default"
                onClick={handleCustomization}
                sx={{
                  m: 0.5,
                  opacity: "66%",
                  //textTransform: "uppercase",
                }}
              >
                {t("Customize")}
              </Button>
            )}
            {(showCustomization || props.customizeOnly) && (
              <Button
                color="primary"
                variant="contained"
                onClick={savePreferences}
                sx={{m: 0.5}}
              >
                {t("Save preferences")}
              </Button>
            )}
            {(showCustomization || props.customizeOnly) && (
              <Button
                color="secondary"
                variant="contained"
                onClick={close}
                sx={{m: 0.5}}
              >
                {t("Cancel")}
              </Button>
            )}
          </Box>

        </Box>
      </Container>
    </ContainerComponent>
  );
};

export default React.memo(PreferencesCookie);
