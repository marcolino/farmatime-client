import { Typography } from "@mui/material";
import { useTheme } from 'mui-material-custom';

const FloatingLogo = ({ text }) => {
  const theme = useTheme();
  
  return (
    <Typography
      sx={{
        position: "fixed",
        bottom: "clamp(70px, 5vw, 70px)",
        right: "clamp(20px, 5vw, 50px)",
        color: "white",
        fontSize: "clamp(24px, 30vw, 380px) !important",
        lineHeight: "clamp(24px, 30vw, 380px)",
        fontWeight: "bold",
        fontFamily: theme.typography.fontFamily,
        letterSpacing: "-0.5rem",
        textShadow: "1px 1px 4px rgba(0, 0, 0, 0.5)",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        zIndex: 1000,
      }}
    >
      {text}
    </Typography>
  );
};

export default FloatingLogo;
