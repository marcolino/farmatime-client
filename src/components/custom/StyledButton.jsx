import { Button, styled } from "@mui/material";

const StyledButton = styled(Button)(({ theme, color, background }) => ({
  minWidth: 0,
  color: color ?? theme.palette.text.primary,
  background: background ? theme.palette[background].light : undefined,
}));

export default StyledButton;
