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

  const updateLoadingState = useCallback((newCounter) => {
    // set loading state based on the counter
    if (newCounter > 0) {
      // set loading only if counter goes from 0 to 1
      if (counter === 0) {
        setLoading(true);
      }
    } else {
      // set loading to false when counter is 0
      setLoading(false);
    }
  }, [counter]);

  const inc = useCallback(() => {
    setCounter(prevCounter => {
      const newCounter = prevCounter + 1;
      clearTimer();

      timerRef.current = setTimeout(() => {
        // this timeout is just to introduce a delay if needed
      }, delayThreshold);

      updateLoadingState(newCounter); // Update loading state based on the new counter
      return newCounter;
    });
  }, [clearTimer, delayThreshold, updateLoadingState]);

  const dec = useCallback(() => {
    setCounter(prevCounter => {
      const newCounter = Math.max(0, prevCounter - 1); // ensure it doesn't go below 0
      updateLoadingState(newCounter); // update loading state based on the new counter
      return newCounter;
    });
  }, [updateLoadingState]);

  const interceptors = useMemo(() => ({
    request: config => {
      console.log("🚀 Loader interceptor attached");
      inc();
      return config;
    },
    response: response => {
      dec();
      return response;
    },
    error: error => {
      dec();
      if (error?.response?.status === 401) {
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
