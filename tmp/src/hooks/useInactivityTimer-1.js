import { useState, useEffect } from "react";

const useInactivityTimer = (isLoggedIn, timeout, onTimeout) => {
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    if (!isLoggedIn) return; // TODO...
    const handleActivity = () => setLastActivity(Date.now());

    const events = ["mousemove", "keydown", "click"];
    events.forEach(event => window.addEventListener(event, handleActivity));

    const interval = setInterval(() => {
      if (Date.now() - lastActivity > timeout) {
        onTimeout();
      }
    }, 1000);

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      clearInterval(interval);
    };
  }, [lastActivity, timeout, onTimeout]);
  
  return lastActivity;
};

export default useInactivityTimer;
