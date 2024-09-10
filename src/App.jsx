import React, { useState, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, Container, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "./providers/AuthProvider";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Contacts from "./components/Contacts";
import Products from "./components/Products";
import { ToastContainer/*, toast*/ } from "./components/Toast";
import { themeLight, themeDark } from "./themes/default";
import config from "./config";

const SignIn = lazy(() => import("./components/auth/SignIn"));

const App = () => {
  const [theme, setTheme] = useState(config.ui.themeMode === "light" ? themeLight : themeDark);

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <CssBaseline />
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
            {/* Main content area which grows and allows scrolling */}
            <Box
              component="main"
              // sx={{
              //   flexGrow: 1,         // Take up available vertical space
              //   overflowY: "auto",   // Scroll when content overflows
              //   position: "relative", // Relative to make content flow behind footer
              //   py: 3,
              // }}
              sx={{
                flexGrow: 1, // takes up the remaining height
                display: "flex",
                flexDirection: "column",
                overflow: "auto", // ensures the main content scrolls, not the footer
                py: 3, // to account for header elevation, and to space a bit
              }}
            >
              <Container sx={{ flexGrow: 1 }}>
                <Routes>
                  <Route exact path="/" element={<Home />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/contacts" element={<Contacts />} />
                </Routes>
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
