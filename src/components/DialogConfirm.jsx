import React from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

function DialogConfirm({ open, onClose, onCancel, onConfirm, title, message, confirmText, cancelText }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {cancelText &&
          <Button onClick={onCancel} color="secondary" variant="contained">
            {cancelText}
          </Button>
        }
        {confirmText &&
          <Button onClick={onConfirm} color="success" variant="contained">
            {confirmText}
          </Button>
        }
      </DialogActions>
    </Dialog>
  );
}

export default DialogConfirm;
