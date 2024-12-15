import React from "react";
import Box from "@mui/material/Box";

const IconStackedArrows = (props) => (
  <Box
    sx={{
      display: "inline-block",
      position: "relative",
      width: "16px",
      height: "20px",
      opacity: props.opacity ?? 1,
      "&::before": {
        content: '"▲"',
        position: "absolute",
        top: "3px",
        left: 0,
        width: "100%",
        textAlign: "center",
        fontSize: "0.78rem",
        lineHeight: 1,
      },
      "&::after": {
        content: '"▼"',
        position: "absolute",
        bottom: "-3px",
        left: 0,
        width: "100%",
        textAlign: "center",
        fontSize: "0.78rem",
        lineHeight: 1,
      },
    }}
  />
);

export default React.memo(IconStackedArrows);
