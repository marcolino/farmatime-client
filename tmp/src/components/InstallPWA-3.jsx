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

  // Persistent flag to avoid nagging between sessions
  const hasPromptedBefore = () => localStorage.getItem("hasPromptedPWAInstall") === "true";
  const setHasPrompted = () => localStorage.setItem("hasPromptedPWAInstall", "true");

  // Gating logic: only show snackbar if not installed & not prompted before
  const timeToPromptUserToInstallApp = () => {
    const atLeastOneActivityCreated = true; // TODO: ...
    console.log("💡 timeToPromptUserToInstallApp:", atLeastOneActivityCreated, !isPWAInstalled, !hasPromptedBefore());
    return atLeastOneActivityCreated && !isPWAInstalled && !hasPromptedBefore();
  };

  useEffect(() => {
    // Detect iOS Safari
    const ua = navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(ua);
    const isSafari = isIos && /safari/.test(ua) && !/crios|fxios|android/.test(ua);
    setIsIosSafari(isSafari);

    const beforeInstallPromptHandler = (e) => {
      console.log("💡 beforeinstallprompt event fired");
      e.preventDefault(); // Always stop default mini-infobar
      setDeferredPrompt(e); // Always store it for later use in session

      if (timeToPromptUserToInstallApp()) {
        showInstallSnackbar();
      } else {
        console.log("💡 Not time to prompt yet, saved for later");
      }
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

  const markInstalled = () => {
    setPWAInstalled(true);
    setDeferredPrompt(null);
    setHasPrompted();
    showSnackbar(t("Thank you for installing our app!"), "success");
  };

  const showInstallSnackbar = () => {
    setHasPrompted(); // Remember we've asked
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

  async function handleInstallClick() {
    if (!deferredPrompt) {
      console.warn("⚠️ No deferredPrompt available");
      return;
    }
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    setDeferredPrompt(null); // Always clear after prompt
    console.log("💡 choiceResult.outcome:", choiceResult.outcome);
    // Do not call markInstalled() here — wait for appinstalled
  }

  // iOS Safari fallback
  useEffect(() => {
    if (isIosSafari && !isPWAInstalled && !hasPromptedBefore()) {
      setHasPrompted();
      showSnackbar(
        t('To install this app, tap the Share button and then "Add to Home Screen".'),
        "info"
      );
    }
  }, [isIosSafari, isPWAInstalled]);

  return null;
};

export default React.memo(InstallPWA);
