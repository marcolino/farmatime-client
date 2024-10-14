import React from "react";
import { useContext } from "react";
import { Paper,Typography } from "@mui/material";
//import { Box, Button,  } from "@mui/material";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../providers/AuthProvider";
//import useImperativeSnackbar from "../hooks/useImperativeSnackbar";
//import { useSnackbar } from "../providers/SnackbarManager";


function Home() {
  const { auth } = useContext(AuthContext);
  const { t } = useTranslation();

  if (typeof auth?.user === "undefined") {
    return; // if auth.user is undefined, we don't know yet about user authentication...
  }
  
  return (
    <Paper sx={{px: 1}}>
      {!auth.user &&
        <Typography>{t("home page for guest user")}</Typography>
      }
      {auth.user &&
        <Typography>{t("home page for logged user")}</Typography>
      }
      {(auth.user && auth?.user.roles.includes("user") && auth.user.justRegistered) && ( // TODO: handle justRegistered, if needed...
        <Typography>{t("Administrators are verifying your role...")}</Typography>
      )}
    </Paper>
  );
}

export default React.memo(Home);
