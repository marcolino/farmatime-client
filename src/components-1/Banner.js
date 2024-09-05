import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  banner: {
    position: "fixed",
    top: "calc(24vh * 0.8)", // top position
    left: "-26%", // left position
    width: "80%", // base width
    height: "8vw", // base height
    backgroundColor: "rgba(184, 0, 0, 0.10)",
    transform: "rotate(-45deg)", // rotate 45° counter-clock-wise
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden", // prevent overflow
    zIndex: 999,
    pointerEvents: "none",
  },
  text: {
    color: "rgba(255, 255, 255, 0.30)",
    fontWeight: "bold",
    fontSize: "4vw", // base font size
    [theme.breakpoints.up("xs")]: {
      marginLeft: 60,
    },
    [theme.breakpoints.up("sm")]: {
      marginLeft: 30,
    },
    [theme.breakpoints.up("md")]: {
      marginLeft: -30,
    },
    [theme.breakpoints.up("lg")]: {
      marginLeft: -120,
    },
    [theme.breakpoints.up("xl")]: {
      marginLeft: -150,
    },
  },
}));

const Banner = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.banner}>
      <Typography variant="h1" className={classes.text}>
        {props.text ?? "default banner text"}
      </Typography>
    </div>
  );
};

export default Banner;