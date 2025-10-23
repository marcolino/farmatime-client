import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDialog } from "../../providers/DialogContext";
import { useSnackbarContext } from "../../hooks/useSnackbarContext"; 
import { AuthContext } from "../../providers/AuthContext";


function SocialSignInSuccess() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { signIn } = useContext(AuthContext);
  const { showSnackbar } = useSnackbarContext();
  const { showDialog } = useDialog();
  
  const params = new URLSearchParams(location.search);
  const stringifiedData = params.get("data");
  const [user] = useState(JSON.parse(stringifiedData));

  useEffect(() => {
    if (!user) {
      console.error("*** SocialSignInSuccess: error: no user!");
      showDialog({
        title: t("Social login error"),
        message: t("No user found"),
        confirmText: t("Ok"),
        onConfirm: () => {
          navigate("/signup", { replace: true });
        },
      });
      navigate("/social-signin-error", { replace: true }); // redirect to home route
    }
    console.log("*** SocialSignInSuccess:", user);
    signIn(user);
    showSnackbar(t("Social sign in successful"), "success");
    navigate("/", { replace: true }); // redirect to home route
  }, [user, navigate, showDialog, showSnackbar, signIn, t]);
}

export default React.memo(SocialSignInSuccess);
