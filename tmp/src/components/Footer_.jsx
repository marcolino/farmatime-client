// components/Footer.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from "@mui/material/styles";

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',        // Fixes the footer at the bottom of the viewport
        bottom: 0,                // Aligns the footer to the bottom
        width: '100%',            // Takes full width of the viewport
        py: 2,
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        textAlign: 'center',
        zIndex: 1000,             // Ensures the footer stays on top of the content
      }}
    >
      <Typography variant="body1">Footer Content © 2024</Typography>
    </Box>
  );
};

export default Footer;
