import React from "react";
import { useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
//import { signOut } from "../../libs/TrackPromise";
import { AuthContext } from "../../providers/AuthProvider";
//import { OnlineStatusContext } from "../../providers/OnlineStatusProvider";
import { useSnackbar }  from "../../providers/SnackbarManager";
import { apiCall }  from "../../libs/Network";


function SignOut() {
  const navigate = useNavigate();
  //const isOnline = useContext(OnlineStatusContext);
  const { auth, setAuth } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  // e.preventDefault();
  // if (!validateForm()) return;
  // setError({});
  
  // use `useEffect` to avoid  "cannot update a component while rendering a different component" error
  // useEffect(() => {
  //   let isMounted = true;
  //   (async () => {
  //     if (isMounted) {
  //       const result = await apiCall("post", "/auth/signout", { email: auth.user.email });
  //       if (result.err) { // user should not be notified about signout problems on server...
  //         console.error("signOut error:", result);
  //       }
  //       showSnackbar(t("sign out successful"), "success");
  //       setAuth({ user: false });
  //       navigate("/", { replace: true });
  //     }
  //   })();
  //   return () => {
  //     isMounted = false; // cleanup function
  //   };
  // }, [navigate, auth, setAuth, t]);

  const isMountedRef = useRef(true); // to avoid double rendering while developing

  // use `useEffect` to avoid  "cannot update a component while rendering a different component" error
  useEffect(() => {
    (async () => {
      if (isMountedRef.current) {
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
