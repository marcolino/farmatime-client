import React, { useRef, useCallback, createContext, useContext } from "react";
import { SnackbarProvider } from "notistack";
import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import config from "../config";

// Create Snackbar context
const SnackbarContext = createContext();

// Custom hook to access snackbar context
const useSnackbarContext = () => useContext(SnackbarContext);

// Imperative snackbar hook for components to use
const useImperativeSnackbar = () => {
  const { showSnackbar } = useSnackbarContext();
  return showSnackbar;
};

let showGlobalSnackbar; // global reference for external access

const SnackbarProviderWrapper = ({ children }) => {
  const snackbarRef = useRef(null); // Reference for SnackbarProvider

  // Dismiss action for snackbar
  const dismissAction = useCallback((key) => (
    <Button onClick={() => snackbarRef.current.closeSnackbar(key)} color="secondary">
      <CloseIcon sx={{ fontSize: config.ui.snacks.closeIcon.fontSize }} />
    </Button>
  ), []);

  // Show snackbar callback with ref check
  const { showSnackbar } = useCallback((message, variant = "default", action = dismissAction) => {
    if (snackbarRef.current) {
      snackbarRef.current.enqueueSnackbar(message, {
        variant,
        action: (key) => action(key),
        autoHideDuration: config.ui.snacks.autoHideDurationSeconds * 1000,
        style: {
          fontSize: config.ui.snacks.style.fontSize,
          whiteSpace: config.ui.snacks.style.whiteSpace,
        },
      });
    }
  }, [dismissAction]);

  // Assign the callback to a global reference
  showGlobalSnackbar = showSnackbar;

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      <SnackbarProvider
        maxSnack={config.ui.snacks.maxInStack}
        anchorOrigin={{
          vertical: config.ui.snacks.anchorOrigin.vertical,
          horizontal: config.ui.snacks.anchorOrigin.horizontal,
        }}
        ref={snackbarRef}
      >
        {children}
      </SnackbarProvider>
    </SnackbarContext.Provider>
  );
};

export { showGlobalSnackbar, useSnackbarContext, useImperativeSnackbar as useSnackbar };
export default SnackbarProviderWrapper;
