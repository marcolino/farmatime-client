import React from "react";
import { makeStyles } from "@material-ui/styles";
import { usePromiseTracker } from "react-promise-tracker";
// import { useAxiosLoader } from "../hooks/useAxiosLoader";
import {
  Audio, Comment, Grid, Hearts, Hourglass, Oval,
  RotatingLines, RotatingSquare, ThreeDots, Watch,
} from "react-loader-spinner";
import config from "../config";


function Loader(props) {
  const { promiseInProgress } = usePromiseTracker({delay: config.spinner.delay});
  let LoaderComponent;
  switch (config.spinner.type) {
    case "Audio": LoaderComponent = Audio; break;
    case "Comment": LoaderComponent = Comment; break;
    case "Grid": LoaderComponent = Grid; break;
    case "Hearts": LoaderComponent = Hearts; break;
    case "Hourglass": LoaderComponent = Hourglass; break;
    case "Oval": LoaderComponent = Oval; break;
    case "RotatingLines": LoaderComponent = RotatingLines; break;
    case "RotatingSquare": LoaderComponent = RotatingSquare; break;
    case "ThreeDots": LoaderComponent = ThreeDots; break;
    case "Watch": LoaderComponent = Watch; break;
    default: LoaderComponent = Audio; break;
  }

  // centered overlay styles
  const styles = theme => ({
    outer: {
      display: "table",
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      width: "100%",
      opacity: config.spinner.opacity,
      zIndex: 999,
    },
    middle: {
      display: "table-cell",
      verticalAlign: "middle",
    },
    inner: {
      marginLeft: "auto",
      marginRight: "auto",
      height: 100,
      width: 100,
    },
  });
  const useStyles = makeStyles((theme) => (styles(theme)));
  const classes = useStyles();
  // const [loading] = useAxiosLoader();

  return (promiseInProgress /*|| loading*/) && (
    <div className={classes.outer}>
      <div className={classes.middle}>
        <div className={classes.inner}>
          <LoaderComponent
            height={config.spinner.height}
            width={config.spinner.width}
            color={config.spinner.color}
            secondaryColor={config.spinner.secondaryColor}
            strokeWidth={config.spinner.strokeWidth}
            strokeWidthSecondary={config.spinner.strokeWidthSecondary}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Loader);
