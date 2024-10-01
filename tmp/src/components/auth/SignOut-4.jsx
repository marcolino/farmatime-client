import React, { useEffect, useContext, useCallback } from "react";
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

  const handleSignOut = useCallback(async () => {
    console.log("SignOut component running server signout logic");
    try {
      const result = await apiCall("post", "/auth/signout", { email: auth.user.email });
      if (result.err) {
        console.error("signOut error:", result);
      }
      showSnackbar(t("sign out successful"), "success");
      setAuth({ user: false });
      navigate("/", { replace: true });
    } catch (error) {
      console.error("SignOut error:", error);
    }
  }, [auth.user.email, navigate, setAuth, showSnackbar, t]);

  useEffect(() => {
    console.log("SignOut component effect running");
    handleSignOut();
  }, [handleSignOut]);

  return null;
}

export default SignOut;
