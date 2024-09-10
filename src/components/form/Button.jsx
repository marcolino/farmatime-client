import * as React from "react";
import Button from "@mui/material/Button";
import { styled, useTheme } from "@mui/material/styles";

const CustomButton = styled(({ variant, backgroundColor, fullwidth, onClick, ...other }) => (
  <Button variant={variant} {...other} />
))(({ theme, variant, backgroundColor, onClick }) => ({
  // Force variant to be "outlined" if not provided
  variant: variant || "outlined",
  
  // Apply background color, default to theme.palette.primary.main if not provided
  backgroundColor: backgroundColor || theme.palette.primary.main,

  // Set the color of the text to be white when background color is primary
  color: theme.palette.primary.contrastText,

  fullWidth: true,

  onClick: onClick || (() => alert("Custom Button Clicked!!!")),
    
  // Optionally add other custom styles
  "&:hover": {
    backgroundColor: theme.palette.primary.dark, // Darker on hover
  }
}));

function StyledButtonExample() {
  const theme = useTheme();

  return (
    <CustomButton
      //fullWidth={true}
      onClick={() => alert("Custom Button Clicked")}
    >
      Custom Button
    </CustomButton>
  );
}

export default StyledButtonExample;



/*
import React from "react";
import { styled } from "@mui/system";
import Button from "@mui/material/Button";

const StyledButton_ = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.text,
  backgroundColor: theme.palette.primary.main,
  fullWidth: true,
}));

const StyledButton = React.memo({
  startIcon = null,
  endIcon = null,
  variant = "outlined",
  fullWidth = true,
  size = "small",
  margin = "dense",
  ...props
} => (
  <StyledButton_
    variant="text"
    {...props}
  >
    {props.children}
  </StyledButton_>
));

export default StyledButton;
*/