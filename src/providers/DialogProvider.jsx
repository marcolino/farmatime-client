// DialogProvider.js
import { /*createContext, */useState, /*useContext, */ useCallback, useEffect } from "react";
//import { useTranslation } from "react-i18next";
import { DialogContext } from "./DialogContext";
import DialogConfirm from "../components/DialogConfirm";

export const DialogProvider = ({ children }) => {
  //const { t } = useTranslation();
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

  const closeDialog = useCallback(() => {
    setDialogState((prevState) => ({ ...prevState, open: false }));
  }, []);

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
  }, [closeDialog]);

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
