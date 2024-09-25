import React, { useEffect, createContext, useContext, useCallback } from "react";
import { SnackbarProvider, useSnackbar } from "notistack";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import config from "../config";

const SnackbarContext = createContext();

// Global reference to showSnackbar function
let globalShowSnackbar = null;

function useImperativeSnackbar() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const dismissAction = (key) => (
    <Button onClick={() => closeSnackbar(key)} color="secondary">
      <CloseIcon sx={{fontSize: "1.1rem"}} />
    </Button>
  );

  const showSnackbar = useCallback((message, variant = "default", action = dismissAction) => {
    enqueueSnackbar(message, {
      variant,
      action: (key) => (
        <>
          {action && action(key)}
        </>
      ),
      autoHideDuration: config.ui.snacks.autoHideDurationSeconds * 1000,
      style: {
        fontSize: "1.1rem",
        whiteSpace: "pre-line",
      },
    });
  }, [enqueueSnackbar]);

  // Set the global reference
  useEffect(() => {
    globalShowSnackbar = showSnackbar;
    return () => {
      globalShowSnackbar = null;
    };
  }, [showSnackbar]);

  return { showSnackbar, dismissAction };
}

function SnackbarManager({ children }) {
  const { showSnackbar } = useImperativeSnackbar();
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("Service Worker registered:", r);
    },
    onRegisterError(error) {
      console.error("Service Worker registration error", error);
    },
  });

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === "SHOW_SNACKBAR") {
        showSnackbar(event.data.message, event.data.variant || "default");
      }
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, [showSnackbar]);

  useEffect(() => {
    if (offlineReady) {
      showSnackbar("App ready to work offline", "success");
      setOfflineReady(false);
    }
  }, [offlineReady, showSnackbar, setOfflineReady]);

  useEffect(() => {
    if (needRefresh) {
      showSnackbar(
        "New content available, click to update",
        "info",
        (key) => (
          <Button 
            onClick={() => {
              updateServiceWorker(true);
              closeSnackbar(key);
            }}
            color="inherit"
          >
            Reload
          </Button>
        )
      );
    }
  }, [needRefresh, showSnackbar, updateServiceWorker]);

  return children;
}

function SnackbarProviderWrapper({ children }) {
  const snackbarFunctions = useImperativeSnackbar();
  
  return (
    <SnackbarProvider 
      maxSnack={config.ui.snacks.maxInStack} 
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      <SnackbarContext.Provider value={snackbarFunctions}>
        <SnackbarManager>{children}</SnackbarManager>
      </SnackbarContext.Provider>
    </SnackbarProvider>
  );
}

const useSnackbarContext = () => useContext(SnackbarContext);

// Global function to show snackbar
export const showGlobalSnackbar = (message, variant = "default") => {
  if (globalShowSnackbar) {
    globalShowSnackbar(message, variant);
  } else {
    console.warn("Snackbar function not available");
  }
};

export { useSnackbarContext, useImperativeSnackbar as useSnackbar };
export default SnackbarProviderWrapper;