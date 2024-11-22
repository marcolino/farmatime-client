import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

const Banner = ({ text = "DEVELOPMENT" }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        position: "fixed",
        top: { xs: "calc(20vh * 0.8)", sm: "calc(24vh * 0.8)" },
        left: { xs: "-30%", sm: "-26%" },
        width: { xs: "100%", sm: "80%" },
        height: { xs: "6vw", sm: "4vw" },
        backgroundColor: "rgba(240, 0, 0, 0.1)",
        transform: "rotate(-45deg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        zIndex: 9999,
        pointerEvents: "none",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant={isMobile ? "h6" : "h4"}
        sx={{
          color: "rgba(255, 255, 255, 0.5) !important",
          //color: "green",
          fontWeight: "bold",
          fontSize: { xs: "4vw", sm: "3vw" },
          textAlign: "center",
          width: "100%",
          whiteSpace: "nowrap",
          textShadow: "1px 1px 2px rgba(20, 20, 20, 0.1)",
          letterSpacing: "0",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default Banner;
