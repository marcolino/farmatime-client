import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import { AuthContext } from "../providers/AuthContext";
import { useSnackbarContext } from "../hooks/useSnackbarContext";
import { JobContext } from "../providers/JobContext";

const InstallPWA = () => {
  const { isLoggedIn, isPWAInstalled, setPWAInstalled } = useContext(AuthContext);
  const { showSnackbar, closeSnackbar } = useSnackbarContext();

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIosSafari, setIsIosSafari] = useState(false);
  const { t } = useTranslation();
  const hasAskedThisSession = useRef(false);

  const { jobs } = useContext(JobContext) || {};
  
  const timeToPromptUserToInstallApp = (isPWAInstalled) => {
    const atLeastOneActivityConfirmed = (jobs.length >= 1); // condition: at least one job confirmed
    return isLoggedIn && atLeastOneActivityConfirmed && !isPWAInstalled;
  };

  const markInstalled = useCallback(() => {
    setPWAInstalled(true);
    setDeferredPrompt(null);
    showSnackbar(t("Thank you for choosing to install our app!"), "success");
  }, [setPWAInstalled, setDeferredPrompt, showSnackbar, t]);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(ua);
    const isSafari = isIos && /safari/.test(ua) && !/crios|fxios|android/.test(ua);
    setIsIosSafari(isSafari);

    const beforeInstallPromptHandler = (e) => {
      //console.log("installPWA - beforeinstallprompt event fired");
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const appInstalledHandler = () => {
      //console.log("installPWA - appinstalled event fired");
      markInstalled();
    };

    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);
    window.addEventListener("appinstalled", appInstalledHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallPromptHandler);
      window.removeEventListener("appinstalled", appInstalledHandler);
    };
  }, [isPWAInstalled, markInstalled]);

  const showInstallSnackbar = () => {
    if (hasAskedThisSession.current) return; // <── prevent repeats
    hasAskedThisSession.current = true;

    showSnackbar(
      (isIosSafari) ?
        t('To install this app, tap the Share button and then "Add to Home Screen".')
      :
        t(`\
For the best experience, install this app on your device.\n\
It will open instantly from your home screen or desktop,\n\
work even when you're offline, and feel just like a regular app,\n\
with faster access and a cleaner interface.\
`),
      "info",
      (key) => (
        <>
          {!isIosSafari && (
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
          )}
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
    //const choiceResult = await deferredPrompt.userChoice;
    setDeferredPrompt(null); // clear after use
    // Do not call markInstalled() here — wait for appinstalled
  }

  useEffect(() => {
    if (deferredPrompt && timeToPromptUserToInstallApp(isPWAInstalled)) {
      showInstallSnackbar();
    }
  }, [deferredPrompt, isPWAInstalled]); // eslint-disable-line react-hooks/exhaustive-deps

  // useEffect(() => {
  //   if (isIosSafari && !isPWAInstalled) {
  //     showSnackbar(
  //       t('To install this app, tap the Share button and then "Add to Home Screen".'),
  //       "info"
  //     );
  //   }
  // }, [isIosSafari, isPWAInstalled]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

export default React.memo(InstallPWA);
