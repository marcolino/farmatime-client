import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        bgcolor: "primary.main",
        color: "white",
        textAlign: "center",
        py: 2,
      }}
    >
      <Typography variant="body2">
        © 2024 Your Company Name
      </Typography>
    </Box>
  );
};

export default Footer;
