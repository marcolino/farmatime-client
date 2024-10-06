import React, { useState, useEffect, createContext } from "react";
import { useSnackbarContext } from "./SnackbarProvider";

const OnlineStatusContext = createContext(true);

const OnlineStatusProvider = (props) => {
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);
  const { showSnackbar } = useSnackbarContext();
  
  // event handler functions defined outside useEffect to prevent double listeners
  const handleOffline = () => {
    console.log("You are offline");
    showSnackbar("You are offline", "warning"); // pass variant as a separate argument
    setOnlineStatus(false);
  };

  const handleOnline = () => {
    console.log("You are online");
    showSnackbar("You are online", "success"); // pass variant as a separate argument
    setOnlineStatus(true);
  };

  useEffect(() => {
    // attach event listeners
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // clean up event listeners on unmount
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <OnlineStatusContext.Provider value={onlineStatus}>
      {props.children}
    </OnlineStatusContext.Provider>
  );
};

export { OnlineStatusProvider, OnlineStatusContext };
