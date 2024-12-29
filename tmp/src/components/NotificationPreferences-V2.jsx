import React, { useState } from "react";
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Container,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";


const NotificationPreferences = () => {
  const [notifications, setNotifications] = useState({
    email: {
      newsUpdates: true,
      tipsTutorials: false,
      userResearch: true,
      comments: true,
      reminders: false,
    },
    push: {
      comments: true,
      reminders: false,
      activity: false,
    },
    sms: {
      transactionAlerts: true,
      marketingMessages: false,
    },
  });

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const handleToggle = (section, key) => {
    setNotifications((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [key]: !prevState[section][key],
      },
    }));
  };

  const renderSwitches = (section, items) =>
    items.map(([label, key]) => (
      <Grid container spacing={2} alignItems="center" key={key}>
        <Grid item xs={12} md={6}>
          <Typography>{label}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
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
    ));

  return (
    <Container maxWidth="sm">
      <Box>
        <Typography variant="h5" gutterBottom>
          Notification Preferences
        </Typography>

        {/* Email Notifications */}
        <Typography variant="h6" gutterBottom>
          Email Notifications
        </Typography>
        <Grid container spacing={isDesktop ? 4 : 2}>
          {renderSwitches("email", [
            ["News and updates", "newsUpdates"],
            ["Tips and tutorials", "tipsTutorials"],
            ["User research", "userResearch"],
            ["Comments", "comments"],
            ["Reminders", "reminders"],
          ])}
        </Grid>
        <Divider sx={{ my: 2 }} />

        {/* Push Notifications */}
        <Typography variant="h6" gutterBottom>
          Push Notifications
        </Typography>
        <Grid container spacing={isDesktop ? 4 : 2}>
          {renderSwitches("push", [
            ["Comments", "comments"],
            ["Reminders", "reminders"],
            ["More activity about you", "activity"],
          ])}
        </Grid>
        <Divider sx={{ my: 2 }} />

        {/* SMS Notifications */}
        <Typography variant="h6" gutterBottom>
          SMS Notifications
        </Typography>
        <Grid container spacing={isDesktop ? 4 : 2}>
          {renderSwitches("sms", [
            ["Transaction alerts", "transactionAlerts"],
            ["Marketing messages", "marketingMessages"],
          ])}
        </Grid>
      </Box>
    </Container>
  );
};

export default React.memo(NotificationPreferences);