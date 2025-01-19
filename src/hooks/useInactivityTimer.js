import { useState, useEffect } from "react";

const useInactivityTimer = (isLoggedIn, timeout, onTimeout, resetTrigger) => {
  const [lastActivity, setLastActivity] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setLastActivity(null); // Reset timer when logged out
      return;
    }

    const handleActivity = () => setLastActivity(Date.now());

    // add event listeners for user activity
    const events = ["mousemove", "keydown", "click"];
    events.forEach((event) => window.addEventListener(event, handleActivity));

    // initialize `lastActivity` if not set
    if (lastActivity === null) {
      setLastActivity(Date.now());
    }

    const checkInactivity = () => {
      if (lastActivity && Date.now() - lastActivity > timeout) {
        onTimeout(); // trigger timeout action
      }
    };

    // set up interval to check for inactivity
    const interval = setInterval(checkInactivity, 1000); // Check every second

    return () => {
      // cleanup event listeners and interval on unmount
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      clearInterval(interval);
    };
  }, [isLoggedIn, lastActivity, timeout, onTimeout, resetTrigger]);

  return lastActivity;
};

export default useInactivityTimer;
