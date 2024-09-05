import React from "react";
import { makeStyles } from "@material-ui/styles";
import Link from "@material-ui/core/Link";
import IconCustom from "./IconCustom";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },  
  image: {
    width: "30vw",
    height: "auto",
    marginRight: 20, /* space between image and text */
  },
  textContent: {
    maxWidth: "50vw", /* limit width of paragraph */
  },
  title: {
    fontSize: "2em",
    fontWeight: "bold", 
    // margin: 0,
  },
  subtitle: {
    fontSize: "1.2em",  
    marginTop: 5, /* space above subtitle */
  },
  goBack: {
    fontSize: "1.2em", /* paragraph size */
    marginTop: 10, /* space above link */
  },
}));

const WorkInProgress = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  
  return (
    <div className={classes.container}>
      <IconCustom name="WorkInProgress" className={classes.image} />
      <div className={classes.textContent}>
        <p className={classes.title}>{`${t("Sorry")}! ${t("Work in progress")}`}</p>
        <p className={classes.subtitle}>{`${t("We are working night and day to complete this route. Please come back soon")}!`}</p>
        <p></p>
        <Link href="/" variant="body2" className={classes.goBack}>
          <h3>{t("Go back to home page")}</h3>
        </Link>
      </div>
    </div>
  );
};

export default React.memo(WorkInProgress);