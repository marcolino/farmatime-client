import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
//import SnackbarProviderWrapper from "./providers/SnackbarManager";
//import SnackbarProvider from "./providers/SnackbarProvider";
import { SnackbarProviderWrapper } from "./providers/SnackbarProvider"; 
import ServiceWorkerProvider from "./providers/ServiceWorkerProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { OnlineStatusProvider } from "./providers/OnlineStatusProvider";
import { LoaderProvider} from "./providers/LoaderProvider";
import SessionProvider from "./providers/SessionProvider";
import Contents from "./components/Contents";
import Routing from "./components/Routing";
import CookieBanner from "./components/CookieBanner";
import MaintenanceCheck from "./components/MaintenanceCheck";
import Banner from "./components/Banner";
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

  const handleLogout = () => {
    console.log("user logged out due to inactivity");
    window.location.href = "/";
  };

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <SnackbarProviderWrapper>
          <LoaderProvider>
            <Loader loading={loading} />
                <Router>
                  {/* <SessionProvider onLogout={handleLogout} /> */}
                  <Contents theme={theme} toggleTheme={toggleTheme}>
                    <Routing />
                  </Contents>
            </Router>
          </LoaderProvider>
        </SnackbarProviderWrapper>
      </AuthProvider>
    </ThemeProvider>
  );

}

export default App;
