import React, { useEffect, useState } from "react";
import { Paper, Typography, Chip} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { withTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "fixed",
    bottom: 36,
    right: 36,
    padding: "4px",
    backgroundColor: "rgba(0, 0, 0, 0.33)",
    zIndex: 999,
  },
  chip: {
    backgroundColor: "#eee",
    color: "#333",
    //fontWeight: "bold",
    margin: 3,
  },
}));

const ClientInfoDisplay = ({ theme }) => {
  const classes = useStyles();
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
    <Paper className={classes.paper} elevation={3}>
      <Typography component={"span"} variant="body1">
        <Chip className={classes.chip} label={`W: ${viewportWidth}px`} />
        <Chip className={classes.chip} label={`B: ${breakpoint}`} />
      </Typography>
    </Paper>
  );
};

export default withTheme(ClientInfoDisplay);