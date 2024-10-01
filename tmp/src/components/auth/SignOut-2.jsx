import React, { useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../providers/AuthProvider";
import { useSnackbar } from "../../providers/SnackbarManager";
import { apiCall } from "../../libs/Network";

function SignOut() {
  console.log("SignOut component mounted"); // Debugging
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const hasSignedOutRef = useRef(false); // track if sign-out has been triggered
  const isUnmountedRef = useRef(false); // track if component unmounted

  useEffect(() => {
    console.log("SignOut component rendered", hasSignedOutRef.current); // Debugging

    if (!hasSignedOutRef.current) {
      (async () => {
        try {
          hasSignedOutRef.current = true; // prevent multiple sign-out executions
          console.log("Attempting sign out"); // Debugging

          // make sign-out API call
          const result = await apiCall("post", "/auth/signout", { email: auth.user.email });
          if (result.err) {
            console.error("signOut error:", result);
          }

          if (!isUnmountedRef.current) {
            // avoid showing snackbar if component unmounts
            showSnackbar(t("sign out successful"), "success");
            setAuth({ user: false });
            navigate("/", { replace: true });
          }
        } catch (error) {
          console.error("Error during sign-out:", error);
        }
      })();
    }

    return () => {
      isUnmountedRef.current = true; // Mark the component as unmounted
    };
  }, [navigate, auth, setAuth, t, showSnackbar]);

  return null;
}

export default React.memo(SignOut);
