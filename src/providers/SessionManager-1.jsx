import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import useInactivityTimer from "../hooks/useInactivityTimer";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DialogConfirm from "../components/DialogConfirm";

const SessionManager = ({ onLogout }) => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [showDialog, setShowDialog] = useState(false);
  const isLoggedIn = (auth.user !== false);

  const handleConfirmClose = () => {
    setShowDialog(false);
  }
  const handleLogout = () => {
    setShowDialog(false);
    navigate("/signout");;
  }
  const handleContinue = () => { // perform the action on continue confirmation
    console.log("handleContinue");
    handleConfirmClose();
  };

  const handleTimeout = () => {
    setShowDialog(true);
  };

  useInactivityTimer(isLoggedIn, 5000 /*10 * 60 * 1000*/, handleTimeout); // 10 minutes (TODO: to config)

  useEffect(() => {
    if (showDialog) {
      const timer = setTimeout(() => {
        onLogout();
      }, 2 * 60 * 1000); // 2 minutes to respond (TODO: to config)

      return () => clearTimeout(timer);
    }
  }, [showDialog, onLogout]);

  return (
    showDialog && (
      <DialogConfirm
        open={showDialog}
        onClose={handleLogout}
        onCancel={handleContinue}
        onConfirm={handleContinue}
        title={t("Confirm using the app")}
        message={t("Do you want to continue using the app?")}
        confirmText={t("Continue")}
        cancelText={t("Logout")}
      />
    )
  );
};

export default SessionManager;
