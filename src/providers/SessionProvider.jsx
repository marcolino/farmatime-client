import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../providers/AuthProvider";
import useInactivityTimer from "../hooks/useInactivityTimer";
import DialogConfirm from "../components/DialogConfirm";
import config from "../config";


const SessionProvider = () => {
  const { auth, isLoggedIn, signOut } = useContext(AuthContext);
  const { t } = useTranslation();
  
  const [showDialog, setShowDialog] = useState(false);
  //const isLoggedIn = (auth.user !== false && auth.user !== null);
  //console.log("++++SessionProvider, isLoggedIn:", isLoggedIn);
  //console.log("++++SessionProvider, auth.user:", auth.user);

  const handleLogout = async () => {
    setShowDialog(false);
    await signOut();
    //setAuth({ user: false }); // user is not set, but not null, it means she has an account
  };
  const handleContinue = () => {
    setShowDialog(false);
  };
  const handleTimeout = () => {
    setShowDialog(true);
  };

  // start timer only when logged in
  if (config.auth.clientSessionExpirationSeconds > 0) {
    useInactivityTimer(isLoggedIn, config.auth.clientSessionExpirationSeconds * 1000, handleTimeout);
  }

  useEffect(() => {
    if (showDialog) {
      const timer = setTimeout(async () => {
        //console.log(`SessionProvider, clientSessionExpirationResponseMaximumSeconds ${config.auth.clientSessionExpirationResponseMaximumSeconds} seconds timeout expired`);
        setShowDialog(false);
        await signOut();
        //setAuth({ user: false }); // user is not set, but not null, it means she has an account
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
