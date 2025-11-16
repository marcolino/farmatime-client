import { useCallback, useMemo } from "react";
import { SnackbarProvider as NotistackSnackbarProvider, useSnackbar, closeSnackbar } from "notistack";
import { SnackbarContext } from "./SnackbarContext";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import config from "../config";

const InnerSnackbarProvider = ({ children }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showSnackbar = useCallback(
    (message = null, variant = "default", action = null) => {
      //console.log("*** InnerSnackbarProvider useCallback:", message, variant, action); // to tebug long duration of "logout completed" snackbar ...
      if (message) {
        enqueueSnackbar(message, {
          variant,
          action: action ? (key) => action(key) : null,
        });
      }
    },
    [enqueueSnackbar]
  );

  const contextValue = useMemo(
    () => ({ showSnackbar, closeSnackbar }),
    [showSnackbar, closeSnackbar]
  );

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
    </SnackbarContext.Provider>
  );
};

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
            position: "absolute",
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
