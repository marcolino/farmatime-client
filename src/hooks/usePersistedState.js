import React, { useEffect } from "react";
//import Cookies from "universal-cookie";
//import Cookies from "js-cookie";
import Cookie from "../libs/Cookie";

//const cookies = new Cookies();
const path = "/"; // use always the same path, to have only one cookie per key

export const usePersistedState = (key, defaultValue) => {
  const [state, setState] = React.useState(
    () => Cookie.get(key, { path }) || defaultValue
  );
  const options = {};
  options.path = path;
  options.secure = true;
  options.expires = 400; // set maximum expiration days in future, 400 days
  //options.expire = null; // we set expire to null, this should force cookies to expires when session ends (if browser is not set to behave differently)
  useEffect(() => {
    Cookie.set(key, JSON.stringify(state), options);
  }, [key, state]);
  return [state, setState];
};
