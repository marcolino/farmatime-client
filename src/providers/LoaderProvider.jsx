import { /*createContext,*/ useState, /*useContext, */useCallback, useEffect } from "react";
//import { setDisableLoaderHandler } from "./LoaderState";
import { LoaderContext, setDisableLoaderHandler } from "./LoaderContext";

//const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [disableLoader, setDisableLoader] = useState(false);

  const disableLoaderHandler = useCallback((value) => {
    setDisableLoader(value);
  }, []);

  useEffect(() => {
    setDisableLoaderHandler(disableLoaderHandler); // set the global loader handler on mount
  }, [disableLoaderHandler]);

  return (
    <LoaderContext.Provider value={{ disableLoader, disableLoaderHandler }}>
      {children}
    </LoaderContext.Provider>
  );
};
