import React from "react";
import { Button, styled, useMediaQuery, useTheme } from "@mui/material";

const StyledButton = styled(Button)(({ theme, color, background }) => {
  return ({
    minWidth: 0,
    color: color ?? theme.palette.text.primary,
    background: background ? theme.palette[background].light : undefined,
  })
});

const CustomButton = ({ variant, fullWidth = true, hideChildrenUpToBreakpoint = null, ...props }) => {
  const theme = useTheme();
  let hideChildren = false;
  if (hideChildrenUpToBreakpoint) {
    hideChildren = useMediaQuery(theme.breakpoints.down(hideChildrenUpToBreakpoint));
  }
  if (props.startIcon && hideChildren) {
    const startIconCloned =
      React.cloneElement(props.startIcon, {
        sx: {
          ...props.startIcon.props.sx, // keep existing styles
          fontSize: "2em !important", // when hiding children, we enlarge the icon a bit
          paddingLeft: "0.25em !important" // when hiding children, we have to shift icon a bit to the right, to keep it centered
        },
      })
    ;
    props.startIcon = startIconCloned;
  }

  return (
      <StyledButton
        variant={variant ?? "contained"}
        fullWidth={fullWidth}
        exact="true"
        sx={{
          mt: 1,
          justifyContent: "center",
          alignItems: "center",
          minWidth: hideChildren ? "40px" : "auto", // make the button width only as wide as the icon on xs screens
          paddingLeft: hideChildren ? 0 : 2,
          paddingRight: hideChildren ? 0 : 2,
          gap: hideChildren ? 0 : 1, // remove gap when only the icon is displayed
        }}
        {...props}
      >
      {!hideChildren && props.children}
    </StyledButton>
  );
}

export default CustomButton;