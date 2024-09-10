import React from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmText, cancelText }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color="success">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
