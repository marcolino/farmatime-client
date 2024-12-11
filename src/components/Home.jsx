import React from "react";
import { useContext } from "react";
import { Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../providers/AuthProvider";
//import config from "../config";


function Home() {
  const { auth } = useContext(AuthContext);
  const { t } = useTranslation();

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
