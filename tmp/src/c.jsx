import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';

// Create a custom theme
const theme = createTheme({
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'social' },
          style: {
            backgroundColor: '#ff5722', // custom background color
            color: '#ffffff', // custom text color
            '&:hover': {
              backgroundColor: '#f4511e', // darker shade for hover state
            },
          },
        },
      ],
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <h1>Custom Color Button Example</h1>
        <Button variant="social">
          Custom Color Button
        </Button>
      </div>
    </ThemeProvider>
  );
}

export default App;

