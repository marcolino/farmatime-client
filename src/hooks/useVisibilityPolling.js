import { useEffect, useRef, useCallback } from "react";

/**
 * useVisibilityPolling(callback, interval)
 *
 * Starts polling when the window/tab is focused or visible,
 * and stops when the tab loses focus or becomes hidden.
 *
 * @param {Function} callback - async or sync function to call periodically
 * @param {number} interval - delay in ms (default 60000 = 1 min)
 */
export function useVisibilityPolling(callback, interval = 60 * 1000) { // TODO: move to config
  const intervalRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log("@@@ Polling stopped 🛑"); // TODO: DEBUG ONLY
    }
  }, []);

  // const startPolling = useCallback(() => {
  //   if (!intervalRef.current) {
  //     callback(); // run immediately once
  //     intervalRef.current = setInterval(callback, interval);
  //     console.log("@@@ Polling started ✅"); // TODO: DEBUG ONLY
  //   }
  // }, [callback, interval]);

  const startPolling = useCallback(() => {
    if (!intervalRef.current) {
      const run = async () => {
        try {
          await callback();
        } catch (err) {
          console.error("Polling error:", err);
        }
      };
      run(); // run immediately
      intervalRef.current = setInterval(run, interval);
      console.log("@@@ Polling started ✅"); // TODO: DEBUG ONLY
    }
  }, [callback, interval]);
  
  useEffect(() => {
    console.log("***** useEffect re-run");
    const handleFocus = () => startPolling();
    const handleBlur = () => stopPolling();
    const handleVisibility = () => {
      if (document.visibilityState === "visible") startPolling();
      else stopPolling();
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibility);

    // Start immediately if page already visible/focused
    if (document.visibilityState === "visible") startPolling();

    return () => {
      stopPolling();
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [startPolling, stopPolling]);
}

