import { useState, useEffect } from "react";

const useInactivityTimer = (enabled, timeout, onTimeout, resetTrigger) => {
  const [lastActivity, setLastActivity] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setLastActivity(null); // Reset timer when logged out
      return;
    }
    if (!timeout) { // Ignore timer if timeout os not set
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
  }, [enabled, timeout, onTimeout, resetTrigger, lastActivity]);

  return lastActivity;
};

export default useInactivityTimer;
