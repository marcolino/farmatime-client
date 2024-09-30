import React from "react";
import { Button, styled } from "@mui/material";
//import { useTheme } from "@mui/material/styles";

const StyledButton = styled(Button)(({ theme, color, background }) => {
  return ({
    minWidth: 0,
    //margin: theme.spacing(0.5),
    color: color ?? theme.palette.text.primary,
    background: background ? theme.palette[background].light : undefined,
  })
});

const CustomButton = ({ variant, fullWidth = true, ...props }) => {
  //const theme = useTheme();

  return (
    <StyledButton
      variant={variant ?? "contained"}
      fullWidth={fullWidth}
      sx={{mt: 2}}
      {...props}
    >
      {props.children}
    </StyledButton>
  );
};

export default CustomButton;