import React from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { useWindowDimensions } from "../hooks/useWindowDimensions";

function DialogConfirm({ open, onClose, onCancel, onConfirm, title, message, confirmText, cancelText, messageFontSize = "1em" }) {
  const { height, width } = useWindowDimensions();
  return (
    <Dialog open={open} onClose={onClose} sx={{maxHeight: height * 4 / 5, overflowY: "auto" }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mt: 2, whiteSpace: "pre-line", fontSize: messageFontSize }}>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {cancelText &&
          <Button onClick={onCancel} color="secondary" variant="contained" sx={{margin: 2}}>
            {cancelText}
          </Button>
        }
        {confirmText &&
          <Button onClick={onConfirm} color="success" variant="contained" sx={{margin: 2}}>
            {confirmText}
          </Button>
        }
      </DialogActions>
    </Dialog>
  );
}

export default DialogConfirm;
