import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Box, Container, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "./providers/AuthProvider";
import Routing from "./components/Routing";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastContainer/*, toast*/ } from "./components/Toast";
import { themeLight, themeDark } from "./themes/default";
import config from "./config";

const App = () => {
  const [theme] = useState(config.ui.themeMode === "light" ? themeLight : themeDark);

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <CssBaseline />
        {/* <Suspense fallback={<div>Loading...</div>}> */}
        <Router>
          {/* flex container with column direction and full-height view */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh", // full viewport height, ensures the footer is at the bottom when content is short
            }}
          >
            <Header isLoggedIn={true} />
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
              <Container sx={{ flexGrow: 1 }}>
                <Routing />
              </Container>
            </Box>
            <Footer />
          </Box>
        </Router>
      </AuthProvider>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default App;
