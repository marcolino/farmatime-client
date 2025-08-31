// for full theme values, see https://mui.com/material-ui/customization/default-theme/

import { createTheme, responsiveFontSizes, alpha, getContrastRatio } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { deepMergeObjects } from "../libs/Misc";

// custom colors
const violet = "#953bee";

// function that generates base theme props based on screen size
const getCustomBaseThemeProps = (isXs = false) => ({
  spacing: 8,
  typography: {
    fontFamily: "Open Sans",
    fontSize: isXs ? 15 : 16, // Smaller base font size for xs screens
    // You can also adjust other typography variants
    // h1: {
    //   fontSize: isXs ? '1.8rem' : '2.125rem',
    // },
    // h2: {
    //   fontSize: isXs ? '1.6rem' : '1.875rem',
    // },
    // h3: {
    //   fontSize: isXs ? '1.4rem' : '1.5rem',
    // },
    // body1: {
    //   fontSize: isXs ? '0.8rem' : '0.875rem',
    // },
    // body2: {
    //   fontSize: isXs ? '0.75rem' : '0.8125rem',
    // },
    button: {
      textTransform: "none",
    //  fontSize: isXs ? '0.75rem' : '0.8125rem',
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
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: 3,
          maxWidth: 200,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      },
    },
  },
});

// custom colors theme props
const customColorsThemeProps = {
  // palette: {
  //   ochre: {
  //     main: "#E3D026",
  //     light: "#f4eca3",
  //     dark: "#A29415",
  //     contrastText: "#242105",
  //   },
  //   violet: {
  //     main: alpha(violet, 0.7),
  //     light: alpha(violet, 0.5),
  //     dark: alpha(violet, 0.9),
  //     contrastText: getContrastRatio(alpha(violet, 0.7), "#fff") > 4.5 ? "#fff" : "#111",
  //   },
  // }
};

// custom light theme props
const customThemeLightProps = {
  palette: {
    mode: "light",
    primary: {
      main: "#a5dc6f", //#74ca1f
    },
    secondary: {
      main: "#c4e3b1ff", // #8bed4e
    },
    tertiary: {
      main: "#6a9052", // #499f13
    },
    background: {
      default: "#f8fcff",
      paper: "#ebf2f6",
      cookies: "#f1e1d1",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.77)",
    },
    gun: {
      main: "#676767",
      light: "#969696",
      dark: "#262626",
    },
    nature: {  
      main: "#7fb188",
      light: "#a5e7b1",
      dark: "#4e8558",
      contrastText: "#fefdf1",
    },
    marine: {
      main: "#262a9a",
      light: "#1f227d",
      dark: "#111342",
      contrastText: "#fefce6",
    },
    ochre: {
      main: "#fbf4b4", //#e3d026",
      light: "#fff9c5",
      dark: "#e3d026",
      contrastText: "#242105",
    },
    violet: {
      main: alpha(violet, 0.7),
      light: alpha(violet, 0.5),
      dark: alpha(violet, 0.9),
      contrastText: getContrastRatio(alpha(violet, 0.7), "#fff") > 4.5 ? "#fff" : "#111",
    },
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "contained", type: "socialAuthButtonGoogle" },
          style: {
            //bgColor: "#ff0000 !important",
            color: "#ff0000 !important",
            "&:hover": {
              //bgColor: "#d70000 !important",
              color: "#d70000",
            },
          },
        },
        {
          props: { variant: "contained", type: "socialAuthButtonFacebook" },
          style: {
            //bgColor: "#333aff !important",
            color: "#333aff !important",
            "&:hover": {
              //bgColor: "#2d32d1 !important",
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
      main: "rgb(29, 111, 71)",
    },
     tertiary: {
      main: "#32541c", // #499f13
    },
    background: {
      default: "#303030",
      paper: "#424242",
      cookies: "#1f2f3f",
    },
    text: {
      primary: "rgb(255, 255, 255)",
      secondary: "rgb(230, 230, 230)",
    },
     gun: {
      main: "#676767",
      light: "#969696",
      dark: "#262626",
    },
    nature: {  
      main: "#7fb188",
      light: "#a5e7b1",
      dark: "#4e8558",
      contrastText: "#fefdf1",
    },
    marine: {
      main: "#262a9a",
      light: "#1f227d",
      dark: "#111342",
      contrastText: "#fefce6",
    },
    ochre: {
      main: "#6e6512",
      light: "#8f8317",
      dark: "#5c540e",
      contrastText: "#ededed",
    },
    violet: {
      main: alpha(violet, 0.7),
      light: alpha(violet, 0.5),
      dark: alpha(violet, 0.9),
      contrastText: getContrastRatio(alpha(violet, 0.7), "#fff") > 4.5 ? "#fff" : "#111",
    },
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "contained", type: "socialAuthButtonGoogle" },
          style: {
            //bgColor: "#ff0000 !important",
            color: "#8b1f1f !important",
            "&:hover": {
              //bgColor: "#d70000 !important",
              color: "#481111 !important",
            },
          },
        },
        {
          props: { variant: "contained", type: "socialAuthButtonFacebook" },
          style: {
            //bgColor: "#333aff !important",
            color: "#333aff !important",
            "&:hover": {
              //bgColor: "#2d32d1 !important",
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

// Create theme factory functions
const createResponsiveTheme = (isDark = false, isXs = false) => {
  //console.log("isXS:", isXs);
  const customThemeProps = deepMergeObjects(
    getCustomBaseThemeProps(isXs), 
    customColorsThemeProps
  );
  
  const specificThemeProps = isDark ? customThemeDarkProps : customThemeLightProps;
  
  return responsiveFontSizes(
    createTheme(
      deepMergeObjects(customThemeProps, specificThemeProps)
    )
  );
};

export const useResponsiveTheme = (isDark = false) => {
  const isXs = useMediaQuery('(max-width:599px)');
  return createResponsiveTheme(isDark, isXs);
};
  
/*
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
*/