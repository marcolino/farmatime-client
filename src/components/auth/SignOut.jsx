import React from "react";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { signOut } from "../../libs/TrackPromise";
import { AuthContext } from "../../providers/AuthProvider";
import { OnlineStatusContext } from "../../providers/OnlineStatusProvider";
import { toast } from "../Toast";



function SignOut() {
  const navigate = useNavigate();
  const isOnline = useContext(OnlineStatusContext);
  const { auth, setAuth } = useContext(AuthContext);
  const { t } = useTranslation();

  // use `useEffect` to avoid  "cannot update a component while rendering a different component" error
  useEffect(() => {
    if (!isOnline) { // fake signout while offline...
      //return toast.warning("You are currently offline. Please wait for the network to become available.");
      //console.log("signOut calling setAuth");
      console.log("SETAUTH {user: false}:");
      setAuth({ user: false });
      navigate("/", { replace: true });
    } else {
      signOut({
        success: () => {
          //toast.success(t("Signed out")); // too noisy...
          //console.log("signOut calling setAuth");
          //console.log("SETAUTH auth:", auth);
          console.log("SETAUTH {user: false}:");
          setAuth({ user: false })
          //console.log("SETAUTH auth:", auth);
          navigate("/", { replace: true });
        },
        error: (err) => {
          console.error("signOut error:", err);
          toast.error(t(err.message));
        }
      });
    }
  }, [isOnline, navigate, auth, setAuth, t]);

  return null;
};

export default React.memo(SignOut);
