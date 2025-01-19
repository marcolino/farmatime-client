import React from "react";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

const CustomIconButton = () => {
  return (
    <IconButton
      sx={{
        backgroundColor: "primary.main", // or a custom color
        borderRadius: 2, //"8px", // controls the border roundness (set to 0 for completely square)
        padding: 1, // adjust padding for a square shape
        margin: 1,
        "&:hover": {
          backgroundColor: "primary.dark", // slightly darker on hover
        },
        color: "contrastText", // ensure the icon is visible against the background
      }}
    >
      <EditIcon fontSize="small" />
    </IconButton>
  );
};

export default CustomIconButton;