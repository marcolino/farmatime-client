import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Container,
  Grid,
} from "@mui/material";
import { AuthContext } from "../providers/AuthProvider";
import { useSnackbarContext } from "../providers/SnackbarProvider";
import { useDialog } from "../providers/DialogProvider";
import { apiCall } from "../libs/Network";
import ErrorMessage from "../components/ErrorMessage";
import { i18n }  from "../i18n";
import { SectionHeader } from "./custom";
import config from "../config";


const NotificationPreferences = (props) => {
  const { auth } = useContext(AuthContext);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const { token: tokenFromParams } = useParams();
  const [token,] = useState(tokenFromParams || null);
  const { language: languageFromParams } = useParams();
  const [language,] = useState(languageFromParams || null);
  //const [notificationsOriginal, setNotificationsOriginal] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const navigate = useNavigate();
  const { showDialog } = useDialog();
  const { showSnackbar } = useSnackbarContext();
  const { t } = useTranslation();

  //console.log("NotificationPreferences props:", props);
  //console.log("token from params:", token);

  useEffect(() => { // internal routing
    if (props.internalRouting) {
      //console.log("navigated here internally");
    } else { // external routing
      //console.log("navigated here externally or directly via URL");
      console.log("language from params:", language);
      i18n.changeLanguage(language);
    }
  }, []); //location, token]);

  const verifyToken = async (token) => {
    try {
      if (props.internalRouting) { // routing is internal, use auth user for authentication
        if (!auth.user) {
          throw new Error(t("You must be authenticated for this action"));
        }
        setUserId(auth.user.id);
        //setNotificationsOriginal(auth.user.preferences.notifications);
        setNotifications(auth.user.preferences.notifications);
        alert("Got notifications via internal routing: " + JSON.stringify(auth.user.preferences.notifications));
      } else { // routing is external, use token and /auth/notificationVerification call for authentication
        const result = await apiCall("post", "/auth/notificationVerification", { token });
        if (result.err) {
          throw new Error(result.message);
        } else {
          if (!result.user._id) {
            throw new Error(t("No user id from token"));
          } else {
            setUserId(result.user._id);
            //setNotificationsOriginal(result.user.preferences.notifications);
            setNotifications(result.user.preferences.notifications);
            alert("Got notifications via external routing: " + JSON.stringify(result.user.preferences.notifications));
          }
        }
      }
    } catch (error) {
      setUserId(false); // false means token error
      console.error(error.message);
      setError(
        error.message + ".\n\n" +
        t("Please") + " " +
        (auth?.user ? "" : t("authenticate (pressing the [Enter] button on top) and then")) +
        t("go to \"Profile\" in user's menu, and use \"Notifications preferences\" to change your notification preferences") + "."
      );
    }
  };

  useEffect(() => {
    if (userId === null) { // userId wasn't yet validated
      verifyToken(token);
    }
  }, []);

  const handleToggle = (section, key) => {
    setNotifications((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [key]: !prevState[section][key],
      },
    }));
  };
  
  const handleConfirm = async () => {

    if (props.action === "unsubscribe") { // unsubcribe action requested, set all section items to false
      if ((props.section === "all") || (props.section === "email")) {
        Object.keys(notifications[props.section]).forEach(notification => {
          notifications[props.section][notification] = false;
        });
      }
      if ((props.section === "all") || (props.section === "push")) {
        Object.keys(notifications[props.section]).forEach(notification => {
          notifications[props.section][notification] = false;
        });
      }
      if ((props.section === "all") || (props.section === "sms")) {
        Object.keys(notifications[props.section]).forEach(notification => {
          notifications[props.section][notification] = false;
        });
      }
    }
    await notificationsPreferencesSave(userId, notifications);
    // above function throws, if error we will not reach here
    showDialog({
      title: t("Preferences saved"),
      message: (props.action === "unsubscribe") ? t("Unsubscription completed") : t("Changes applied successfully"),
      confirmText: ("Close"),
      onConfirm: () => {
        close();
      },
    });
  };

  const close = () => {
    if (props.internalRouting) { // we came here from internal routing, can go back
      props.onClose();
    } else { // we came here from external routing, can't go back, must close
      window.close(); // close the window if it was opened as a new tab or popup
    }
  };

  const notificationsPreferencesSave = async (userId, newNotificationPreferences) => {
    const result = await apiCall("post",
      (props.internalRouting) ?
        "/auth/notificationPreferencesSaveInternal"
      :
        "/auth/notificationPreferencesSaveExternal"
      , { token, userId, notificationPreferences: newNotificationPreferences }
    );
    if (result.err) {
      showSnackbar(result.message, "error");
      throw new Error(result.message);
    }
    console.log("/auth/notificationPreferencesSave result:", result);
  };

  const renderSection = (sectionTitle, section, items) => {
    console.log("renderSection:", sectionTitle, section, items);
    return (
      <Grid container spacing={1} alignItems="flex-start">
        {/* section title on left */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" sx={{px: 2, mr: 2, backgroundColor: "secondary.main", borderRadius: 1 }}>
            {sectionTitle}
          </Typography>
        </Grid>

        {/* switches on right */}
        <Grid item xs={12} md={9}>
          {items.map(([title, description, key]) => (
            <Box key={key} sx={{ mb: 1 }}>
              <Grid container alignItems="center">
                <Grid item xs={8}>
                  <Typography variant="body1" fontWeight="bold">
                    {title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {description}
                  </Typography>
                </Grid>
                {(props.action !== "unsubscribe") && (
                  <Grid item xs={4} sx={{ pl: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications[section][key]}
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

  if (!userId) { // userId is null (initial condition) or false (error condition)
    return (
      <ErrorMessage message={error} />
    );
  }

  return (
    <>
      <SectionHeader>
        {props.section === "all" && t("Notification preferences")}
        {props.section === "email" && props.action === "preferences" && t("Email preferences")}
        {props.section === "email" && props.action === "unsubscribe" && t("Email unsubscribe")}
        {props.section === "push" && props.action === "preferences" && t("Push notifications preferences")}
        {props.section === "push" && props.action === "unsubscribe" && t("Push notifications unsubscribe")}
        {props.section === "sms" && props.action === "preferences" && t("SMS preferences")}
        {props.section === "sms" && props.action === "unsubscribe" && t("SMS unsubscribe")}
      </SectionHeader>

      <Container maxWidth="md">
        <Box>
          {/* email notifications */}
          {(props.section === "all" || props.section === "email") &&
            <>
              {renderSection("Email", "email",
                (props.action === "unsubscribe") ?
                [
                  [t("Unsubscribe from all email notifications"), t("Unsubscribe from all emails from {{company}}", {company: config.company.name}), "all"],
                ]
                  :
                [
                  [t("News and updates"), t("Get updates about product and feature changes"), "newsUpdates"],
                  [t("Tips and tutorials"), t("Learn how to get the most out of our platform"), "tipsTutorials"],
                  [t("Reminders"), t("Notifications for tasks or updates you might have missed"), "reminders"],
                ]
              )}
              <Divider sx={{ my: 1 }} />
            </>
          }

          {/* push notifications */}
          {(props.section === "all" || props.section === "push") &&
            <>
              {renderSection("Push", "push",
                (props.action === "unsubscribe") ?
                [
                  [t("Unsubscribe from all push notifications"), t("Unsubscribe from all push notifications from {{company}}", {company: config.company.name}), "newsUpdates"],
                ]
                  :
                [
                  [t("Reminders"), t("Notifications for tasks or updates you might have missed"), "reminders"],
                ]
              )}
              <Divider sx={{ my: 1 }} />
            </>
          }

          {/* SMS notifications */}
          {(props.section === "all" || props.section === "sms") &&
            <>
              {renderSection("SMS", "sms",
                (props.action === "unsubscribe") ?
                [
                  [t("Unsubscribe from all push notifications"), t("Unsubscribe from all push notifications from {{company}}", {company: config.company.name}), "newsUpdates"],
                ]
                  :
                [
                  [t("Transaction alerts"), t("Receive alerts for transactions and payments"), "transactionAlerts"],
                  [t("Marketing messages"), t("Get promotional offers and updates"), "marketingMessages"],
                ]
              )}
              {/* <Divider sx={{ my: 1 }} /> */}
            </>
          }

          {/* close button */}
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
    </>
  );
};

export default React.memo(NotificationPreferences);
