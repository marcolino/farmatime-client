//import React from "react";
import {
  Paper,
  Typography,
} from "@mui/material";
import { useMediaQueryContext } from "../../providers/MediaQueryContext";


export function SectionHeader1({
  ...props
}) {
  const { isMobile } = useMediaQueryContext();

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
      <Typography variant="h4" align="center" sx={{
        fontSize: isMobile ? "1.4em!important" : "2.4em!important",
        fontWeight: 'bold',
        userSelect: 'none', // prevents text cursor and selection
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', // keep centered text
        gap: 2, // adds spacing between icon and text
      }}>
        {props.children}
      </Typography>
    </Paper>
  );
};
