import { styled, useTheme } from "@mui/material/styles";
import { Typography } from "@mui/material";
import PowerIcon from "@mui/icons-material/Power";

const Root = styled("div")(({ theme }) => ({
  position: "relative",
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
}));

function PowerWithTextGlyph({ 
  iconSize = 1.6,
  textSize = 0.6,
  text = "",
  iconProps = {}, 
  countProps = {} 
}) {
  const theme = useTheme();

  return (    
    <Root>
      <PowerIcon
        sx={{ 
          fontSize: iconSize + "em",
          ...iconProps.sx
        }}
        {...iconProps} 
      />
      <Typography 
        component="span" 
        sx={{
          position: "absolute",
          lineHeight: 1,
          color: theme.palette.background.default,
          top: (textSize * 1.5) + "em",
          fontSize: textSize + "em" + "!important",
          ...countProps.sx
        }}
        {...countProps}
      >
        {text}
      </Typography>
    </Root>
  );
}

export default PowerWithTextGlyph;
