import React, { useEffect } from "react";
//import Cookie from "../libs/Cookie";
import LocalStorage from "../libs/LocalStorage";

//const path = "/"; // use always the same path, to have only one cookie per key

export const usePersistedState = (key, defaultValue) => {
  const [state, setState] = React.useState(
    () => LocalStorage.get(key/*, { path }*/) || defaultValue
  );
  // const options = {};
  // options.path = path;
  // options.secure = true;
  // options.expires = 400; // set maximum expiration days in future, 400 days
  useEffect(() => {
    LocalStorage.set(key, state/*, options*/);
  }, [key, state]);
  return [state, setState];
};
