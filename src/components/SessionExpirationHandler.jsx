import React, { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DialogConfirm from "./DialogConfirm";
import { AuthContext } from "../providers/AuthContext";
import instance from "../middlewares/Interceptors";
import { i18n } from "../i18n";

const SessionExpirationHandler = ({ children }) => {
  const [showDialog, setShowDialog] = useState(false);
  const { signOut } = useContext(AuthContext);
  const pendingRequests = useRef([]);
  const isHandlingExpiration = useRef(false);
  const isSigningOut = useRef(false);

  const navigate = useNavigate();
  const navigateRef = useRef(navigate);

  // Keep navigateRef updated if navigate changes (unlikely but safe)
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  // Helper to reject all pending requests without error message (to avoid snackbar)
  const rejectPendingRequests = () => {
    pendingRequests.current.forEach((request) => {
      request.reject(new Error("")); // suppress error message
    });
    pendingRequests.current = [];
  };

  useEffect(() => {
    const interceptor = instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const { response } = error;

        if (response?.status === 401) {
          if (isSigningOut.current) {
            // If signing out, swallow all 401 errors silently
            return new Promise(() => {});
          }

          const errorCode = response?.data?.code;

          if (errorCode === "EXPIRED_TOKEN") {
            // Create a deferred Promise for the failed request
            const deferredRequest = new Promise((_, reject) => {
              pendingRequests.current.push({
                config: error.config,
                reject,
              });
            });

            if (!isHandlingExpiration.current) {
              isHandlingExpiration.current = true;
              setShowDialog(true);
            }

            return deferredRequest;
          }

          return Promise.reject(error);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      instance.interceptors.response.eject(interceptor);
      rejectPendingRequests();
    };
  }, []);

  // Called when user confirms to sign in again
  const handleSignIn = () => {
    setShowDialog(false);
    isHandlingExpiration.current = false;
    rejectPendingRequests();

    // Use navigateRef.current to ensure Router context
    const nav = navigateRef.current;
    if (nav) {
      nav("/signin", {
        state: {
          returnUrl: window.location.pathname,
          expired: true,
        },
      });
    }
  };

  // Called when user cancels (sign out)
  const handleCancel = async () => {
    setShowDialog(false);
    isHandlingExpiration.current = false;
    isSigningOut.current = true;
    try {
      await signOut();
    } finally {
      isSigningOut.current = false;
      rejectPendingRequests();
    }
  };

  return (
    <>
      {children}
      <DialogConfirm
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onCancel={handleCancel}
        onConfirm={handleSignIn}
        title={i18n.t("Session Expired")}
        message={
          i18n.t("Your session has expired") +
          ". " +
          i18n.t("Would you like to sign in again to continue?")
        }
        confirmText={i18n.t("Sign In")}
        cancelText={i18n.t("Cancel")}
      />
    </>
  );
};

export default SessionExpirationHandler;
