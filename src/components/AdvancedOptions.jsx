//import React from "react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Upload as UploadIcon,
  Download as DownloadIcon,
  AccountCircle as ProfileIcon,
  Brightness6 as ThemeIcon,
  BugReport as DebugIcon,
  Info as InfoIcon,
  DeleteForever as DeleteIcon,
  PersonOff as PersonOffIcon,
  Drafts as DraftsIcon,
} from "@mui/icons-material";
import { AuthContext } from "../providers/AuthContext";
import { isAdmin } from "../libs/Validation";
import { StyledPaper, StyledBox, StyledPaperSmall, StyledBoxSmall } from './JobStyles';
import { SectionHeader1, useTheme } from 'mui-material-custom';

const AdvancedOptions = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { t } = useTranslation();
  const theme = useTheme();

  const groupedTools = {
    Administration: [
      {
        label: t("Users Handling"),
        subtitle: t("Manage users"),
        icon: <ProfileIcon fontSize="large" />,
        action: "/handle-users"
      },
    ],
    System: [
      {
        label: "Export Data",
        subtitle: "Export your jobs data to QCode",
        icon: <DownloadIcon fontSize="large" />,
        action: "/job-data-export"
      },
      {
        label: "Import Data",
        subtitle: "Import job data from QRCode",
        icon: <UploadIcon fontSize="large" />,
        action: "/job-data-import"
      },
      {
        label: "Edit Email Template",
        subtitle: "Modify the default email template to be sent to the doctor",
        icon: <DraftsIcon fontSize="large" />,
        action: "/job-email-template-edit"
      },
      // {
      //   label: "Debug Info",
      //   subtitle: "View system debugging information",
      //   icon: <DebugIcon fontSize="large" />,
      //   action: "/debug"
      // }
    ],
    // User: [
    //   {
    //     label: "User Profile",
    //     subtitle: "Manage your personal information",
    //     icon: <ProfileIcon fontSize="large" />,
    //     action: "/profile"
    //   },
    //   {
    //     label: "Change Theme",
    //     subtitle: "Switch between light and dark modes",
    //     icon: <ThemeIcon fontSize="large" />,
    //     action: "/theme"
    //   }
    // ],
    // Other: [
    //   {
    //     label: "Info About App",
    //     subtitle: "Learn more about this application",
    //     icon: <InfoIcon fontSize="large" />,
    //     action: "/about"
    //   }
    // ],
    "Danger Zone": [
      {
        label: "Remove All Jobs Data",
        subtitle: "Permanently delete all your jobs data",
        icon: <DeleteIcon fontSize="large" sx={{ color: "error.main" }} />,
        action: "/job-data-remove"
      },
      {
        label: "Completely Remove Your Account",
        subtitle: "Delete your account and all associated data",
        icon: <PersonOffIcon fontSize="large" sx={{ color: "error.main" }} />,
        action: "/account-remove"
      }
    ]
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <SectionHeader1>
        {t("Advanced Tools")}
      </SectionHeader1>

      {Object.entries(groupedTools).map(([section, tools], idx) => {
        if ((section === "Administration") && !isAdmin(auth.user)) {
          return; // skip Administration section for not admin users
        }
        return (
          <Box key={section} sx={{ mt: idx === 0 ? 3 : 5 }}>
            <StyledPaper>
              <StyledBox sx={{
                ...(section === "Danger Zone" && {
                  backgroundColor: 'error.main',
                  color: theme.palette.common.white,
                }),
              }}>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                 
                >
                  {section}
                </Typography>
              </StyledBox>
            {/* <Typography
              variant="h6"
              gutterBottom
              color={section === "Danger Zone" ? "error" : "text.primary"}
            >
              {section}
            </Typography>
            <Divider sx={{ mb: 2 }} /> */}

              <List>
                {tools.map(({ label, subtitle, icon, action }) => (
                  <ListItemButton
                    key={label}
                    onClick={() => navigate(action)}
                    sx={{
                      borderRadius: 2,
                      m: 1.5,
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
            </StyledPaper>
          </Box>
        );
      })}
    </Container>
  );
};

export default AdvancedOptions;
