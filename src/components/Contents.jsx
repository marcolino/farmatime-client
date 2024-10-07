import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import queryString from "query-string";
import { useTranslation } from "react-i18next";
import { Box, Container, CssBaseline } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
import { getCurrentLanguage } from "../libs/I18n";
//import useSnackbar from "../providers/SnackbarManager";
import { useSnackbarContext } from "../providers/SnackbarProvider"; 
import Loader from "./Loader";
import { themeLight, themeDark } from "../themes/default";


function Contents({ theme, toggleTheme, children }) {
  const location = useLocation();
  //const { showSnackbar } = useSnackbar();
  const { showSnackbar } = useSnackbarContext(); 
  const { i18n } = useTranslation();
  // const [theme, setTheme] = useState(config.ui.themeMode === "light" ? themeLight : themeDark);

  // const toggleTheme = () => {
  //   setTheme((prevTheme) => (prevTheme.palette.mode === "light" ? themeDark : themeLight));
  // };

  /* flex container with column direction and full-height view */
  return (
    <Box
      sx={{
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
