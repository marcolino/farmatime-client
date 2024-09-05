import React, { useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import { AuthContext } from "../providers/AuthProvider";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(theme => ({
	articles: {
    fontSize: "1.5em",
	},
}));



function Articles() {
	const classes = useStyles();
  const { auth } = useContext(AuthContext);
  const { t } = useTranslation();

  return (
    <div className={classes.articles}>
      {`${t("Articles")} ${t("for")} ${auth.user ? t("authenticated user") : t("guest user")} ${auth.user ? auth.user.email : ""}`}
    </div>
  );
}

export default React.memo(Articles);