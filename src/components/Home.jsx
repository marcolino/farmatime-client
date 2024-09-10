import React from "react";
import { useContext } from "react";
import { styled } from "@mui/system";
import { Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  Typography,
} from "@mui/material";
import { AuthContext } from "../providers/AuthProvider";

// const useStyles = makeStyles(theme => ({
//   home: {
//     fontSize: "1.5em",
//   },
// }));

function Home() {
  const classes = {}; //useStyles();
  const { auth } = useContext(AuthContext);
  const { t } = useTranslation();

  return (
    <Paper className={classes.home}>
      {/* {{(typeof auth.user !== "undefined") && // if auth.user is undefined, we don't know yet about user authentication... */}
      <Typography>ciao</Typography>
      {/* <Typography>{t("Welcome")} {auth.user ? auth.user.firstName : t("guest user")}</Typography> */}
      {/* <Typography variant="subtitle1">BODY1 DYNAMIC FONT SIZE</Typography> */}
      {/* {(auth.user && auth.user.roles.includes("user") && auth.user.justRegistered) && (
        <Typography>{t("Administrators are verifying your role...")}</Typography>
      )} */}
    </Paper>
  );
}

export default React.memo(Home);