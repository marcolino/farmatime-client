import React, { useState, useEffect } from "react";
import { Snackbar } from "@mui/material";

function SnackbarManager() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === "SHOW_SNACKBAR") {
        // TODO: handle event.data.level ...
        setMessage(event.data.message);
        setOpen(true);
      }
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={open}
      autoHideDuration={5 * 1000}
      onClose={handleClose}
      message={message}
    />
  );
}

export default SnackbarManager;
