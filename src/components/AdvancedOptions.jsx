import React from "react";
import {
  Container,
  Typography,
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import {
  Upload as UploadIcon,
  Download as DownloadIcon,
  AccountCircle as ProfileIcon,
  Brightness6 as ThemeIcon,
  BugReport as DebugIcon,
  Info as InfoIcon,
  DeleteForever as DeleteIcon,
  PersonOff as PersonOffIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const groupedTools = {
  System: [
    {
      label: "Import Data",
      subtitle: "Upload job-related data files",
      icon: <UploadIcon fontSize="large" />,
      action: "/job-data-import"
    },
    {
      label: "Export Data",
      subtitle: "Download your job data for backup",
      icon: <DownloadIcon fontSize="large" />,
      action: "/job-data-export"
    },
    {
      label: "Debug Info",
      subtitle: "View system debugging information",
      icon: <DebugIcon fontSize="large" />,
      action: "/debug"
    }
  ],
  User: [
    {
      label: "User Profile",
      subtitle: "Manage your personal information",
      icon: <ProfileIcon fontSize="large" />,
      action: "/profile"
    },
    {
      label: "Change Theme",
      subtitle: "Switch between light and dark modes",
      icon: <ThemeIcon fontSize="large" />,
      action: "/theme"
    }
  ],
  Other: [
    {
      label: "About App",
      subtitle: "Learn more about this application",
      icon: <InfoIcon fontSize="large" />,
      action: "/about"
    }
  ],
  "Danger Zone": [
    {
      label: "Remove All Patients Data",
      subtitle: "Permanently delete all patient records",
      icon: <DeleteIcon fontSize="large" sx={{ color: "error.main" }} />,
      action: "/danger/delete-data"
    },
    {
      label: "Completely Remove Your Account",
      subtitle: "Delete your account and all associated data",
      icon: <PersonOffIcon fontSize="large" sx={{ color: "error.main" }} />,
      action: "/danger/remove-account"
    }
  ]
};

const AdvancedOptions = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Advanced Tools
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        These tools are intended for experienced users. Use with caution!
      </Typography>

      {Object.entries(groupedTools).map(([section, tools], idx) => (
        <Box key={section} sx={{ mt: idx === 0 ? 3 : 5 }}>
          <Typography
            variant="h6"
            gutterBottom
            color={section === "Danger Zone" ? "error" : "text.primary"}
          >
            {section}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <List disablePadding>
            {tools.map(({ label, subtitle, icon, action }) => (
              <ListItemButton
                key={label}
                onClick={() => navigate(action)}
                sx={{
    borderRadius: 2,
    mb: 1,
    border: "1px solid",                // add solid 1px border for all
    borderColor: section === "Danger Zone" ? "error.main" : "grey.400", // red for danger, grey otherwise
    "&:hover": {
      backgroundColor:
        section === "Danger Zone"
          ? "rgba(211, 47, 47, 0.1)"
          : "action.hover",
      borderColor:
        section === "Danger Zone"
          ? "error.main"
          : "text.primary"
    }
  }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 48,
                    color: section === "Danger Zone" ? "error.main" : "inherit"
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle1"
                      color={section === "Danger Zone" ? "error" : "text.primary"}
                    >
                      {label}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {subtitle}
                    </Typography>
                  }
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      ))}
    </Container>
  );
};

export default AdvancedOptions;
