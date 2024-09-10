import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        // position: "fixed", // fixes footer on bottom, even when scrolling
        bottom: 0,
        width: "100%",
        backgroundColor: "transparent", //theme.palette.primary.main,
        color: "#333", // TODO: use a palette prop
        textAlign: "center",
        py: 2,
        zIndex: 1000, // ensures the footer stays on top of the content
      }}
    >
      <Typography variant="body2">
        © 2024 Your Company Name
      </Typography>
    </Box>
  );
};

export default Footer;
