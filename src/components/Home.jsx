/*
import React, { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const Home = () => {
  const { toggleTheme } = useContext(AuthContext);

  const handleThemeToggle = () => {
    toggleTheme(); // This should work if `toggleTheme` is defined in AuthProvider
  };

  return (
    <button onClick={handleThemeToggle}>Toggle Theme</button>
  );
};

export default React.memo(Home);
*/

import React from "react";
import { useContext } from "react";
import { Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
//import { useSnackbar } from "notistack";
import { AuthContext } from "../providers/AuthProvider";
// import { Button } from "./custom";
// import { useSnackbarContext } from "../providers/SnackbarProvider"; 
//import useImperativeSnackbar from "../hooks/useImperativeSnackbar";
//import { useSnackbar } from "../providers/SnackbarManager";
import config from "../config";


function Home() {
  const { auth } = useContext(AuthContext);
  const { t } = useTranslation();
  //const { showSnackbar } = useSnackbarContext(); 

  if (typeof auth?.user === "undefined") {
    return; // if auth.user is undefined, we don't know yet about user authentication...
  }

  return (
    <>
      <Paper sx={{ padding: 4 }}>
        {!auth?.user &&
          <Typography>{t("Home page for guest user")}</Typography>
        }
        {auth?.user &&
          <Typography>{t("Home page for logged user")}</Typography>
        }
      </Paper>
      {/* <Button onClick={ () => showSnackbar("This is a custom snackbar", "info") } fullWidth={false}>Show Snackbar</Button> */}
    </>
  );
}

export default React.memo(Home);
