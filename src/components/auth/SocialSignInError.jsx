import React, { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDialog } from "../../providers/DialogContext";
import { AuthContext } from "../../providers/AuthContext";


function SocialSignInError() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const { signIn } = useContext(AuthContext);
  const { showDialog } = useDialog();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    //const error = params.get("error");
    const data = params.get("data");
    let errorMessage = "";
    if (data) {
      let error = JSON.parse(data);
      errorMessage = error.message;
    }
    console.log("DATA:", data, typeof data);
    console.log("errorMessage:", errorMessage, typeof errorMessage);
    //const errorDescription = params.get("error_description");

    if (errorMessage) {
      showDialog({
        title: t("Social login did not work, sorry"),
        message: errorMessage,
        confirmText: t("Ok"),
        onConfirm: () => {
          navigate("/signup", { replace: true });
        },
      });
      signIn(null); // reset auth
      navigate("/", { replace: true }); // redirect to home
    }
  }, [location, navigate, showDialog, signIn, t]);
  
  return null;
}

export default React.memo(SocialSignInError);
