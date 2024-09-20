import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { toast } from "../Toast";
import config from "../../config";


function SocialSignInError() {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const params = new URLSearchParams(location.search);
  const stringifiedData = params.get("data");
  const error = JSON.parse(stringifiedData);

  // now error object contains all the data, with correct types
  console.log("+++++ SocialSignInError error:", error);
  
  useEffect(() => {
    toast.error(error.message); // TODO: check me!
    setAuth({ user: false }); // reset auth
    navigate("/", { replace: true }); // redirect to home route
  }, [error, navigate]);
}

export default React.memo(SocialSignInError);
