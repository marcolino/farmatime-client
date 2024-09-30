import React, { useEffect, useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
//import { makeStyles } from "@material-ui/core/styles";
//import { withTheme } from '@material-ui/core/styles';

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     position: "fixed",
//     bottom: 36,
//     right: 36,
//     padding: "4px",
//     backgroundColor: "rgba(0, 0, 0, 0.33)",
//     zIndex: 999,
//   },
//   chip: {
//     backgroundColor: "#eee",
//     color: "#333",
//     //fontWeight: "bold",
//     margin: 3,
//   },
// }));

const ClientInfoDisplay = ({ theme }) => {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [breakpoint, setBreakpoint] = useState("?");

  //console.log("theme.breakpoints.values:", theme.breakpoints.values);
  const updateViewportWidth = () => {
    setViewportWidth(window.innerWidth);
    setBreakpoint(
      window.innerWidth >= theme.breakpoints.values.xl ? "xl" :
        window.innerWidth >= theme.breakpoints.values.lg ? "lg" :
          window.innerWidth >= theme.breakpoints.values.md ? "md" :
            window.innerWidth >= theme.breakpoints.values.sm ? "sm" :
              window.innerWidth >= theme.breakpoints.values.xs ? "xs" :
                "?"
    );
  };

  useEffect(() => {
    // set the initial viewport width
    updateViewportWidth();

    // add event listener for window resize
    window.addEventListener("resize", updateViewportWidth);

    // cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateViewportWidth);
    };
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        padding: 0,
        margin: 0,
        backgroundColor: "rgba(0, 0, 0, 0.33)",
        borderRadius: 6,
        zIndex: 999,
      }}
    >
      <Typography component={"span"} variant="body1">
        <Chip label={`W: ${viewportWidth}px`}
          sx={{
            backgroundColor: "lightyellow",
            color: "#888",
            margin: 1,
          }}
        />
        <Chip label={`B: ${breakpoint}`}
          sx={{
            backgroundColor: "lightyellow",
            color: "#888",
            margin: 1
          }}
        />
      </Typography>
    </Box>
  );
};

export default ClientInfoDisplay;
