import React from "react";
import { Grid, Box, Container, Typography, Link, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import PageNotFoundImage from "../assets/images/PageNotFound.png";


const PageNotFound = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column", // vertical stack on mobile
            md: "row", // horizontal layout on larger screens
          },
          height: "100vh",
          width: "100%",
        }}
      >
        {/* Image Section */}
        <Box
          sx={{
            width: {
              xs: "100%", // full width on mobile
              md: "50%", // half width on larger screens
            },
            height: {
              xs: "50%", // half height on mobile
              md: "100%", // full height on larger screens
            },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 2,
          }}
        >
          <Box
            component="img"
            alt={t("Page not found image")}
            src={PageNotFoundImage}
            sx={{
              width: "75%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
          </Box>
        </Box>

        {/* Text Section */}
        <Box
          sx={{
            width: {
              xs: "100%", // full width on mobile
              md: "50%", // half width on larger screens
            },
            height: {
              xs: "50%", // half height on mobile
              md: "100%", // full height on larger screens
            },
            display: "flex",
            justifyContent: "center",
            alignItems: {
              xs: "top",
              md: "center",
            },
            padding: 2,
          }}
        >
          <Box 
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2, // adds space between Typography components
              width: "100%"
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                //textAlign: "left",
                fontWeight: "bold",
              }}
            >
              {t("Oooops!")}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                //textAlign: "left",
              }}
            >
              {t("I've lost the page you did request! Sorry…")}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default React.memo(PageNotFound);
