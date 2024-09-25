import React, { useEffect } from "react";
import { SnackbarProvider, useSnackbar } from "notistack";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import config from "../config";

function SnackbarManager({ children }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("SW Registered: ", r);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });
  const { t } = useTranslation();

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === "SHOW_SNACKBAR") {
        enqueueSnackbar(event.data.message, {
          variant: event.data.variant || "default",
          autoHideDuration: config.ui.snack.autoHideDurationSeconds * 1000,
        });
      }
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, [enqueueSnackbar]);

  useEffect(() => {
    if (offlineReady) {
      enqueueSnackbar(t("App ready to work offline"), {
        variant: "success",
        autoHideDuration: 5 * 1000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        onClose: () => setOfflineReady(false),
      });
    }
  }, [offlineReady, enqueueSnackbar, setOfflineReady]);

  useEffect(() => {
    if (needRefresh) {
      enqueueSnackbar(t("New content available, click to update"), {
        variant: "info",
        persist: true,
        action: (key) => (
          <Button 
            onClick={() => {
              updateServiceWorker(true);
              closeSnackbar(key);
            }}
            color="inherit"
          >
            {t("Reload")}
          </Button>
        ),
      });
    }
  }, [needRefresh, enqueueSnackbar, updateServiceWorker, closeSnackbar]);

  return children;
}

function SnackbarProviderWrapper({ children }) {
  return (
    <SnackbarProvider maxSnack={config.ui.snacks.maxInStack}>
      <SnackbarManager>{children}</SnackbarManager>
    </SnackbarProvider>
  );
}

export default SnackbarProviderWrapper;
