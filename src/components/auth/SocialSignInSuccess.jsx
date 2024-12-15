import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSnackbarContext } from "../../providers/SnackbarProvider"; 
import { AuthContext } from "../../providers/AuthProvider";


function SocialSignInSuccess() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { signIn } = useContext(AuthContext);
  const { showSnackbar } = useSnackbarContext();
  const params = new URLSearchParams(location.search);
  const stringifiedData = params.get("data");
  //const stringifiedData = new URLSearchParams(location.search).params.get("data");
  const [user] = useState(JSON.parse(stringifiedData));
  // try {
  //   user = JSON.parse(stringifiedData);
  // } catch {
  //   console.error("*** SocialSignInSuccess: error: user is not valid JSON!", user);
  //   navigate("/social-signin-error", { replace: true }); // redirect to home route
  // }

  useEffect(() => {
    if (!user) {
      console.error("*** SocialSignInSuccess: error: no user!");
      navigate("/social-signin-error", { replace: true }); // redirect to home route
    }
    if (user.accessToken && user.refreshToken) {
      console.log("*** SocialSignInSuccess:", user);
      signIn(user);
      showSnackbar(t("Social sign in successful"), "success");
      navigate("/", { replace: true }); // redirect to home route
    }
  }, [user, navigate]);
}

export default React.memo(SocialSignInSuccess);
