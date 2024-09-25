import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import instance from "../middlewares/Interceptors";
import config from "../config";

export const useAxiosLoader = (delayThreshold = config.spinner.delay, setDisabled) => {
  const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const inc = useCallback(() => {
    setCounter(prevCounter => {
      const newCounter = prevCounter + 1;
      //console.log("Request started. Counter:", newCounter);
      return newCounter;
    });

    clearTimer();

    timerRef.current = setTimeout(() => {
      setLoading(true);
      //console.log("Loading set to true after delay");
    }, delayThreshold);
  }, [delayThreshold, clearTimer]);

  const dec = useCallback(() => {
    setCounter(prevCounter => {
      const newCounter = prevCounter - 1;
      //console.log("Request finished. Counter:", newCounter);

      if (newCounter === 0) {
        clearTimer();
        setLoading(false);
        //console.log("All requests finished. Loading set to false");
      }

      return newCounter;
    });
  }, [clearTimer]);

  const interceptors = useMemo(() => ({
    request: config => (inc(), config),
    response: response => (dec(), response),
    error: error => (dec(), Promise.reject(error)),
  }), [inc, dec]);

  useEffect(() => {
    const reqInterceptor = instance.interceptors.request.use(interceptors.request, interceptors.error);
    const resInterceptor = instance.interceptors.response.use(interceptors.response, interceptors.error);
    return () => {
      instance.interceptors.request.eject(reqInterceptor);
      instance.interceptors.response.eject(resInterceptor);
      clearTimer();
    };
  }, [interceptors, clearTimer]);

  return [loading];
};