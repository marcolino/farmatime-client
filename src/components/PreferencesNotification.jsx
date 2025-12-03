import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
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
import { AuthContext } from "../providers/AuthContext";
import { useSnackbarContext } from "../hooks/useSnackbarContext";
import { useDialog } from "../providers/DialogContext";
import { apiCall } from "../libs/Network";
import { i18n }  from "../i18n";
import config from "../config";


const PreferencesNotification = (props) => {
  const { auth, updateSignedInUserPreferences } = useContext(AuthContext);
  const [userId, setUserId] = useState(null);
  const { token, language } = useParams();
  const [notifications, setNotifications] = useState(null);
  const { showDialog } = useDialog();
  const { showSnackbar } = useSnackbarContext();
  const { t } = useTranslation();

  useEffect(() => { // internal routing
    if (props.internalRouting) {
      //console.log("navigated here internally");
    } else { // external routing
      i18n.changeLanguage(language);
    }
  }, [token, language, props.internalRouting]);

  const verifyToken = useCallback(async (token) => {
    try {
      if (props.internalRouting) {
        if (!auth.user) throw new Error(t("You must be authenticated for this action"));
        setUserId(auth.user.id);
        setNotifications(auth.user.preferences.notifications);
      } else {
        const result = await apiCall("post", "/auth/notificationVerification", { token });
        if (result.err) throw new Error(result.message);
        if (!result.user._id) throw new Error(t("No user id from token"));
        setUserId(result.user._id);
        setNotifications(result.user.preferences.notifications);
      }
    } catch (error) {
      setUserId(false);
      console.error(error.message);
      showDialog({
        title: t("Authentication error"),
        message:
          error.message + ".\n\n" +
          t("Please") + " " +
          (auth?.user ? "" : t("authenticate (pressing the [Enter] button on top) and then")) +
          t("go to \"Profile\" in user's menu, and use \"Notifications preferences\" to change your notification preferences") + ".",
        confirmText: t("Ok")
      });
    }
  }, [props.internalRouting, auth, t, showDialog]);

  useEffect(() => {
    if (userId === null) { // userId wasn't yet validated
      verifyToken(token);
    }
  }, [token, userId, verifyToken]);

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
    // showDialog({
    //   title: t("Preferences saved"),
    //   message: (props.action === "unsubscribe") ? t("Unsubscription completed") : t("Changes applied successfully"),
    //   confirmText: ("Close"),
    //   onConfirm: () => {
    //     close();
    //   },
    // });
    showSnackbar((props.action === "unsubscribe") ? t("Unsubscription completed") : t("Notification preferences saved successfully"), "success");
    close();
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
    } else {
      //console.log(`*** notificationPreferencesSave${(props.internalRouting) ? "Internal" : "External"} result:`, result);
      if (auth.user?.id === result.user._id) { // the user is the logged one
        // update user preferences field in auth
        const updatedUser = auth.user;
        updatedUser.preferences = result.user.preferences;
        updateSignedInUserPreferences(updatedUser);
      }
      //navigate("/", { replace: true });
    }
    //console.log("/auth/notificationsPreferencesSave result:", result);
  };

  const renderSection = (sectionTitle, section, items) => {
    return (
      <Grid container spacing={1} alignItems="flex-start">
        {/* section title on left */}
        <Grid item xs={12} md={3}>
          <Box sx={{ backgroundColor: "secondary.main", borderRadius: 1 }}>
            <Typography variant="h6" sx={{ px: 4 }}>
            {sectionTitle}
            </Typography>
            </Box>
        </Grid>

        {/* description and switches on right */}
        <Grid item xs={12} md={9}>
          {items.map(([title, description, key]) => (
            <Box key={key} sx={{ mb: 0.2 }}>
              <Grid container alignItems="center">
                <Grid item xs={8}>
                  <Typography variant="body1" fontWeight="bold" s_x={{lineHeight: 1.2}}>
                    {title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{lineHeight: 1.1}}>
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

  // if (!userId) { // userId is null (initial condition) or false (error condition)
  //   showDialog({
  //     title: t("Authentication error"),
  //     message: error,
  //     confirmText: t("Ok"),
  //   })
  //   return;
  //   // return (
  //   //   <ErrorMessage message={error} />
  //   // );
  // }

  if (!userId) {
    return null;
  }

  return (
    <>
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
                  [t("Offers"), t("New special offers"), "offers"],
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
              color="primary"
              variant="contained"
              onClick={handleConfirm}
              sx={{mx: 1}}
            >
              {t("Confirm")}
            </Button>
            <Button
              color="secondary"
              variant="contained"
              onClick={close}
              sx={{mx: 1}}
            >
              {t("Cancel")}
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default React.memo(PreferencesNotification);
