//import { /*createContext, */useContext } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { MediaQueryContext } from "./MediaQueryContext";

//const MediaQueryContext = createContext();

export const MediaQueryProvider = ({ children }) => {
  const theme = useTheme();

  const xs = useMediaQuery(theme.breakpoints.down("sm"));
  const sm = useMediaQuery(theme.breakpoints.down("md"));
  const md = useMediaQuery(theme.breakpoints.down("lg"));
  const lg = useMediaQuery(theme.breakpoints.down("xl"));
  const xl = useMediaQuery(theme.breakpoints.up("xl"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <MediaQueryContext.Provider value={{ xs, sm, md, lg, xl, isMobile, isTablet, isDesktop }}>
      {children}
    </MediaQueryContext.Provider>
  );
};

