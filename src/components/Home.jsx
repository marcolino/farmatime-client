import React from "react";
import { useContext } from "react";
import { Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
//import { useSnackbar } from "notistack";
import { AuthContext } from "../providers/AuthProvider";
import { Button } from "./custom";
import { useSnackbarContext } from "../providers/SnackbarProvider"; 
//import useImperativeSnackbar from "../hooks/useImperativeSnackbar";
//import { useSnackbar } from "../providers/SnackbarManager";

function Home() {
  const { auth } = useContext(AuthContext);
  const { t } = useTranslation();
  //const { enqueueSnackbar } = useSnackbar();
  const { showSnackbar } = useSnackbarContext(); 

  if (typeof auth?.user === "undefined") {
    return; // if auth.user is undefined, we don't know yet about user authentication...
  }
  
  // const showSnackbar = (variant = "default") => {
  //   enqueueSnackbar("This is a custom snackbar", { variant });
  // };

  return (
    <>
      <Paper sx={{ px: 1 }}>
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
      {/* <Button onClick={ () => showSnackbar("This is a custom snackbar", "info") } fullWidth={false}>Show Snackbar</Button> */}
    </>
  );
}

export default React.memo(Home);
