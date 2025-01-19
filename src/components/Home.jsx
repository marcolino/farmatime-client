import React from "react";
import { useContext } from "react";
import { Paper, Typography } from "@mui/material";
//import { Button } from "./custom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../providers/AuthProvider";
//import { useSnackbarContext } from "../providers/SnackbarProvider";
//import config from "../config";


function Home() {
  const { auth } = useContext(AuthContext);
  const { t } = useTranslation();
  // const { showSnackbar } = useSnackbarContext(); 

  if (typeof auth?.user === "undefined") {
    return; // if auth.user is undefined, we don't know yet about user authentication...
  }

  return (
    <Paper sx={{ padding: 4 }}>
      {!auth?.user &&
        <Typography>{t("Home page for guest user")}</Typography>
      }
      {auth?.user &&
        <Typography>{t("Home page for logged user")}</Typography>
      }
      {/* <Button onClick={() => showSnackbar("This is a custom snackbar", "info")} fullWidth={false}>Show Snackbar</Button> */}
    </Paper>
  );
}

export default React.memo(Home);
