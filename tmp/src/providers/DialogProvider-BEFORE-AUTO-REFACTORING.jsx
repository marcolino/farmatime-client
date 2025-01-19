import React, { createContext, useState, useContext, useCallback } from "react";
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
  });

  const showDialog = useCallback(({ 
    title = "",
    message = "", 
    confirmText = null, 
    cancelText = null,
    onConfirm = () => {},
    onCancel = () => {},
  }) => {
    setDialogState({
      open: true,
      title,
      message,
      confirmText,
      cancelText,
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
