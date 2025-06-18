import { /*createContext, */useContext, useMemo } from "react";
import { SnackbarProvider as NotistackSnackbarProvider, useSnackbar, closeSnackbar } from "notistack";
import { SnackbarContext } from "./SnackbarContext";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import config from "../config";

//const SnackbarContext = createContext(null);

// internal component to use useSnackbar inside the NotistackSnackbarProvider
const InnerSnackbarProvider = ({ children }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // show a snackbar with a given variant
  const showSnackbar = (message = null, variant = "default", action = null) => {
    if (message) { // ignore empty message snackbars
      enqueueSnackbar(message, {
        variant,
        action: action ? (key) => action(key) : null, // pass snackbarId if action is provided
      });
    }
  };

  // memoize the context value to prevent unnecessary renders
  const contextValue = useMemo(() => ({ showSnackbar, closeSnackbar }), [showSnackbar]);

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
        <IconButton
          onClick={() => handleDismiss(key)}
          color="inherit"
          sx={{
            position: "absolute", // Position it at the top-right
            top: -4,
            right: -4,
          }}
        >
          <CloseIcon sx={{ fontSize: config.ui.snacks.closeIcon.fontSize }} />
        </IconButton>
      )}
      ContentProps={{
        sx: {
          position: "relative",
          "& .MuiSnackbarContent-message": {
            overflowWrap: "break-word",
          },
        },
      }}
      preventDuplicate={config.mode.production}
    >
      <InnerSnackbarProvider>{children}</InnerSnackbarProvider>
    </NotistackSnackbarProvider>
  );
};

// custom hook to access the snackbar context
export const useSnackbarContext = () => useContext(SnackbarContext);
