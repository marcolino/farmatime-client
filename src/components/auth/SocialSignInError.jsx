import React, { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDialog } from "../../providers/DialogProvider";
//import { useSnackbarContext } from "../../providers/SnackbarProvider"; 
import { AuthContext } from "../../providers/AuthProvider";


function SocialSignInError() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useContext(AuthContext);
  const { showDialog } = useDialog();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (error) {
      showDialog({
        title: t("Social login did not work, sorry"),
        message: errorDescription + ".\n" + error + ".",
        confirmText: t("Ok"),
        onConfirm: () => {
          navigate(`/signup/true/${codeDeliveryMedium}`, { replace: true }); // navigate to signup screen in "waitingForCode" mode
        },
      });
      signIn(null); // reset auth
      navigate("/", { replace: true }); // redirect to home
    }
  }, [location, showSnackbar, /*setAuth, */signIn, navigate]);
  
  return null;
}

export default React.memo(SocialSignInError);
