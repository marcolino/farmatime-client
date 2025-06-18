import { createContext, useContext } from "react";

export const SnackbarContext = createContext(null);

export const useSnackbarContext = () => useContext(SnackbarContext);
