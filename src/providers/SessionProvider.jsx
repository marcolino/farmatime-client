import React, { useState, useEffect, useContext } from "react";
//import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../providers/AuthProvider";
import useInactivityTimer from "../hooks/useInactivityTimer";
import DialogConfirm from "../components/DialogConfirm";
import config from "../config";


const SessionProvider = (/*{ onLogout }*/) => {
  const { auth, signOut } = useContext(AuthContext);
  const { t } = useTranslation();
  
  const [showDialog, setShowDialog] = useState(false);
  const isLoggedIn = (auth.user !== false);

  const handleLogout = async() => {
    setShowDialog(false);
    await signOut();
  };
  const handleContinue = () => {
    setShowDialog(false);
  };
  const handleTimeout = () => {
    setShowDialog(true);
  };

  // start timer only when logged in
  useInactivityTimer(isLoggedIn, config.auth.clientSessionExpirationSeconds * 1000, handleTimeout);

  useEffect(() => {
    if (showDialog) {
      //console.log(`SessionProvider, setting up timer after ${config.auth.clientSessionExpirationResponseMaximumSeconds} seconds to auto-close dialog and call onLogout...`);
      const timer = setTimeout(() => {
        //console.log(`SessionProvider, clientSessionExpirationResponseMaximumSeconds ${config.auth.clientSessionExpirationResponseMaximumSeconds} seconds timeout expired, calling onLogout`);
        setShowDialog(false);
        signOut();
      }, config.auth.clientSessionExpirationResponseMaximumSeconds * 1000);
      //console.log(`SessionProvider, set timer: ${timer}`);

      return () => {
        clearTimeout(timer);
        //console.log(`SessionProvider, cleared timer: ${timer}`);
      };
    }
  }, [showDialog, signOut]);

  return (
    showDialog && (
      <DialogConfirm
        open={showDialog}
        onClose={handleContinue}
        onCancel={handleLogout}
        onConfirm={handleContinue}
        title={t("Confirm still using the app")}
        message={t("Are you still using the app?")}
        confirmText={t("Continue")}
        cancelText={t("Logout")}
      />
    )
  );
};

export default SessionProvider;
