import React, { useState } from "react";
import StyledTextField from "../custom/TextField"; // Assuming this is the file where your StyledTextField is defined
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const TextFieldPassword = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <StyledTextField
      {...props}
      type={showPassword ? "text" : "password"}
      endIcon={
        <IconButton
          onClick={handleClickShowPassword}
          edge="end"
          tabIndex={-1}
          aria-label="toggle password visibility"
        >
          {showPassword ? <Visibility sx={{ fontSize: "1.4rem" }} /> : <VisibilityOff sx={{ fontSize: "1.4rem" }} />}
        </IconButton>
      }
    />
  );
};

export default TextFieldPassword;
