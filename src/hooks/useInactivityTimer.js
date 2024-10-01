import { useState, useEffect } from "react";
import config from "../config";

const useInactivityTimer = (isLoggedIn, timeout, onTimeout) => {
  const [lastActivity, setLastActivity] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setLastActivity(null); // reset timer when logged out
      return;
    }

    const handleActivity = () => setLastActivity(Date.now());

    const events = ["mousemove", "keydown", "click"];
    events.forEach(event => window.addEventListener(event, handleActivity));

    if (lastActivity === null) {
      setLastActivity(Date.now()); // initialize timer after login
    }

    const interval = setInterval(() => {
      if (lastActivity && Date.now() - lastActivity > timeout) {
        onTimeout();
      }
    }, config.auth.clientLastActivityCheckTimeoutSeconds * 1000);

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      clearInterval(interval);
    };
  }, [isLoggedIn, lastActivity, timeout, onTimeout]);

  return lastActivity;
};

export default useInactivityTimer;
