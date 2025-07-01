//import { useTranslation } from "react-i18next";
//import { Paper, Typography, /*Box*/ } from "@mui/material";
import {
  //Box,
  Paper,
  Typography,
  //styled
} from "@mui/material";
//import { styled } from "@mui/system";

/*
const HeaderBar = styled(Box)(({ theme }) => ({
  bgColor: theme.palette.nature.light,
  width: "100%",
  position: "relative",
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: 6,
  padding: theme.spacing(4),
  overflow: "visible", // Ensure the text can escape the bar
}));

const HeaderText = styled(Typography)(({ theme }) => ({
  textAlign: "right",
  //bgColor: "transparent",
  color: theme.palette.gun.dark,
  textTransform: "uppercase",
  fontWeight: "bold",
  fontSize: "1.8rem !important",
  //textShadow: "#fff 1px 1px",
  //letterSpacing: 0,
  lineHeight: 1.0,
  position: "relative",
  top: 0, 
  zIndex: 2, // ensure text is above the bar
  overflow: "visible", // ensure the text can escape the header
}));
*/

/*
const SectionHeader = ({
  ...props
}) => {
  return (
    <Paper elevation={0} sx={{ position: "relative", overflow: "visible" }}>
      <HeaderBar>
        <HeaderText>
          {props.children}
        </HeaderText>
      </HeaderBar>
    </Paper>
  );
};
*/

export const SectionHeader1 = ({
  ...props
}) => {
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        mb: 4, 
        bgcolor: 'primary.main',
        color: 'info.contrastText',
      }}
    >
      <Typography variant="h4" align="center" sx={{ fontWeight: 'bold' }}>
        {props.children}
      </Typography>
    </Paper>
  );
};
