import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Box,
  Divider
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
      icon: <UploadIcon fontSize="large" />,
      action: "/job-data-import"
    },
    {
      label: "Export Data",
      icon: <DownloadIcon fontSize="large" />,
      action: "/job-data-export"
    },
    {
      label: "Debug Info",
      icon: <DebugIcon fontSize="large" />,
      action: "/debug"
    }
  ],
  User: [
    {
      label: "User Profile",
      icon: <ProfileIcon fontSize="large" />,
      action: "/profile"
    },
    {
      label: "Change Theme",
      icon: <ThemeIcon fontSize="large" />,
      action: "/theme"
    }
  ],
  Other: [
    {
      label: "About App",
      icon: <InfoIcon fontSize="large" />,
      action: "/about"
    }
  ],
  "Danger Zone": [
    {
      label: "Remove All Patients Data",
      icon: <DeleteIcon fontSize="large" sx={{ color: "error.main" }} />,
      action: "/danger/delete-data"
    },
    {
      label: "Completely Remove Your Account",
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
        Advanced Options
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

          <Grid container spacing={3}>
            {tools.map(({ label, icon, action }) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={label}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderColor: section === "Danger Zone" ? "error.main" : undefined,
                    border: section === "Danger Zone" ? "1px solid" : undefined
                  }}
                >
                  <CardActionArea
                    onClick={() => navigate(action)}
                    sx={{ flexGrow: 1 }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2
                      }}
                    >
                      {icon}
                      <Typography
                        variant="subtitle1"
                        align="center"
                        color={section === "Danger Zone" ? "error" : "text.primary"}
                      >
                        {label}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Container>
  );
};

export default AdvancedOptions;
