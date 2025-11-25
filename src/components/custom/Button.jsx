import React from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import StyledButton from "./StyledButton";

const CustomButton = React.forwardRef(({ variant, fullWidth = true, hideChildrenUpToBreakpoint = null, ...props }, ref) => {
  const theme = useTheme();

  const shouldHide = useMediaQuery(
    hideChildrenUpToBreakpoint
      ? theme.breakpoints.down(hideChildrenUpToBreakpoint)
      : theme.breakpoints.up("xs") // fallback that never hides
  );

  const hideChildren = !!hideChildrenUpToBreakpoint && shouldHide;

  if (props.startIcon && hideChildren) {
    props.startIcon = React.cloneElement(props.startIcon, {
      sx: {
        ...props.startIcon.props.sx,
        fontSize: "2em !important",
        paddingLeft: "0.25em !important"
      },
    });
  }

  return (
    <StyledButton
      ref={ref}
      variant={variant ?? "contained"}
      fullWidth={fullWidth}
      exact="true"
      sx={{
        mt: 1,
        justifyContent: "center",
        alignItems: "center",
        minWidth: hideChildren ? "40px" : "auto",
        paddingLeft: hideChildren ? 0 : 2,
        paddingRight: hideChildren ? 0 : 2,
        gap: hideChildren ? 0 : 1,
      }}
      {...props}
    >
      {!hideChildren && props.children}
    </StyledButton>
  );
});

CustomButton.displayName = 'CustomButton';

export default CustomButton;
