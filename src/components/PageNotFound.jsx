import React from "react";
import { Grid, Box, Typography, Link, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import PageNotFoundImage from "../assets/icons/PageNotFound.png";


const PageNotFound = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isLandscape = useMediaQuery(theme.breakpoints.up("sm"));

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
            alt="Not found image"
            // src={"/src/assets/icons/NotFound.png"}
            src={PageNotFoundImage}
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
              {t("Oooops!")}
            </Typography>
            <Typography 
              variant="body1"
              sx={{ 
                mb: 2,
              }}
            >
              {t("Perhaps you did request a wrong page? I couldn't find it...")}.
            </Typography>
            <Link 
              href="/"
              color="warning"
              sx={{ 
                display: "inline-block",
              }}
            >
              {t("Go back to home page")}
            </Link>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default React.memo(PageNotFound);
