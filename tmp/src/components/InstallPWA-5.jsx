import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import { AuthContext } from "../providers/AuthContext";
import { useSnackbarContext } from "../providers/SnackbarProvider";

const InstallPWA = () => {
  const { isPWAInstalled, setPWAInstalled } = useContext(AuthContext);
  const { showSnackbar, closeSnackbar } = useSnackbarContext();

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIosSafari, setIsIosSafari] = useState(false);
  const { t } = useTranslation();

  // Gating logic: Only show snackbar if not installed
  const timeToPromptUserToInstallApp = () => {
    const atLeastOneActivityCreated = true; // TODO: ...
    return atLeastOneActivityCreated && !isPWAInstalled;
  };

  useEffect(() => {
    // Detect iOS Safari
    const ua = navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(ua);
    const isSafari = isIos && /safari/.test(ua) && !/crios|fxios|android/.test(ua);
    setIsIosSafari(isSafari);

    const beforeInstallPromptHandler = (e) => {
      console.log("💡 beforeinstallprompt event fired");
      e.preventDefault(); // Prevent default mini-infobar
      setDeferredPrompt(e); // Save event for later in session
    };

    const appInstalledHandler = () => {
      console.log("💡 appinstalled event fired");
      markInstalled();
    };

    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);
    window.addEventListener("appinstalled", appInstalledHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallPromptHandler);
      window.removeEventListener("appinstalled", appInstalledHandler);
    };
  }, [isPWAInstalled]);

  const showInstallSnackbar = () => {
    showSnackbar(
      t("Install this app for a better experience!"),
      "info",
      (key) => (
        <>
          <Button
            color="primary"
            size="small"
            onClick={() => {
              handleInstallClick();
              closeSnackbar(key);
            }}
          >
            {t("Install")}
          </Button>
          <Button
            color="secondary"
            size="small"
            onClick={() => closeSnackbar(key)}
          >
            {t("Cancel")}
          </Button>
        </>
      )
    );
  };

  const markInstalled = () => {
    setPWAInstalled(true);
    setDeferredPrompt(null);
    showSnackbar(t("Thank you for installing our app!"), "success");
  };

  async function handleInstallClick() {
    if (!deferredPrompt) {
      console.warn("⚠️ No deferredPrompt available");
      return;
    }
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    setDeferredPrompt(null); // Always clear after use
    console.log("💡 choiceResult.outcome:", choiceResult.outcome);
    // Wait for appinstalled event to call markInstalled()
  }

  // Show snackbar exactly once when both conditions are met
  useEffect(() => {
    if (deferredPrompt && timeToPromptUserToInstallApp()) {
      showInstallSnackbar();
    }
  }, [deferredPrompt, isPWAInstalled]);

  // iOS Safari fallback
  useEffect(() => {
    if (isIosSafari && !isPWAInstalled) {
      showSnackbar(
        t('To install this app, tap the Share button and then "Add to Home Screen".'),
        "info"
      );
    }
  }, [isIosSafari, isPWAInstalled]);

  return null;
};

export default React.memo(InstallPWA);
