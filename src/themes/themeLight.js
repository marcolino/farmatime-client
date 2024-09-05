import { createTheme } from '@mui/material/styles';

const themeLight = createTheme({
  palette: {
    mode: 'light',
    typography: {
      fontFamily: [
        "Open Sans",
        "sans-serif",
      ].join(','),
    },
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f4f4f4',
      paper: '#fff',
    },
  },
  spacing: 8, // default spacing factor
});

export default themeLight;