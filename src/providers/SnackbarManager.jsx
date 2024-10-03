import React, { useRef, useCallback, createContext, useContext } from "react";
import { SnackbarProvider } from "notistack";
import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import config from "../config";

const SnackbarContext = createContext();

const useSnackbarContext = () => {
  return useContext(SnackbarContext);
};

const useImperativeSnackbar = () => {
  const { showSnackbar } = useSnackbarContext();
  return showSnackbar;
};

let showGlobalSnackbar; // this will be exposed globally

const SnackbarProviderWrapper = ({ children }) => {
  const snackbarRef = useRef(null);

  const dismissAction = (key) => (
    <Button onClick={() => snackbarRef.current.closeSnackbar(key)} color="secondary">
      <CloseIcon sx={{fontSize: config.ui.snacks.closeIcon.fontSize}} />
    </Button>
  );

  const showSnackbar = useCallback((message, variant = "default", action = dismissAction) => {
    if (snackbarRef.current) {
      snackbarRef.current.enqueueSnackbar(message, {
        variant,
        action: (key) => (
          <>
            {action && action(key)}
          </>
        ),
        autoHideDuration: config.ui.snacks.autoHideDurationSeconds * 1000,
        style: {
          fontSize: config.ui.snacks.style.fontSize,
          whiteSpace: config.ui.snacks.style.whiteSpace
        },
      });
    }
  }, []);
  
  // assign the callback to a global reference
  showGlobalSnackbar = showSnackbar;

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      <SnackbarProvider
        maxSnack={config.ui.snacks.maxInStack} 
        anchorOrigin={{
          vertical: config.ui.snacks.anchorOrigin.vertical,
          horizontal: config.ui.snacks.anchorOrigin.horizontal,
        }}
        ref={snackbarRef}
      >
        {children}
      </SnackbarProvider>
    </SnackbarContext.Provider>
  );
};

export { showGlobalSnackbar, useSnackbarContext, useImperativeSnackbar as useSnackbar };
export default SnackbarProviderWrapper;
