import React from "react";
import { useContext } from "react";
import { Paper } from "@mui/material";
import { Typography } from "@mui/material";
import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../providers/AuthProvider";
//import useImperativeSnackbar from "../hooks/useImperativeSnackbar";
import { useSnackbar } from "../providers/SnackbarManager";


function Home() {
  // const classes = {}; //useStyles();
  const { auth } = useContext(AuthContext);
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();

  // show Snackbar with the default dismiss action
  const handleClickWithDefaultAction = () => {
    showSnackbar("This Snackbar is beautiful\n\nBye...", "info");
  };

  return (
    <Paper>
      {(!auth.user) && // if auth.user is undefined, we don't know yet about user authentication... */}
        <Typography>ciao, utente ospite</Typography>
      }
      {(auth.user) && // if auth.user is undefined, we don't know yet about user authentication... */}
        <Typography>ciao, utente autenticato</Typography>
      }
      {(auth.user && auth.user.roles.includes("user") && auth.user.justRegistered) && (
        <Typography>{t("Administrators are verifying your role...")}</Typography>
      )}

      <Box sx={{ mt: 2 }} />
      
      <Button variant="contained" onClick={handleClickWithDefaultAction}>
        Show Snackbar
      </Button>

    </Paper>
  );
}

export default React.memo(Home);
