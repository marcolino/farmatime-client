import React, { useState, useEffect, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import { AuthContext } from "../providers/AuthContext";
import { useSnackbarContext } from "../providers/SnackbarProvider";
import { JobContext } from "../providers/JobContext";

const InstallPWA = () => {
  const { isLoggedIn, isPWAInstalled, setPWAInstalled } = useContext(AuthContext);
  const { showSnackbar, closeSnackbar } = useSnackbarContext();

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIosSafari, setIsIosSafari] = useState(false);
  const { t } = useTranslation();
  const hasAskedThisSession = useRef(false);

  const { jobs } = useContext(JobContext);
  
  const timeToPromptUserToInstallApp = () => {
    const atLeastOneActivityConfirmed = (jobs.length >= 1); // condition: at least one job confirmed
    return isLoggedIn && atLeastOneActivityConfirmed && !isPWAInstalled;
  };

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(ua);
    const isSafari = isIos && /safari/.test(ua) && !/crios|fxios|android/.test(ua);
    setIsIosSafari(isSafari);

    const beforeInstallPromptHandler = (e) => {
      console.log("💡 beforeinstallprompt event fired");
      e.preventDefault();
      setDeferredPrompt(e);
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
    if (hasAskedThisSession.current) return; // <── prevent repeats
    hasAskedThisSession.current = true;

    showSnackbar(
      t(`\
For the best experience, install this app on your device.\n\
It will open instantly from your home screen or desktop,\n\
work even when you're offline, and feel just like a regular app,\n\
with faster access and a cleaner interface.\
`),
      "info",
      (key) => (
        <>
          <Button
            sx={{ mx: 0.5 }}
            variant="contained" 
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
            sx={{ mx: 0.5 }}
            variant="contained" 
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
    showSnackbar(t("Thank you for choosing to install our app!"), "success");
  };

  async function handleInstallClick() {
    if (!deferredPrompt) {
      console.warn("⚠️ No deferredPrompt available");
      return;
    }
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    setDeferredPrompt(null); // clear after use
    console.log("💡 choiceResult.outcome:", choiceResult.outcome);
    // Do not call markInstalled() here — wait for appinstalled
  }

  useEffect(() => {
    if (deferredPrompt && timeToPromptUserToInstallApp()) {
      showInstallSnackbar();
    }
  }, [deferredPrompt, isPWAInstalled]);

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
