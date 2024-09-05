import React, { useState } from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
//import { MuiThemeProvider, CssBaseline, createMuiTheme } from 'material-ui/styles';
import themeLight from "./themes/themeLight";
import themeDark from "./themes/themeDark";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  const [theme, setTheme] = useState(themeLight);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme.palette.mode === "light" ? themeDark : themeLight));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header isLoggedIn={true} />
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <Footer />
    </ThemeProvider>
  );
}

export default App;