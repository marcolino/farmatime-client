import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import { useSnackbarContext } from "../providers/SnackbarProvider";
import { useServiceWorker } from "../hooks/useServiceWorker";

const ServiceWorkerMessages = () => {
  const { offlineReady, needRefresh, updateServiceWorker } = useServiceWorker();
  const { t } = useTranslation();
  const { showSnackbar, closeSnackbar } = useSnackbarContext();
  const offlineSnackbarShown = useRef(false);

  useEffect(() => {
    if (offlineReady && !offlineSnackbarShown.current) {
      offlineSnackbarShown.current = true; // Mark as shown
      console.log("ServiceWorkerMessages:", offlineReady, needRefresh);
      showSnackbar({
        message: t("App is ready to work offline"),
        variant: "info",
      });
    }

    if (needRefresh) {
      showSnackbar(
        t("A new version is available") + "!",
        "info",
        (snackbarId) => (
          <>
            <Button onClick={() => { updateServiceWorker(); closeSnackbar(snackbarId); }} variant="contained" sx={{mr: 1}}>
              {t("Refresh")}
            </Button>
            <Button onClick={() => { closeSnackbar(snackbarId) }} variant="contained">
              {t("Wait")}
            </Button>
          </>
        )
      );
    }
  }, [offlineReady, needRefresh, updateServiceWorker, showSnackbar, t]);

  return null;
};

export default React.memo(ServiceWorkerMessages);
