import React, { useState, useEffect } from "react";
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIosSafari, setIsIosSafari] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    // Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = isIos && /safari/.test(userAgent) && !/crios|fxios|android/.test(userAgent);
    setIsIosSafari(isSafari);

    function beforeInstallPromptHandler(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      setSnackbarOpen(true);
    }

    function appInstalledHandler() {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setSnackbarOpen(false);
    }

    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);
    window.addEventListener("appinstalled", appInstalledHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallPromptHandler);
      window.removeEventListener("appinstalled", appInstalledHandler);
    };
  }, []);

  async function handleInstallClick() {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
    setSnackbarOpen(false);
  }

  function handleCloseSnackbar(_, reason) {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  }

  // Snackbar for installable PWA
  if (deferredPrompt && !isInstalled) {
    return (
      <Snackbar
        open={snackbarOpen}
        message="Install this app for a better experience!"
        action={
          <>
            <Button color="primary" size="small" onClick={handleInstallClick}>
              Install
            </Button>
            <Button color="secondary" size="small" onClick={handleCloseSnackbar}>
              Cancel
            </Button>
          </>
        }
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    );
  }

  // Fallback for iOS Safari
  if (isIosSafari && !isInstalled) {
    return (
      <Snackbar
        open={true}
        message='To install this app, tap the Share button and then "Add to Home Screen".'
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    );
  }

  // Optionally, show a thank you after install
  if (isInstalled) {
    return (
      <Snackbar
        open={true}
        message="Thank you for installing our app!"
        onClose={handleCloseSnackbar}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    );
  }

  // If nothing to show, return null
  return null;
}
