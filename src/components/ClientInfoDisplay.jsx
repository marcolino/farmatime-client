import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Box, Typography, Chip } from "@mui/material";


const ClientInfoDisplay = ({ theme }) => {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [breakpoint, setBreakpoint] = useState("?");

  const updateViewportWidth = useCallback(() => {
    setViewportWidth(window.innerWidth);
    setBreakpoint(
      window.innerWidth >= theme.breakpoints.values.xl ? "xl" :
        window.innerWidth >= theme.breakpoints.values.lg ? "lg" :
          window.innerWidth >= theme.breakpoints.values.md ? "md" :
            window.innerWidth >= theme.breakpoints.values.sm ? "sm" :
              window.innerWidth >= theme.breakpoints.values.xs ? "xs" :
                "?"
    );
  }, [theme.breakpoints.values]);


  useEffect(() => {
    // set the initial viewport width
    updateViewportWidth();

    // add event listener for window resize
    window.addEventListener("resize", updateViewportWidth);

    // cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateViewportWidth);
    };
  }, [updateViewportWidth]);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 5,
        right: 5,
        padding: 0,
        margin: 0,
        bgColor: "rgba(0, 0, 0, 0.33)",
        borderRadius: 6,
        zIndex: 999,
      }}
    >
      <Typography component={"span"} variant="body1">
        <Chip label={`W: ${viewportWidth}px`}
          sx={{
            bgColor: "lightyellow",
            color: "#888",
            margin: 1,
          }}
        />
        <Chip label={`B: ${breakpoint}`}
          sx={{
            bgColor: "lightyellow",
            color: "#888",
            margin: 1
          }}
        />
      </Typography>
    </Box>
  );
};

ClientInfoDisplay.propTypes = {
  theme: PropTypes.object,
};

export default ClientInfoDisplay;
