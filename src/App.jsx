import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Box, Container, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import SnackbarProviderWrapper from "./providers/SnackbarManager";
import { AuthProvider } from "./providers/AuthProvider";
import { OnlineStatusProvider } from "./providers/OnlineStatusProvider";
import { LoaderProvider} from "./providers/LoaderProvider";
import SessionManager from "./providers/SessionManager";
import Routing from "./components/Routing";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";
import Banner from "./components/Banner";
import ClientInfoDisplay from "./components/ClientInfoDisplay";
//import { MomentProvider } from "./providers/MomentProvider"; 
import { useAxiosLoader } from "./hooks/useAxiosLoader";
//import useInactivityTimer from "./hooks/useInactivityTimer";
import { themeLight, themeDark } from "./themes/default";
//import { i18n }  from "./i18n";
import config from "./config";

const App = () => {
  //console.log("App");
  const [loading] = useAxiosLoader();
  const [theme, setTheme] = useState(config.ui.themeMode === "light" ? themeLight : themeDark);
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme.palette.mode === "light" ? themeDark : themeLight));
  };

  const handleLogout = () => {
    console.log("USER LOGGED OUT DUE TO INACTIVITY");
    window.location.href = "/"; // TODO...
    // setShowPrompt(true);
  };
  // const [showPrompt, setShowPrompt] = useState(false);
  
  // const handleTimeout = () => {
  //   setShowPrompt(true);
  // };

  // useInactivityTimer(10000 /*10 * 60 * 1000*/, handleTimeout); // 10 minutes (TODO: to config)
  // const handleExtendSession = () => {
  //   setShowPrompt(false);
  // };

  // initialize Moment.js locale based on the detected language
  //setMomentLocale(i18n.language || i18n.options.fallbackLng[0]);

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <OnlineStatusProvider>
          {/* <MomentProvider> */}
            <CssBaseline />
            <LoaderProvider>
              <Loader loading={loading} />
              <SnackbarProviderWrapper>
                <Router>
                  <SessionManager onLogout={handleLogout} />
                  {/* {config.mode.development && <Banner theme={theme} text="development" />} */}
                  {config.mode.development && <ClientInfoDisplay theme={theme} />}
                  {/* TODO: put this block in a separate component, say "Contents" */}
                  {/* flex container with column direction and full-height view */}
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
                        _width: "100%",
                        maxWidth: "100% !important",
                      }}>
                        <Routing />
                      </Container>
                    </Box>
                    <Footer />
                    <CookieBanner />
                  </Box>
                </Router>
              </SnackbarProviderWrapper>
            </LoaderProvider>
          {/* </MomentProvider>, */}
        </OnlineStatusProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
