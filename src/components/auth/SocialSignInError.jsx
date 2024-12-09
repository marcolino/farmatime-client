import React, { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbarContext } from "../../providers/SnackbarProvider"; 
import { AuthContext } from "../../providers/AuthProvider";


function SocialSignInError() {
  const navigate = useNavigate();
  const location = useLocation();
  const { /*setAuth*/signIn } = useContext(AuthContext);
  const { showSnackbar } = useSnackbarContext();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (error) {
      showSnackbar(`Social login did not work, sorry.\n${errorDescription}\nError: ${error}`, "error");
      signIn(null); // reset auth
      //setAuth({ user: null }); // reset auth if needed
      navigate("/", { replace: true }); // redirect to home
    }
  }, [location, showSnackbar, /*setAuth, */signIn, navigate]);
  
  return null;
}

export default React.memo(SocialSignInError);
