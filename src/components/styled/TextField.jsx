import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

const StyledTextField = ({
  startIcon = null,
  endIcon = null,
  variant = "outlined",
  fullWidth = true,
  size = "small",
  margin = "dense",
  ...props
}) => {
  props.variant = props.variant ?? variant;
  props.fullWidth = props.fullWidth ?? fullWidth;
  props.size = props.size ?? size;
  props.margin = props.margin ?? margin;
  return (
    <TextField
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            {startIcon}
          </InputAdornment>
        ),
        endAdornment: endIcon && (
          <InputAdornment position="end">
            {endIcon}
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};

export default StyledTextField;
