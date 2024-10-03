import React, { useRef, useCallback } from "react";
import { SnackbarProvider } from "notistack";

export const SnackbarContext = React.createContext();

const SnackbarProviderWrapper = ({ children }) => {
  const snackbarRef = useRef(null);

  const showSnackbar = useCallback((message, options = {}) => {
    if (snackbarRef.current) {
      snackbarRef.current.enqueueSnackbar(message, options);
    }
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      <SnackbarProvider maxSnack={3} ref={snackbarRef}>
        {children}
      </SnackbarProvider>
    </SnackbarContext.Provider>
  );
};

export default SnackbarProviderWrapper;
