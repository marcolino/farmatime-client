import React, { useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import { AuthContext } from "../providers/AuthProvider";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(theme => ({
	products: {
    fontSize: "1.5em",
	},
}));



function Products() {
	const classes = useStyles();
  const { auth } = useContext(AuthContext);
  const { t } = useTranslation();

  return (
    <div className={classes.products}>
      {`${t("Products")} ${t("for")} ${auth.user ? t("authenticated user") : t("guest user")} ${auth.user ? auth.user.email : ""}`}
    </div>
  );
}

export default React.memo(Products);