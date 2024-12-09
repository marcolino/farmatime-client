import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProviderWrapper } from "./providers/SnackbarProvider"; 
import ServiceWorkerProvider from "./providers/ServiceWorkerProvider";
import { AuthProvider, AuthContext } from "./providers/AuthProvider";
import { OnlineStatusProvider } from "./providers/OnlineStatusProvider";
import { LoaderProvider} from "./providers/LoaderProvider";
import SessionProvider from "./providers/SessionProvider";
import ServiceWorkerMessages from "./components/ServiceWorkerMessages";
import Contents from "./components/Contents";
import Routing from "./components/Routing";
import CookieConsent  from "./components/CookieConsent";
import BackgroundVideo from "./components/BackgroundVideo";
import ClientInfoDisplay from "./components/ClientInfoDisplay";
import Loader from "./components/Loader";
import { useAxiosLoader } from "./hooks/useAxiosLoader";
import { themeLight, themeDark } from "./themes/default";
import config from "./config";

/**
 * We need to separateg the logic into App and AppContent, because otherwise we access
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
  const [theme, setTheme] = useState(config.ui.defaultTheme === "light" ? themeLight : themeDark);

  useEffect(() => {
    if (preferences) {
      setTheme(preferences.theme === "light" ? themeLight : themeDark);
    }
  }, [preferences]);

  const themeToggle = () => {
    setTheme((prevTheme) => (prevTheme.palette.mode === "light" ? themeDark : themeLight));
    toggleTheme();
  };

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProviderWrapper>
        <ServiceWorkerMessages />
        <ServiceWorkerProvider>
          <OnlineStatusProvider>
            <CssBaseline />
            <CookieConsent />
            <LoaderProvider>
              <Loader loading={loading} />
              <Router future={{ /* avoid v7 start transition warnings */ 
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}>
                <BackgroundVideo />
                <SessionProvider />
                {config.mode.development && <ClientInfoDisplay theme={theme} />}                      
                <Contents theme={theme} changeLocale={changeLocale} toggleTheme={themeToggle}>
                  <Routing />
                </Contents>
              </Router>
            </LoaderProvider>
          </OnlineStatusProvider>
        </ServiceWorkerProvider>
      </SnackbarProviderWrapper>
    </ThemeProvider>
  );
};

export default App;
