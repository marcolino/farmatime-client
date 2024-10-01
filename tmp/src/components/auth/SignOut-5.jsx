import React, { useEffect, useContext, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../providers/AuthProvider";
import { useSnackbar } from "../../providers/SnackbarManager";
import { apiCall } from "../../libs/Network";

function SignOut() {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const hasSignedOut = useRef(false);

  console.log("SignOut component rendered", new Date().toISOString());

  const handleSignOut = useCallback(async () => {
    if (hasSignedOut.current) {
      console.log("Sign out already executed, skipping");
      return;
    }

    console.log("Executing sign out logic", new Date().toISOString());
    try {
      const result = await apiCall("post", "/auth/signout", { email: auth.user.email });
      if (result.err) {
        console.error("signOut error:", result);
      }
      showSnackbar(t("sign out successful"), "success");
      setAuth({ user: false });
      navigate("/", { replace: true });
      hasSignedOut.current = true;
    } catch (error) {
      console.error("SignOut error:", error);
    }
  }, [auth.user.email, navigate, setAuth, showSnackbar, t]);

  useEffect(() => {
    console.log("SignOut effect running", new Date().toISOString());
    handleSignOut();

    return () => {
      console.log("SignOut effect cleanup", new Date().toISOString());
    };
  }, [handleSignOut]);

  return null;
}

export default SignOut;
