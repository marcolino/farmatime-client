import { useContext, useMemo } from "react";
import { SnackbarProvider as NotistackSnackbarProvider, useSnackbar } from "notistack";
import { SnackbarContext } from "./SnackbarContext";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import config from "../config";

const InnerSnackbarProvider = ({ children }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // Show a snackbar with a given variant
  const showSnackbar = (message = null, variant = "default", action = null) => {
    if (!message) return;

    enqueueSnackbar(message, {
      variant,
      action: action ? (key) => action(key) : undefined,
    });
  };

  const contextValue = useMemo(
    () => ({ showSnackbar, closeSnackbar }),
    [enqueueSnackbar, closeSnackbar]
  );

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
    </SnackbarContext.Provider>
  );
};

export const SnackbarProviderWrapper = ({ children }) => {
  return (
    <NotistackSnackbarProvider
      maxSnack={config.ui.snacks.maxInStack}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      autoHideDuration={config.ui.snacks.autoHideDurationSeconds * 1000}
      preventDuplicate={config.mode.production}
      style={{
        fontSize: config.ui.snacks.style.fontSize,
        whiteSpace: "normal",
      }}
      ContentProps={{
        sx: {
          "& .MuiSnackbarContent-root": {
            maxWidth: "420px",
            width: "100%",
            whiteSpace: "normal",      // wraps text at spaces
            wordBreak: "break-word",    // breaks long words if needed
            overflowWrap: "anywhere",   // forces wrapping for very long unbroken text
          },
          "& .MuiSnackbarContent-message": {
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowWrap: "anywhere",
          },
        },
      }}
      action={(key) => (
        <IconButton
          onClick={() => closeSnackbar(key)}
          color="inherit"
          sx={{
            position: "absolute",
            top: -4,
            right: -4,
          }}
        >
          <CloseIcon sx={{ fontSize: config.ui.snacks.closeIcon.fontSize }} />
        </IconButton>
      )}
    >
      <InnerSnackbarProvider>{children}</InnerSnackbarProvider>
    </NotistackSnackbarProvider>
  );
};

export const useSnackbarContext = () => useContext(SnackbarContext);
