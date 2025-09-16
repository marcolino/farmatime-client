import { createContext, useContext } from "react";

export const MediaQueryContext = createContext();

export const useMediaQueryContext = () => {
  const context = useContext(MediaQueryContext);
  if (!context) {
    throw new Error("useMediaQueryContext must be used within a MediaQueryProvider");
  }
  return context;
};