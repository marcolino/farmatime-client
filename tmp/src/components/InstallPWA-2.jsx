import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from 'react-i18next';
import Button from "@mui/material/Button";
import { AuthContext } from "../providers/AuthContext"; // adjust path
import { useSnackbarContext } from "../providers/SnackbarProvider";

const InstallPWA = () => {
  const { isPWAInstalled, setPWAInstalled } = useContext(AuthContext);
  const { showSnackbar, closeSnackbar } = useSnackbarContext();

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIosSafari, setIsIosSafari] = useState(false);

  const { t } = useTranslation();

  // Custom gating logic
  const timeToPromptUserToInstallApp = () => {
    const atLeastOneActivityCreated = true; // TODO...
    console.log("💡 timeToPromptUserToInstallApp:", atLeastOneActivityCreated, !isPWAInstalled);
    return atLeastOneActivityCreated && !isPWAInstalled; // example: visited at least 3 times
  }

  useEffect(() => {
    // Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    const isSafari =
      isIos && /safari/.test(userAgent) && !/crios|fxios|android/.test(userAgent);
    setIsIosSafari(isSafari);

    function beforeInstallPromptHandler(e) {
      console.log("💡 beforeinstallprompt event fired:", e);

      e.preventDefault();
      setDeferredPrompt(e);

      if (timeToPromptUserToInstallApp()) {
        // Show snackbar immediately
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
      } else {
        console.log("💡 not time to prompt to install PWA yet, saved beforeinstallprompt event for later");
      }
    }

    const appInstalledHandler = () => {
      console.log("💡 appinstalled event fired");
      markInstalled();
    }

    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);
    window.addEventListener("appinstalled", appInstalledHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallPromptHandler);
      window.removeEventListener("appinstalled", appInstalledHandler);
    };
  }, [isPWAInstalled]);

  const markInstalled = () => {
    setPWAInstalled(true); // persist per user
    showSnackbar(
      t("Thank you for installing our app!"),
      "success"
    );
  }

  async function handleInstallClick() {
    console.log("💡 handleInstallClick clicked");
    console.log("💡 deferredPrompt:", deferredPrompt);
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    console.log("💡 choiceResult.outcome:", choiceResult.outcome);
    // if (choiceResult.outcome === "accepted") {
    //   markInstalled();
    // }
  }

  // iOS Safari fallback
  useEffect(() => {
    if (isIosSafari && !isPWAInstalled) {
      showSnackbar(
        t("To install this app, tap the Share button and then \"Add to Home Screen\"."),
        "info"
      );
    }
  }, [isIosSafari, isPWAInstalled]);

  return null; // no UI, only triggers snackbars
};

export default React.memo(InstallPWA);
