import React, { useLayoutEffect, useContext, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../providers/AuthProvider";
import { useSnackbar } from "../../providers/SnackbarManager";
import { apiCall } from "../../libs/Network";

// global sign-out lock (to avoid double rendering)
let isGlobalSigningOut = false;

// Custom hook for single execution
function useSingleExecution(callback) {
  const hasRun = useRef(false);

  return useCallback(() => {
    if (hasRun.current || isGlobalSigningOut) return;
    hasRun.current = true;
    isGlobalSigningOut = true;
    callback();
  }, [callback]);
}

function SignOut() {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const handleSignOut = useCallback(async () => {
    try {
      const result = await apiCall("post", "/auth/signout", { email: auth.user.email });
      if (result.err) {
        console.error("signOut error:", result);
      } else {
        showSnackbar(t("sign out successful"), "success");
        setAuth({ user: false });
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("SignOut error:", error);
    } finally {
      isGlobalSigningOut = false;
    }
  }, [auth.user.email, navigate, setAuth, showSnackbar, t]);

  const singleExecutionSignOut = useSingleExecution(handleSignOut);

  useLayoutEffect(() => {
    singleExecutionSignOut();
  }, [singleExecutionSignOut]);

  return null;
}

export default SignOut;
