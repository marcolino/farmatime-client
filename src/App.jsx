import { useState, useEffect, useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { HelpProvider } from "./providers/HelpProvider";
import { SnackbarProviderWrapper } from "./providers/SnackbarProvider"; 
import ServiceWorkerProvider from "./providers/ServiceWorkerProvider";
import { DialogProvider } from "./providers/DialogProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { AuthContext } from "./providers/AuthContext";
import { CartProvider } from "./providers/CartProvider";
import { OnlineStatusProvider } from "./providers/OnlineStatusProvider";
import { LoaderProvider} from "./providers/LoaderProvider";
import { JobProvider } from "./providers/JobProvider"; 
import { MediaQueryProvider } from "./providers/MediaQueryProvider";
import SessionExpirationHandler from "./components/SessionExpirationHandler";
import InstallPWA from "./components/InstallPWA";
import ServiceWorkerMessages from "./components/ServiceWorkerMessages";
import Contents from "./components/Contents";
import Routing from "./components/Routing";
import PreferencesCookie  from "./components/PreferencesCookie";
//import BackgroundVideo from "./components/BackgroundVideo";
import ClientInfoDisplay from "./components/ClientInfoDisplay";
import HelpVideoDialog from "./components/HelpVideoDialog";
import FloatingBellHelp from "./components/FloatingBellHelp";
import Loader from "./components/Loader";
import { useAxiosLoader } from "./hooks/useAxiosLoader";
import { useResponsiveTheme } from "./themes/default";
import config from "./config";

const isPWA = window.location.pathname.startsWith("/pwa");


/**
 * We need to separate the logic into App and AppStructure, because otherwise we access
 * AuthContext (preferences and toggleTheme) before AuthContext from AuthProvider was setup
 */
const App = () => {
  return (
    <BrowserRouter
      basename={isPWA ? "/pwa" : "/"} // differentiate basename to be able to handle oAuth2 for both web and PWA
      future={{ // avoid v7 start transition warnings
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <SnackbarProviderWrapper>
        <AuthProvider>
          <AppStructure />
        </AuthProvider>
      </SnackbarProviderWrapper>
    </BrowserRouter>
  );
};

const AppStructure = () => {
  const [loading] = useAxiosLoader();
  const { preferences, changeLocale, toggleTheme } = useContext(AuthContext);
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

  const themeToggle = () => {
    //setTheme((prevTheme) => (prevTheme.palette.mode));
    toggleTheme();
  };

  return (
    <ThemeProvider theme={theme}>
      <HelpProvider>
        <HelpVideoDialog /> 
        <CartProvider>
          <MediaQueryProvider>
            <DialogProvider>
              <ServiceWorkerMessages />
              <ServiceWorkerProvider>
                <OnlineStatusProvider>
                  <CssBaseline />
                  <LoaderProvider>
                    <Loader loading={loading} />
                    <SessionExpirationHandler> 
                      {/* <BackgroundVideo /> */}
                      <JobProvider>
                        <InstallPWA />
                        <PreferencesCookie />
                        {config.mode.development && <ClientInfoDisplay theme={theme} />}                      
                        <Contents theme={theme} changeLocale={changeLocale} toggleTheme={themeToggle}>
                          <Routing />
                          <FloatingBellHelp />
                        </Contents>
                      </JobProvider>
                    </SessionExpirationHandler>
                  </LoaderProvider>
                </OnlineStatusProvider>
              </ServiceWorkerProvider>
            </DialogProvider>
          </MediaQueryProvider>
        </CartProvider>
      </HelpProvider>
    </ThemeProvider>
  );
};

export default App;
