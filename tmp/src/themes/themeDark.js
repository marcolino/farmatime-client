import { createTheme } from '@mui/material/styles';

  // const theme = createMuiTheme({
  //   typography: {
  //     // Use the system font.
  //     fontFamily:
  //       '"Open Sans",-apple-system,system-ui,BlinkMacSystemFont,' +
  //       '"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
  //   },
// })
  
const themeDark = createTheme({
  palette: {
    mode: 'dark',
    typography: {
      fontFamily: [
        "Open Sans",
        "sans-serif",
      ].join(','),
    },
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#303030',
      paper: '#424242',
    },
  },
  spacing: 8, // default spacing factor
});

export default themeDark;