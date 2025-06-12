import { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
//import { SecureStorage } from './libs/SecureStorage';
import { SnackbarProviderWrapper } from "./providers/SnackbarProvider"; 
import ServiceWorkerProvider from "./providers/ServiceWorkerProvider";
import { DialogProvider } from "./providers/DialogProvider";
import { AuthProvider, AuthContext } from "./providers/AuthProvider";
import { CartProvider } from "./providers/CartProvider";
import { OnlineStatusProvider } from "./providers/OnlineStatusProvider";
import { LoaderProvider} from "./providers/LoaderProvider";
import SessionProvider from "./providers/SessionProvider";
import { MediaQueryProvider } from "./providers/MediaQueryProvider";
import SessionExpirationHandler from "./components/SessionExpirationHandler";
import ServiceWorkerMessages from "./components/ServiceWorkerMessages";
import Contents from "./components/Contents";
import Routing from "./components/Routing";
import CookiePreferences  from "./components/CookiePreferences";
//import BackgroundVideo from "./components/BackgroundVideo";
import ClientInfoDisplay from "./components/ClientInfoDisplay";
import Loader from "./components/Loader";
import { useAxiosLoader } from "./hooks/useAxiosLoader";
//import { themeLight, themeDark } from "./themes/default";
import { useResponsiveTheme } from "./themes/default";
import config from "./config";

/**
 * We need to separate the logic into App and AppStructure, because otherwise we access
 * AuthContext (preferences and toggleTheme) before AuthContext from AuthProvider was setup
 */
const App = () => {
  return (
    <AuthProvider>
      <AppStructure />
    </AuthProvider>
  );
};

const AppStructure = () => {
  const [loading] = useAxiosLoader();
  const { preferences, changeLocale, toggleTheme } = useContext(AuthContext);
  //const [_secureStorageReady, setSecureStorageReady] = useState(false);
  //const [theme, setTheme] = useState(config.ui.defaultTheme === "light" ? themeLight : themeDark);
  //const theme = useResponsiveTheme(config.ui.defaultTheme === "dark");
  const [isDarkMode, setIsDarkMode] = useState(config.ui.defaultTheme !== "light");
  
  // Get the responsive theme based on current mode and screen size
  const theme = useResponsiveTheme(isDarkMode);

  // Function to set theme
  const setTheme = (themeName) => {
    setIsDarkMode(themeName === "dark");
  };
  
  useEffect(() => {
    if (preferences && preferences.theme) {
      setTheme(preferences.theme);
    }
  }, [preferences]);

  // useEffect(() => {
  //   const secureStorage = new SecureStorage();
  //   secureStorage.init().then(() => {
  //     console.log(1);
  //     //setSecureStorageReady(true);
  //     //return secureStorage.get('userPreferences');
  //   });//.then(_data => {
  //   //  console.log(2);
  //   //  //setPreferences(data || { theme: 'light' });
  //   //});
  // }, []);

  const themeToggle = () => {
    setTheme((prevTheme) => (prevTheme.palette.mode));
    toggleTheme();
  };

  // if (!secureStorageReady) {
  //   console.log("NULL");
  //   return null;
  //   //return <div>Initializing secure storage...</div>;
  // }
  
  return (
    <ThemeProvider theme={theme}>
      <CartProvider>
        <DialogProvider>
          <SnackbarProviderWrapper>
            <ServiceWorkerMessages />
            <ServiceWorkerProvider>
              <OnlineStatusProvider>
                <MediaQueryProvider>
                  <CssBaseline />
                  <LoaderProvider>
                    <Loader loading={loading} />
                    <Router future={{ /* avoid v7 start transition warnings */ 
                      v7_startTransition: true,
                      v7_relativeSplatPath: true,
                    }}>
                      <SessionExpirationHandler>
                        {/* <BackgroundVideo /> */}
                        <SessionProvider />
                        <CookiePreferences />
                        {config.mode.development && <ClientInfoDisplay theme={theme} />}                      
                        <Contents theme={theme} changeLocale={changeLocale} toggleTheme={themeToggle}>
                          <Routing />
                        </Contents>
                      </SessionExpirationHandler>
                    </Router>
                  </LoaderProvider>
                </MediaQueryProvider>
              </OnlineStatusProvider>
            </ServiceWorkerProvider>
          </SnackbarProviderWrapper>
        </DialogProvider>
      </CartProvider>
    </ThemeProvider>
  );
};

export default App;
