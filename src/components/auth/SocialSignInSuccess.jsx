import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";


function SocialSignInSuccess() {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const params = new URLSearchParams(location.search);
  const stringifiedData = params.get("data");
  const user = JSON.parse(stringifiedData);

  // now user object contains all the data, with correct types
  console.log("+++++ user:", user);
  
  useEffect(() => {
    if (user.accessToken && user.refreshToken) {
      console.log("*** SETAUTH {user}:", user);
      setAuth({ user }); // set auth user
      navigate("/", { replaace: true }); // redirect to home route
    }
  }, [user, navigate]);
}

export default React.memo(SocialSignInSuccess);
