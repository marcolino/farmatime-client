import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar }  from "notistack";
import { AuthContext } from "../../providers/AuthProvider";
//import { useSnackbar }  from "../../providers/SnackbarManager";
//import config from "../../config";


function SocialSignInError() {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();

  const params = new URLSearchParams(location.search);
  const stringifiedData = params.get("data");
  const error = JSON.parse(stringifiedData);

  // now error object contains all the data, with correct types
  console.error("SocialSignInError error:", error);
  
  useEffect(() => {
    showSnackbar(error.message, "error");
    setAuth({ user: false }); // reset auth
    navigate("/", { replace: true }); // redirect to home route
  }, [error, navigate]);
}

export default React.memo(SocialSignInError);
