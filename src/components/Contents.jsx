import React from "react";
//import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Container } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
//import { useSnackbarContext } from "../providers/SnackbarProvider"; 


function Contents({ theme, toggleTheme, children }) {
  //const location = useLocation();
  //const { showSnackbar } = useSnackbarContext(); 
  const { i18n } = useTranslation();

  
  return (
    <Box
      sx={{ // flex container with column direction and full-height view
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // full viewport height, ensures the footer is at the bottom when content is short
      }}
    >
      <Header theme={theme} toggleTheme={toggleTheme} />
      {/* main content area which grows and allows scrolling */}
      <Box component="main"
        sx={{
          flexGrow: 1, // takes up the remaining height
          display: "flex",
          flexDirection: "column",
          overflow: "auto", // ensures the main content scrolls, not the footer
          py: 3, // to account for header elevation, and to space a bit
        }}
      >
        <Container sx={{
          flexGrow: 1,
          disableGutters: true,
          maxWidth: "100% !important",
        }}>

          {children}

        </Container>
      </Box>
      <Footer />
    </Box>
  );
}

export default React.memo(Contents);
