import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
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
import { apiCall } from "../libs/Network";
import ErrorMessage from "../components/ErrorMessage";
import { objectsAreEqual } from "../libs/Misc";
import { i18n }  from "../i18n";
import { SectionHeader } from "./custom";
import config from "../config";


const NotificationPreferences = (props) => {
  const { auth } = useContext(AuthContext); // TODO: use auth if no token, and routing is internal
  const location = useLocation();
  const [userId, setUserId] = useState(null); // null is userId initial value
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams(); // this page can be reached exterally, without a logged user
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarContext(); 
  const { t } = useTranslation();

  let token, language = null;

  console.log("NotificationPreferences props:", props);

  /**
   * tell if routing is internal or external
   * (this component should be called internally this way:
   *   navigate("/my-component", { state: { from: "internal" } });
   * )
   */
  useEffect(() => {
    if (props.routing === "internal") {
      console.log("navigated here internally");
    } else {
      console.log("navigated here externally or directly via URL");
      token = searchParams.get("token");
      console.log("token:", token);
      language = searchParams.get("language");
      console.log("language:", token);
      i18n.changeLanguage(language);
    }
  }, [location]);

  const verifyToken = async (token) => {
    try {
      if (props.routing === "internal") { // routing is internal, use auth user for authentication
        if (!auth.user) {
          throw new Error(t("You must be authenticated for this action"));
        }
        setUserId(auth.user.id);
      } else { // routing is external, use token and /auth/notificationVerification call for authentication
        const result = await apiCall("post", "/auth/notificationVerification", { token });
        if (result.err) {
          throw new Error(result.message);
        } else {
          if (!result.userId) {
            throw new Error(t("No user id from token"));
          } else {
            setUserId(result.userId);
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
  }, [userId]);

  const data = {
    "email": {
      newsUpdates: true, // TODO: how to set the defaults?
      tipsTutorials: false,
      userResearch: true,
      comments: true,
      reminders: false,
    },
    "push": {
      comments: true,
      reminders: false,
      activity: false,
    },
    "sms": {
      transactionAlerts: true,
      marketingMessages: false,
    },
  };

  const [notificationsOriginal,] = useState(data);
  const [notifications, setNotifications] = useState(data);

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
    await notificationsPreferencesSave(userId, notifications); // TODO (update user)
    if (props.routing === "internal") { // we came here from internal routing, can go back
      if (!objectsAreEqual(notifications, notificationsOriginal)) {
        showSnackbar(t("Changes applied successfully"), "success");
      }
      navigate(-1); // navigate back
    } else { // we came here from external routing, can't go back, must close
      window.close(); // close the window if it was opened as a new tab or popup
    }
  };

  const notificationsPreferencesSave = async (userId, newNotificationPreferences) => {
    const result = await apiCall("post", "/auth/notificationPreferencesSave", { userId, newNotificationPreferences });
    if (result.err) {
      throw new Error(result.message);
    }
    console.log("/auth/notificationPreferencesSave result:", result);
  };

  const renderSection = (sectionTitle, section, items) => {
    console.log("renderSection:", sectionTitle, section, items);
    return (
      <Grid container spacing={2} alignItems="flex-start">
        {/* section title on left */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" sx={{px: 2, backgroundColor: "secondary.main", borderRadius: 1 }}>
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
                <Grid item xs={4} sx={{pl: 2}}>
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
                  [t("Unsubscribe from all email notifications"), t("Unsubsribe from all emails from {{company}}", {company: config.company.name}), "newsUpdates"],
                ]
                  :
                [
                  [t("News and updates"), t("Get updates about product and feature changes"), "newsUpdates"],
                  [t("Tips and tutorials"), t("Learn how to get the most out of our platform"), "tipsTutorials"],
                  //[t("Comments"), t("Get notified about comments and replies to your posts"), "comments"],
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
                  [t("Unsubscribe from all push notifications"), t("Unsubsribe from all push notifications from {{company}}", {company: config.company.name}), "newsUpdates"],
                ]
                  :
                [
                  //[t("Comments"), t("Get notified about comments and replies to your posts."), "comments"],
                  [t("Reminders"), t("Notifications for tasks or updates you might have missed"), "reminders"],
                  //[t("More activity about you"), t("Updates about likes and reactions to your posts."), "activity"],
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
                  [t("Unsubscribe from all push notifications"), t("Unsubsribe from all push notifications from {{company}}", {company: config.company.name}), "newsUpdates"],
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