import { useContext } from "react";
import { SnackbarContext } from "../providers/SnackbarContext";

export const useSnackbarContext = () => useContext(SnackbarContext);
