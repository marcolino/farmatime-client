import { styled } from "@mui/material/styles";
import { useTheme, Typography } from "@mui/material";
import PowerIcon from "@mui/icons-material/Power";

const Root = styled("div")(({ theme, size }) => ({
  position: "relative",
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: size,
}));

const StyledIcon = styled(PowerIcon)(({ theme, iconSize }) => ({
  fontSize: iconSize + "rem",
}));

const Overlay = styled(Typography)(({ theme, textSize }) => ({
  position: "absolute",
  lineHeight: 1,
  color: "#ffffff",
  top: (textSize / 10) + "rem",
  fontSize: textSize + "rem" + " !important",
}));

function PowerWithTextIcon({
  size = 16,
  iconSize = 1.8,
  textSize = 18,
  text = "",
  iconProps = {}, 
  textProps = {},
}) {
  const theme = useTheme();

  return (
    <Root theme={theme} size={size}>
      <StyledIcon theme={theme} iconSize={iconSize} {...iconProps} />
      <Overlay theme={theme} component="span" textSize={textSize} {...textProps}>{text}</Overlay>
    </Root>
  );
}

export default PowerWithTextIcon;
