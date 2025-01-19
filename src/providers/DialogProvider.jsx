// DialogProvider.js
import React, { createContext, useState, useContext, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DialogConfirm from "../components/DialogConfirm";

const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
  const { t } = useTranslation();
  const [dialogState, setDialogState] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: null,
    cancelText: null,
    onConfirm: null,
    onCancel: null,
    autoCancelAfterSeconds: null,
    autoConfirmAfterSeconds: null,
  });

  useEffect(() => {
    let autoCancelTimeout;
    let autoConfirmTimeout;

    if (dialogState.open) {
      if (dialogState.autoCancelAfterSeconds) {
        autoCancelTimeout = setTimeout(() => {
          dialogState.onCancel && dialogState.onCancel();
        }, dialogState.autoCancelAfterSeconds * 1000);
      }

      if (dialogState.autoConfirmAfterSeconds) {
        autoConfirmTimeout = setTimeout(() => {
          dialogState.onConfirm && dialogState.onConfirm();
        }, dialogState.autoConfirmAfterSeconds * 1000);
      }
    }

    return () => {
      clearTimeout(autoCancelTimeout);
      clearTimeout(autoConfirmTimeout);
    };
  }, [dialogState]);

  const showDialog = useCallback(({ 
    title = "",
    message = "", 
    confirmText = null, 
    cancelText = null,
    onConfirm = () => {},
    onCancel = () => {},
    autoCancelAfterSeconds = null,
    autoConfirmAfterSeconds = null,
  }) => {
    setDialogState({
      open: true,
      title,
      message,
      confirmText,
      cancelText,
      autoCancelAfterSeconds,
      autoConfirmAfterSeconds,
      onConfirm: () => {
        onConfirm();
        closeDialog();
      },
      onCancel: () => {
        onCancel();
        closeDialog();
      },
    });
  }, []);

  const closeDialog = useCallback(() => {
    setDialogState((prevState) => ({ ...prevState, open: false }));
  }, []);

  return (
    <DialogContext.Provider value={{ showDialog }}>
      {children}
      <DialogConfirm 
        open={dialogState.open}
        onClose={closeDialog}
        onCancel={dialogState.onCancel}
        onConfirm={dialogState.onConfirm}
        title={dialogState.title}
        message={dialogState.message}
        confirmText={dialogState.confirmText}
        cancelText={dialogState.cancelText}
      />
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};

// // DialogConfirm.js
// import React from "react";
// import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
// import { useWindowDimensions } from "../hooks/useWindowDimensions";

// function DialogConfirm({ open, onClose, onCancel, onConfirm, title, message, confirmText, cancelText, messageFontSize = "1em" }) {
//   const { height, width } = useWindowDimensions();

//   return (
//     <Dialog open={open} onClose={onClose} sx={{ maxHeight: (height * 4) / 5, overflowY: "auto" }}>
//       <DialogTitle>{title}</DialogTitle>
//       <DialogContent>
//         <DialogContentText sx={{ mt: 2, whiteSpace: "pre-line", fontSize: messageFontSize }}>{message}</DialogContentText>
//       </DialogContent>
//       <DialogActions>
//         {cancelText && (
//           <Button onClick={onCancel} color="secondary" variant="contained" sx={{ margin: 2 }}>
//             {cancelText}
//           </Button>
//         )}
//         {confirmText && (
//           <Button onClick={onConfirm} color="success" variant="contained" sx={{ margin: 2 }}>
//             {confirmText}
//           </Button>
//         )}
//       </DialogActions>
//     </Dialog>
//   );
// }

// export default DialogConfirm;
