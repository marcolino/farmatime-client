import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { useWindowDimensions } from "../hooks/useWindowDimensions";

function DialogConfirm({
  open,
  onClose,
  onCancel,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
}) {
  const { height } = useWindowDimensions();

  const maxDialogHeight = height * 0.8; // 80% viewport height

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: maxDialogHeight,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          minHeight: 100,
          whiteSpace: "pre-line",
        }}
      >
        <Box>{message}</Box>
      </DialogContent>

      <DialogActions>
        {cancelText && (
          <Button onClick={onCancel} color="secondary" variant="contained" sx={{ m: 2 }}>
            {cancelText}
          </Button>
        )}
        {confirmText && (
          <Button onClick={onConfirm} color="success" variant="contained" sx={{ m: 2 }}>
            {confirmText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(DialogConfirm);
