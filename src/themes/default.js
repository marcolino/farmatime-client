// for full theme values, see https://mui.com/material-ui/customization/default-theme/

import { createTheme } from "@mui/material/styles";

// base theme
const baseTheme = createTheme({
  spacing: 8,
  typography: {
    fontFamily: "Open Sans",
    fontSize: 18,
    subtitle1: {
      fontSize: "clamp(1rem, 1.1429rem + .5857vw, 2rem)",
    },
    button: {
      textTransform: "none", // avoid buttons to be uppercase
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

// light theme
const themeLight = createTheme({
  ...baseTheme,
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
      text: "#eeeeee",
    },
    background: {
      default: "#eeeeee",
      paper: "#f5f5f5",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.6)",
    },
  },
});

// dark theme
const themeDark = createTheme({
  ...baseTheme,
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    background: {
      default: "#303030",
      paper: "#424242",
    },
    text: {
      primary: "rgba(255, 255, 255, 1)",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
  },
});

export { themeLight, themeDark };
