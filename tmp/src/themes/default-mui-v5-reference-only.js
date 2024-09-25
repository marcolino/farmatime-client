/**
 * Default MUI v5 base theme.
 * For full theme values, see https://mui.com/material-ui/customization/default-theme/
 */

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Blue
    },
    secondary: {
      main: '#9c27b0', // Purple
    },
    error: {
      main: '#d32f2f', // Red
    },
    warning: {
      main: '#ed6c02', // Orange
    },
    info: {
      main: '#0288d1', // Light Blue
    },
    success: {
      main: '#2e7d32', // Green
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
    background: {
      default: '#fff',
      paper: '#fff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    // variants: 
    //   'body1'
    // | 'body2'
    // | 'button'
    // | 'caption'
    // | 'h1'
    // | 'h2'
    // | 'h3'
    // | 'h4'
    // | 'h5'
    // | 'h6'
    // | 'inherit'
    // | 'overline'
    // | 'subtitle1'
    // | 'subtitle2'
    // | string
  },
  shape: {
    borderRadius: 4,
  },
  spacing: 8, // Base spacing unit in pixels
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  // ... other properties like transitions, zIndex, etc.
});

export { theme };
