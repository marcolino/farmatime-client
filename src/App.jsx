import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProviderWrapper } from "./providers/SnackbarProvider"; 
import ServiceWorkerProvider from "./providers/ServiceWorkerProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { OnlineStatusProvider } from "./providers/OnlineStatusProvider";
import { LoaderProvider} from "./providers/LoaderProvider";
import SessionProvider from "./providers/SessionProvider";
import ServiceWorkerMessages from "./components/ServiceWorkerMessages";
import Contents from "./components/Contents";
import Routing from "./components/Routing";
import CookieConsent  from "./components/CookieConsent";
//import MaintenanceCheck from "./components/MaintenanceCheck";
import BackgroundVideo from "./components/BackgroundVideo";
import ClientInfoDisplay from "./components/ClientInfoDisplay";
import Loader from "./components/Loader";
import { useAxiosLoader } from "./hooks/useAxiosLoader";
import { themeLight, themeDark } from "./themes/default";
import config from "./config";


const App = () => {
  const [loading] = useAxiosLoader();
  const [theme, setTheme] = useState(config.ui.themeMode === "light" ? themeLight : themeDark);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme.palette.mode === "light" ? themeDark : themeLight));
  };

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        {/* <MaintenanceCheck /> */}
        <SnackbarProviderWrapper>
          <ServiceWorkerMessages />
          {/* <ServiceWorkerProvider> */}
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
                  <Contents theme={theme} toggleTheme={toggleTheme}>
                    <Routing />
                  </Contents>
                </Router>
              </LoaderProvider>
            </OnlineStatusProvider>
          {/* </ServiceWorkerProvider> */}
        </SnackbarProviderWrapper>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
