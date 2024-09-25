import React from "react";
import { MenuItem, Switch, ListItemIcon, ListItemText } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const ThemeToggleMenuItem = ({ isDarkMode, onToggle }) => {
  return (
    <MenuItem onClick={onToggle}>
      <ListItemIcon>
        {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      </ListItemIcon>
      <ListItemText primary="Dark Mode" />
      <Switch
        edge="end"
        checked={isDarkMode}
        onChange={onToggle}
        inputProps={{ "aria-labelledby": "switch-list-label-bluetooth" }}
      />
    </MenuItem>
  );
};

export default ThemeToggleMenuItem;
