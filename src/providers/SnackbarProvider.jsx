import React, { createContext, useContext, useMemo } from "react";
import { SnackbarProvider as NotistackSnackbarProvider, useSnackbar, closeSnackbar } from "notistack";
//import IconButton from "@mui/material/IconButton";
import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import config from "../config";


const SnackbarContext = createContext(null);

// internal component to use useSnackbar inside the NotistackSnackbarProvider
const InnerSnackbarProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();

  // function to show a snackbar with a given variant
  const showSnackbar = (message = "This is a custom snackbar", variant = "default") => {
    enqueueSnackbar(message, { variant });
  };

  // memoize the context value to prevent unnecessary renders
  const contextValue = useMemo(() => ({ showSnackbar }), [showSnackbar]);

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
    </SnackbarContext.Provider>
  );
};

// custom provider component
export const SnackbarProviderWrapper = ({ children }) => {
  const handleDismiss = (key) => {
    closeSnackbar(key);
  };

  return (
    <NotistackSnackbarProvider
      maxSnack={config.ui.snacks.maxInStack}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      autoHideDuration={config.ui.snacks.autoHideDurationSeconds * 1000}
      style={{
        fontSize: config.ui.snacks.style.fontSize,
        whiteSpace: config.ui.snacks.style.whiteSpace,
      }}
      action={(key) => (
        <Button onClick={() => handleDismiss(key)} color="inherit">
          <CloseIcon sx={{ fontSize: config.ui.snacks.closeIcon.fontSize }} />
        </Button>
      )}
      preventDuplicate={config.mode.production} // prevent duplicates only in production, better being aware of duplicates, while developing...
    >
      <InnerSnackbarProvider>{children}</InnerSnackbarProvider>
    </NotistackSnackbarProvider>
  );
};

// custom hook to access the snackbar context
export const useSnackbarContext = () => useContext(SnackbarContext);
// export {
//   SnackbarProviderWrapper,
//   useSnackbarContext,
// };
