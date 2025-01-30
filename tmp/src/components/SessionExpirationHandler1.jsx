import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DialogConfirm from "./DialogConfirm";
import { AuthContext } from "../providers/AuthProvider";
import instance/*, { cancelAllRequests }*/ from "../middlewares/Interceptors";
import { i18n } from "../i18n";

const SessionExpirationHandler = ({ children }) => {
  const [showDialog, setShowDialog] = useState(false);
  const { signOut } = useContext(AuthContext);
  const pendingRequests = useRef([]);
  const isHandlingExpiration = useRef(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const interceptor = instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const { response, config } = error;

        // // skip interceptor for signout endpoint - TODO SIGNOUT
        // if (config.url.includes("/auth/signout")) {
        //   return Promise.reject(error);
        // }

        if (response?.status === 401) {
          const errorCode = response?.data?.code;

          // only handle token expiration, let other 401s pass through
          if (errorCode === "EXPIRED_TOKEN") {
            // // don't handle signout request failures due to expired token
            // if (error.config.url === "/auth/signout") {
            //   return Promise.reject(error);
            // }

            // create a new promise for this request
            const deferredRequest = new Promise((_, reject) => {
              pendingRequests.current.push({
                config: error.config,
                reject
              });
            });

            // only show dialog if we are not already handling an expiration
            if (!isHandlingExpiration.current) {
              isHandlingExpiration.current = true;
              setShowDialog(true);
            }

            return deferredRequest;
          }
          
          // let other 401s propagate to your existing interceptor
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
        expired: true 
      } 
    });
  };

  const handleCancel = async () => {
    setShowDialog(false);
    isHandlingExpiration.current = false;
    // try {
    //   await signOut();
    // } catch (error) {
    //   // ignore any auth errors during signout when token is expired
    //   console.log("ignoring auth error during signout with expired token");
    // }
    let ok = await signOut();
    console.log("signout result:", ok);
    rejectPendingRequests();
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
        message={i18n.t("Your session has expired. Would you like to sign in again to continue?")}
        confirmText={i18n.t("Sign In")}
        cancelText={i18n.t("Cancel")}
      />
    </>
  );
};

export default SessionExpirationHandler;
