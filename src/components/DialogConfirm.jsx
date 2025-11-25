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
  confirmColor,
  cancelText,
  cancelColor,
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
      {/* <DialogTitle>{title}</DialogTitle> */}
      <DialogTitle
        sx={{
          bgcolor: "primary.main",   // theme color
          color: "primary.contrastText", // ensures text is readable
          fontWeight: "bold",
          mb: 2,
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          minHeight: 100,
          whiteSpace: "pre-line",
        }}
      >
        {/* <Box>{message}</Box> */}
        {/* <Box>{typeof message === "function" ? message() : message}</Box> */}
        <Box>
          {
            typeof message === "function" ? message() :
              React.isValidElement(message) ? message :
                String(message)
          }
          </Box>
      </DialogContent>

      <DialogActions>
        {cancelText && (
          <Button onClick={onCancel} color={cancelColor ?? "secondary"} variant="contained" sx={{ m: 2, mt: 0 }}>
            {cancelText}
          </Button>
        )}
        {confirmText && (
          <Button onClick={onConfirm} color={confirmColor ?? "success"} variant="contained" sx={{ m: 2, mt: 0 }}>
            {confirmText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(DialogConfirm);
