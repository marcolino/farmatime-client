import React, { useState, useEffect, createContext } from "react";
import { useSnackbarContext } from "./SnackbarManager";

const OnlineStatusContext = createContext(true);

const OnlineStatusProvider = (props) => {
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);
  const { showSnackbar } = useSnackbarContext();

  useEffect(() => {
    window.addEventListener("offline", () => {
      console.log("You are offline");
      showSnackbar("You are offline", "warning");
      setOnlineStatus(false)
    });
    window.addEventListener("online", () => {
      console.log("You are online");
      showSnackbar("You are online", "success");
      setOnlineStatus(true)
    });
    return () => {
      window.removeEventListener("offline", () => setOnlineStatus(false));
      window.removeEventListener("online", () => setOnlineStatus(true));
    };
  }, []);

  return (
    <OnlineStatusContext.Provider value={onlineStatus}>
      {props.children}
    </OnlineStatusContext.Provider>
  );
};

export { OnlineStatusProvider, OnlineStatusContext };
