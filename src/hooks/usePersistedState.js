import React, { useEffect } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const path = "/"; // use always the same path, to have only one cookie per key
export const usePersistedState = (key, defaultValue) => {
  const [state, setState] = React.useState(
    () => cookies.get(key, { path }) || defaultValue
  );
  useEffect(() => {
    cookies.set(key, JSON.stringify(state), { path });
  }, [key, state]);
  return [state, setState];
};
