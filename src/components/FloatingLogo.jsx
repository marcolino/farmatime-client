import React from "react";
import { Typography } from "@mui/material";

const FloatingLogo = ({ text }) => {
  return (
    <Typography
      sx={{
        position: "fixed",
        bottom: "clamp(70px, 5vw, 70px)",
        right: "clamp(20px, 5vw, 50px)",
        color: "white",
        fontSize: "clamp(24px, 30vw, 380px) !important",
        lineHeight: "clamp(24px, 30vw, 380px)",
        fontWeight: "bold",
        fontFamily: "Open+Sans",
        letterSpacing: "-0.5rem",
        // padding: 0,
        // margin: 0,
        textShadow: "1px 1px 4px rgba(0, 0, 0, 0.5)",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        zIndex: 1000,
      }}
    >
      {text}
    </Typography>
  );
};

export default FloatingLogo;
