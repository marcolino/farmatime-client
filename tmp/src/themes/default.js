// for full theme values, see https://mui.com/material-ui/customization/default-theme/

import { createTheme, responsiveFontSizes, alpha, getContrastRatio } from "@mui/material/styles";
import { deepMergeObjects } from "../libs/Misc";

// custom colors
const violet = "#7F00FF";

// custom base theme props
const customBaseThemeProps = {
  spacing: 8,
  typography: {
    fontFamily: "Open Sans",
    fontSize: 17,
    subtitle1: {
      fontSize: "clamp(1rem, 1.1429rem + .5857vw, 2rem)",
    },
    button: {
      textTransform: "none", // avoid buttons text to be uppercase
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
};

// custom colors theme props
const customColorsThemeProps = {
  // palette: {
  //   ochre: {
  //     main: '#E3D026',
  //     light: '#f4eca3',
  //     dark: '#A29415',
  //     contrastText: '#242105',
  //   },
  //   violet: {
  //     main: alpha(violet, 0.7),
  //     light: alpha(violet, 0.5),
  //     dark: alpha(violet, 0.9),
  //     contrastText: getContrastRatio(alpha(violet, 0.7), '#fff') > 4.5 ? '#fff' : '#111',
  //   },
  // }
};

// custom light theme props
const customThemeLightProps = {
  palette: {
    mode: "light",
    primary: {
      main: "rgba(116, 202, 31, 0.8)",
    },
    secondary: {
      main: "rgba(131, 255, 54, 0.8)",
    },
    tertiary: {
      main: "rgba(73, 159, 19, 0.543)",
    },
    background: {
      default: "#ecf7ff",
      paper: "#d9daff",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.77)",
    },

    ochre: {
      main: '#E3D026',
      light: '#f4eca3',
      dark: '#A29415',
      // contrastText: '#242105',
      contrastText: 'red',
    },
    violet: {
      main: alpha(violet, 0.7),
      light: alpha(violet, 0.5),
      dark: alpha(violet, 0.9),
      contrastText: getContrastRatio(alpha(violet, 0.7), '#fff') > 4.5 ? '#fff' : '#111',
    },
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "contained", type: "socialAuthButtonGoogle" },
          style: {
            //backgroundColor: "#ff0000 !important",
            color: "#ff0000 !important",
            "&:hover": {
              //backgroundColor: "#d70000 !important",
              color: "#d70000",
            },
          },
        },
        {
          props: { variant: "contained", type: "socialAuthButtonFacebook" },
          style: {
            //backgroundColor: "#333aff !important",
            color: "#333aff !important",
            "&:hover": {
              //backgroundColor: "#2d32d1 !important",
              color: "#2d32d1",
            },
          },
        },
      ],
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&.MuiMenuItem-dense": {
            //fontSize: "0.875rem", // smaller font size for dense mode
            padding: "0px 12px", // adjust padding for dense mode
            minHeight: "30px", // reduce minimum height for dense mode
            //lineHeight: "1.43", // adjust line height for dense mode
            "& .MuiListItemIcon-root": {
              minWidth: "30px", // adjust icon spacing for dense mode
            },
          },
        },
      },
    },
  },
};

// custom dark theme props
const customThemeDarkProps = {
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "rgba(58, 208, 228, 0.8)",
    },
    background: {
      default: "#303030",
      paper: "#424242",
    },
    text: {
      primary: "rgba(255, 255, 255, 1)",
      secondary: "rgba(255, 255, 255, 0.7)",
    },

    ochre: {
      main: '#6e6512',
      light: '#8f8317',
      dark: '#5c540e',
      contrastText: '#ededed',
    },
    violet: {
      main: alpha(violet, 0.7),
      light: alpha(violet, 0.5),
      dark: alpha(violet, 0.9),
      contrastText: getContrastRatio(alpha(violet, 0.7), '#fff') > 4.5 ? '#fff' : '#111',
    },
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "contained", type: "socialAuthButtonGoogle" },
          style: {
            //backgroundColor: "#ff0000 !important",
            color: "#8b1f1f !important",
            "&:hover": {
              //backgroundColor: "#d70000 !important",
              color: "#481111 !important",
            },
          },
        },
        {
          props: { variant: "contained", type: "socialAuthButtonFacebook" },
          style: {
            //backgroundColor: "#333aff !important",
            color: "#333aff !important",
            "&:hover": {
              //backgroundColor: "#2d32d1 !important",
              color: "#2429b3 !important",
            },
          },
        },
      ],
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&.MuiMenuItem-dense": {
            //fontSize: "0.875rem", // smaller font size for dense mode
            padding: "0px 12px", // adjust padding for dense mode
            minHeight: "30px", // reduce minimum height for dense mode
            //lineHeight: "1.43", // adjust line height for dense mode
            "& .MuiListItemIcon-root": {
              minWidth: "30px", // adjust icon spacing for dense mode
            },
          },
        },
      },
    },
  },
};
  
const customThemeProps = deepMergeObjects(customBaseThemeProps, customColorsThemeProps);

const themeLight = responsiveFontSizes(
  createTheme(
    deepMergeObjects(
      customThemeProps,
      customThemeLightProps,
    )
  )
);

const themeDark = responsiveFontSizes(
  createTheme(
    deepMergeObjects(
      customThemeProps,
      customThemeDarkProps,
    )
  )
);

// console.log("theme light:", themeLight);
// console.log("theme dark:", themeDark);

export { themeLight, themeDark };
