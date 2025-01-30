import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DialogConfirm from "./DialogConfirm";
import { AuthContext } from "../providers/AuthProvider";
import instance from "../middlewares/Interceptors";
import { i18n } from "../i18n";

const SessionExpirationHandler = ({ children }) => {
  const [showDialog, setShowDialog] = useState(false);
  const { signOut } = useContext(AuthContext);
  const pendingRequests = useRef([]);
  const isHandlingExpiration = useRef(false);
  const isSigningOut = useRef(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const interceptor = instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const { response } = error;

        if (response?.status === 401) {
          // if we're in the process of signing out, suppress all 401 errors
          if (isSigningOut.current) {
            return new Promise(() => {}); // Swallow the error
          }

          const errorCode = response?.data?.code;

          if (errorCode === "EXPIRED_TOKEN") {
            const deferredRequest = new Promise((_, reject) => {
              pendingRequests.current.push({
                config: error.config,
                reject
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

  const rejectPendingRequests = () => {
    pendingRequests.current.forEach(request => {
      //request.reject(new Error(i18n.t("Session expired")));
      request.reject(new Error("")); // we already show dialog, do not reject with an error message (which causes a snackbar...)
    });
    pendingRequests.current = [];
  };

  const handleSignIn = () => {
    setShowDialog(false);
    isHandlingExpiration.current = false;
    rejectPendingRequests();
    navigate("/signin", { 
      state: { 
        returnUrl: window.location.pathname,
        expired: true,
      } 
    });
  };

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
        message={i18n.t("Your session has expired") + ". " + i18n.t("Would you like to sign in again to continue?")}
        confirmText={i18n.t("Sign In")}
        cancelText={i18n.t("Cancel")}
      />
    </>
  );
};

export default SessionExpirationHandler;