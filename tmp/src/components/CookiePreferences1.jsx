import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Container,
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
  Switch,
  Box,
  Button,
  Paper,
  useTheme,
} from "@mui/material";
import { SectionHeader } from "./custom";
import { useSnackbarContext } from "../providers/SnackbarProvider";
import { cookiesConsentLoad, cookiesConsentSave } from "../libs/Misc";


const CookiePreferences = (props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { showSnackbar } = useSnackbarContext();
  const [technicalConsent] = useState(true); // always true for mandatory cookies
  const [isConsentGiven, setIsConsentGiven] = useState(true); // assume true to avoid blinking...
  const [profilingConsent, setProfilingConsent] = useState(false);
  const [statisticsConsent, setStatisticsConsent] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  // const [cookies, setCookies] = useState([
  //   "technical", "profiling", "statistics",
  // ]);
  
  // TODO: handle cookies expiation

  // initialize state with a function that reads from localStorage
  const [cookies, setCookies] = useState(() => {
    const storedCookies = localStorage.getItem("cookies");
    return storedCookies ?
      JSON.parse(storedCookies) :
      {
        technical: true,
        profiling: false,
        statistics: false,
      }
    ;
  });

  // sync state changes to localStorage
  // useEffect(() => {
  //   localStorage.setItem("cookies", JSON.stringify(cookies));
  // }, [cookies]);

  // sync state changes to localStorage
  const savePreferences = () => {
    localStorage.setItem("cookies", JSON.stringify(cookies));
  }

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

  const handleConfirm = async () => {
    // if (props.action === "unsubscribe") { // unsubcribe action requested, set all section items to false
    //   if ((props.section === "all") || (props.section === "email")) {
    //     Object.keys(notifications[props.section]).forEach(notification => {
    //       notifications[props.section][notification] = false;
    //     });
    //   }
    //   if ((props.section === "all") || (props.section === "push")) {
    //     Object.keys(notifications[props.section]).forEach(notification => {
    //       notifications[props.section][notification] = false;
    //     });
    //   }
    //   if ((props.section === "all") || (props.section === "sms")) {
    //     Object.keys(notifications[props.section]).forEach(notification => {
    //       notifications[props.section][notification] = false;
    //     });
    //   }
    // }
    // await notificationsPreferencesSave(userId, notifications);
    // above function throws, if error we will not reach here

    // Save()...; // TODO
    //setIsConsentGiven("consent"); // TODO
    savePreferences();
    showSnackbar(t("Cookie preferences applied successfully"), "info");
    // showDialog({ // TODO: showSnackbar ...
    //   title: t("Preferences saved"),
    //   message: t("Changes applied successfully"),
    //   confirmText: ("Close"),
    //   onConfirm: () => {
    //     close();
    //   },
    // });
  };

  const close = () => {
    setIsConsentGiven("consent"); // TODO
    props.onClose && props.onClose();
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

  const renderSection = (sectionTitle, section, items) => {
    console.log("renderSection sectionTitle:", sectionTitle);
    console.log("renderSection section:", section);
    console.log("renderSection items:", items);
    console.log("renderSection cookies:", cookies);
    return (
      <Grid container spacing={1} alignItems="flex-start">
        {/* section title on left */}
        {/* <Grid item xs={12} md={3}>
          <Typography variant="h6" sx={{px: 2, mr: 2, backgroundColor: "secondary.main", borderRadius: 1 }}>
            {sectionTitle}
          </Typography>
        </Grid> */}

        {/* switches on right */}
        <Grid item xs={12} /*md={9}*/>
          {items.map(([title, description, key]) => (
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
                          onChange={() => handleToggle(section, key)}
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
  
  return (
    <ContainerComponent {...containerComponentProps}>
      <SectionHeader>
        {t("Cookie preferences")}
      </SectionHeader>
  
      <Container maxWidth="md">
        <Box>
          {renderSection("", "cookies",
            [
              [
                t("Technical cookies (mandatory)"),
                t("The cookies necessary for the app operativity"),
                "technical",
              ],
              [
                t("Statistics cookies"),
                t("The cookies to collect anonymous statistics"),
                "statistics",
              ],
              [
                t("Profiling cookies"),
                t("The cookies that allow users profiling"),
                "profiling",
              ],
            ]
          // );
    
          //   renderSection(
          //   "",
          //   t("Statistics cookies"),
          //   //t("The cookies to collect anonymous statistics"),
          //   "statistics",
            
          //   "",
          //   t("Profiling cookies"),
          //   //t("The cookies that allow users profiling"),
          //   "profiling",
          )}

          <Box sx={{ textAlign: "end", my: 4}}>
            <Button
              color="secondary"
              variant="contained"
              onClick={close}
              sx={{mx: 1}}
            >
              {t("Cancel")}
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={handleConfirm}
              sx={{mx: 1}}
            >
              {t("Confirm")}
            </Button>
          </Box>

        </Box>
      </Container>
    </ContainerComponent>
  );

  return (
    <ContainerComponent {...containerComponentProps}>
      {!props.customizeOnly && (
        <>
          {/* <Typography variant="h6" gutterBottom>
            {t("Cookies Preferences")}
          </Typography> */}
          <SectionHeader>
            {t("Cookies Preferences")}
          </SectionHeader>
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

export default React.memo(CookiePreferences);
