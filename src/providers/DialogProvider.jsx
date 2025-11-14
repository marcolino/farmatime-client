import { useState, useCallback } from "react";
import { DialogContext } from "./DialogContext";
import DialogConfirm from "../components/DialogConfirm";

export const DialogProvider = ({ children }) => {
  const [dialogs, setDialogs] = useState([]); // stack of open dialogs

  const showDialog = useCallback((options) => {
    setDialogs((prev) => [...prev, { ...options, open: true }]);
  }, []);

  const closeDialog = useCallback((count = 1) => {
    setDialogs((prev) => prev.slice(0, -count));
  }, []);

  return (
    <DialogContext.Provider value={{ showDialog, closeDialog }}>
      {children}

      {dialogs.map((dialog, index) => (
        <DialogConfirm
          key={index}
          open={dialog.open}
          title={dialog.title}
          message={dialog.message}
          confirmText={dialog.confirmText}
          cancelText={dialog.cancelText}
          onConfirm={() => {
            dialog.onConfirm?.();
            closeDialog();
          }}
          onCancel={() => {
            dialog.onCancel?.();
            closeDialog();
          }}
          onClose={closeDialog}
        />
      ))}
    </DialogContext.Provider>
  );
};
