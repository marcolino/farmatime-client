import { createTheme } from "@mui/material/styles";
//import { createMuiTheme } from "@mui/material/styles";
//import { unstable_createMuiStrictModeTheme as createMuiTheme } from "@mui/material/styles"; // TEMPORARY: temporary, to solve material-ui drawer "findDOMNode is deprecated in StrictModefindDOMNode is deprecated in StrictMode" warning
//import blueGrey from "@mui/material/colors/blueGrey";
import lightGreen from "@mui/material/colors/lightGreen";
import grey from "@mui/material/colors/grey";
import amber from "@mui/material/colors/amber";
import red from "@mui/material/colors/red";


export default createTheme({
  typography: {
    // fontFamily: `Roboto`,
    fontFamily: `'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Open Sans', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'`,
    button: {
      textTransform: "none", // avoid buttons to be uppercase
    }
  },
  overrides: {
    MuiInputBase: {
      // fontFamily: `'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Open Sans', 'Roboto', 'Oxygen',
      // 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'`,
      input: {
      //   fontFamily: `'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Open Sans', 'Roboto', 'Oxygen',
      // 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'`,
        "&:-webkit-autofill": {
      //     fontFamily: `'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Open Sans', 'Roboto', 'Oxygen',
      // 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'`,
          transitionDelay: "9999s",
          transitionProperty: "background-color, color",
        },
      },
    },
  },
  palette: {
    base: {
      backgroundColor: "#fafafa",
    },
    primary: {
      light: "#42c2f5",
      main: "rgba(0,0,0,0.5)",
      dark: "#778899",
      //contrastText: "red", //"#fff"
      // light: blueGrey[100],
      // main: blueGrey[200],
      // dark: blueGrey[300],
      contrastText: "#fff",
    },
    secondary: {
      light: lightGreen[100],
      main: lightGreen[300],
      dark: lightGreen[500],
    },
    danger: {
      color: "#fff",
      backgroundColor: red[400],
    },
    header: {
      color: grey[900],
      backgroundColor: amber[50],
    },
    title: {
      color: grey[100],
      backgroundColor: "#778899",
    },
    socialButtons: {
      facebook: {
        backgroundColor: "#1877f2",
      },
      google: {
        backgroundColor: "#db4437",
      },
    },
  },
});
