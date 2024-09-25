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
  };
  const handleLogout = () => {
    setShowDialog(false);
    navigate("/signout");
  };
  const handleContinue = () => {
    setShowDialog(false);
  };
  const handleTimeout = () => {
    setShowDialog(true);
  };

  useInactivityTimer(isLoggedIn, 30 * 60 * 1000, handleTimeout); // start timer only when logged in - TODO: to config (inactivityTimeoutSeconds)

  useEffect(() => {
    if (showDialog) {
      const timer = setTimeout(() => {
        onLogout();
      }, 15 * 60 * 1000); // TODO: to config (inactivityResponseMaximumTimeSeconds)

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

export default SessionManager;
