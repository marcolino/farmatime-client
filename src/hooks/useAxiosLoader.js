import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import instance from "../middlewares/Interceptors";
import config from "../config";

export const useAxiosLoader = (delayThreshold = config.spinner.delay, setDisableLoader = () => {}) => {
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
      return newCounter;
    });

    clearTimer();

    timerRef.current = setTimeout(() => {
      setLoading(true);
    }, delayThreshold);
  }, [delayThreshold, clearTimer]);

  const dec = useCallback(() => {
    setCounter(prevCounter => {
      const newCounter = prevCounter - 1;

      if (newCounter === 0) {
        clearTimer();
        setLoading(false);
      }

      return newCounter;
    });
  }, [clearTimer]);

  const interceptors = useMemo(() => ({
    request: config => (inc(), config),
    response: response => (dec(), response),
    error: error => {
      dec();
      // check if it's a redirection scenario
      if (error.response?.status === 401) {
        // disable the loader before starting the redirect timeout
        setDisableLoader(true);
      }
      return Promise.reject(error);
    },
  }), [inc, dec, setDisableLoader]);

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
