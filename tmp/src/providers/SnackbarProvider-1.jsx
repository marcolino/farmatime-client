import React from "react";
import { SnackbarProvider as NotistackSnackbarProvider, closeSnackbar } from "notistack";
//import IconButton from "@mui/material/IconButton";
import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import config from "../config";


const SnackbarProvider = ({ children }) => {
  const handleDismiss = (key) => {
    closeSnackbar(key);
  };

  return (
    <NotistackSnackbarProvider
      maxSnack={3} // customize max number of snackbars
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      autoHideDuration={config.ui.snacks.autoHideDurationSeconds * 1000}
      style={{
        fontSize: config.ui.snacks.style.fontSize,
        whiteSpace: config.ui.snacks.style.whiteSpace,
      }}
      action={(key) => (
        <Button onClick={() => handleDismiss(key)} color="inherit">
          <CloseIcon sx={{ fontSize: config.ui.snacks.closeIcon.fontSize }} />
        </Button>
      )}
      preventDuplicate={config.mode.production} // prevent duplicates only in production, better being aware of duplicates, while developing...
    >
      {children}
    </NotistackSnackbarProvider>
  );
};

export default SnackbarProvider;
