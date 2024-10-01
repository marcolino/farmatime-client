import React from "react";
import { useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../providers/AuthProvider";
import { useSnackbar }  from "../../providers/SnackbarManager";
import { apiCall }  from "../../libs/Network";


function SignOut() {
  console.log("SignOut component mounted");
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const isMountedRef = useRef(true); // to avoid double rendering while developing

  // use `useEffect` to avoid  "cannot update a component while rendering a different component" error
  useEffect(() => {
    console.log("SignOut component rendered"); //, hasSignedOutRef.current);
    (async () => {
      if (isMountedRef.current) {
        console.log("SignOut component running server signout logic");
        // sign-out logic
        const result = await apiCall("post", "/auth/signout", { email: auth.user.email });
        if (result.err) { // user should not care about signout problems on server
          console.error("signOut error:", result);
        }
        showSnackbar(t("sign out successful"), "success");
        setAuth({ user: false });
        navigate("/", { replace: true });
      }
    })();

    return () => {
      isMountedRef.current = false;
    };
  }, [navigate, auth, setAuth, t]);
  
  return null;
};

export default React.memo(SignOut);
