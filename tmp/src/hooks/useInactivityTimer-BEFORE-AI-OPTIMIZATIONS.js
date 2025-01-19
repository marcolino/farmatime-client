import { useState, useEffect } from "react";
import config from "../config";

const useInactivityTimer = (isLoggedIn, timeout, onTimeout, resetTrigger) => {
  const [lastActivity, setLastActivity] = useState(null);

  console.log("+++ useInactivityTimer - starting, isLoggedIn:", isLoggedIn, "timeout:", timeout, "ms, onTimeout:", typeof onTimeout);
  // useEffect(() => {
  //   console.log(`useInactivityTimer - called with ${timeout / 1000} seconds timeout`);
  // }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setLastActivity(null); // reset timer when logged out
      //console.log(`useInactivityTimer - !isLoggedIn, resetting last activity`);
      return;
    }

    const handleActivity = () => {
      setLastActivity(Date.now());
      console.log("+++ useInactivityTimer - setLastActivity:", Date.now());
      //console.log(`${new Date().toString()} useInactivityTimer - setLastActivity to now`);
    }

    const events = ["mousemove", "keydown", "click"];
    events.forEach(event => window.addEventListener(event, handleActivity));

    if (lastActivity === null) {
      setLastActivity(Date.now()); // initialize timer after login
    }

    const interval = setInterval(() => {
      console.log("+++ useInactivityTimer - lastActivity:", lastActivity, "elapsed:", Date.now() - lastActivity, ", timeout:", timeout);
      //console.log(`useInactivityTimer - inside setInterval - seconds of inactivity: ${parseInt((Date.now() - lastActivity) / 1000)}`);
      if (lastActivity && Date.now() - lastActivity > timeout) {
        //console.log(`${new Date().toString()} useInactivityTimer - no activity for ${parseInt((Date.now() - lastActivity) / 1000)} seconds, stop waiting, calling onTimeout()`);
        clearInterval(interval);
        onTimeout();
      }
      //else console.log(`${new Date().toString()} useInactivityTimer - no activity for ${parseInt((Date.now() - lastActivity) / 1000)} seconds, still waiting until ${timeout / 1000} inactivity seconds reached...`);
    }, config.auth.clientLastActivityCheckTimeoutSeconds * 1000);

    //console.log(`useInactivityTimer - setInterval:`, config.auth.clientLastActivityCheckTimeoutSeconds);

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      clearInterval(interval);
    };
  }, [isLoggedIn, lastActivity, timeout, onTimeout, resetTrigger]);

  return lastActivity;
};

export default useInactivityTimer;
