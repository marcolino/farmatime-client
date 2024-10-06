import React, { useState, useEffect, useContext } from "react";
//import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../providers/AuthProvider";
import useInactivityTimer from "../hooks/useInactivityTimer";
import DialogConfirm from "../components/DialogConfirm";
import config from "../config";


const SessionProvider = ({ onLogout }) => {
  const { auth, signOut } = useContext(AuthContext);
  //const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [showDialog, setShowDialog] = useState(false);
  const isLoggedIn = (auth.user !== false);

  // const handleConfirmClose = () => {
  //   setShowDialog(false);
  // };
  const handleLogout = async() => {
    setShowDialog(false);
    await signOut();
    // navigate("/signout");
  };
  const handleContinue = () => {
    setShowDialog(false);
  };
  const handleTimeout = () => {
    setShowDialog(true);
  };

  useInactivityTimer(isLoggedIn, config.auth.clientSessionExpirationSeconds * 1000, handleTimeout); // start timer only when logged in

  useEffect(() => {
    if (showDialog) {
      const timer = setTimeout(() => {
        onLogout();
      }, config.auth.clientSessionExpirationResponseMaximumSeconds * 1000);
      return () => clearTimeout(timer);
    }
  }, [showDialog, onLogout]);

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
