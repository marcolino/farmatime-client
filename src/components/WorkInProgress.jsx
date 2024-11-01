import React from "react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Grid, Box, Typography, /*Link,*/ useMediaQuery } from "@mui/material";
import { Button } from "./custom";
import WorkInProgressImage from "../assets/icons/WorkInProgress.png";


const WorkInProgress = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isLandscape = useMediaQuery(theme.breakpoints.up("sm"));
  const retry = () => {
    const maintenancePath = (localStorage.getItem("x-maintenance-path"));
    navigate(maintenancePath ?? "/");
    localStorage.removeItem("x-maintenance-path");
  };

  return (
    <Box 
      sx={{ 
        display: "flex",
        alignItems: "center",
        p: 2,
      }}
    >
      <Grid 
        container 
        spacing={2} 
        direction={isLandscape ? "row" : "column"}
        alignItems="center"
      >
        <Grid item xs={12} sm={6} sx={{ textAlign: "center" }}>
          <Box
            component="img"
            sx={{
              maxWidth: "100%",
              maxHeight: { xs: "16rem", sm: "40rem", md: "48rem", lg: "56rem", xl: "64rem" },
              mt: { xs: "7rem", sm: "7.5rem", md: "8rem", lg: "8.5rem", xl: "9rem" },
              objectFit: "contain",
            }}
            alt="Work in progress"
            src={WorkInProgressImage}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{
            mt: 4,
            textAlign: "left",
            fontSize: { xs: "1.1rem", sm: "1.2rem", md: "1.3rem", lg: "1.4rem", xl: "1.5rem" }
          }}>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 2,
                fontWeight: "bold",
              }}
            >
              {`${t("Work in progress")}!`}
            </Typography>
            <Typography 
              variant="body1"
              sx={{ 
                mb: 2,
              }}
            >
              {t("We are working hard to restore the functionality of this web app. Please come back soon")}!
            </Typography>
            {/* <Link 
              href="/" //{retry}
              color="warning"
              sx={{ 
                display: "inline-block",
              }}
            >
              {t("Retry")}
            </Link> */}
            <Button
              color="primary" fullWidth={false} size={"large"}
              onClick={retry}
            >
              {t("Retry")}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default React.memo(WorkInProgress);
