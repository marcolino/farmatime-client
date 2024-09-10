import React, { useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import { BrowserRouter, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
//import { useTranslation } from "react-i18next";
import { AuthProvider } from "../providers/AuthProvider";
import { ServiceProvider } from "../providers/ServiceProvider";
import { OnlineStatusProvider, OnlineStatusContext } from "../providers/OnlineStatusProvider";
import Banner from "./Banner";
import ClientInfoDisplay from "./ClientInfoDisplay";
import Header from "./Header";
import Routes from "./Routes";
import Footer from "./Footer";
import Loader from "./Loader";
import CookieBanner from "./CookieBanner";
import { ToastContainer, toast } from "./Toast";
// import PushNotifications from "../components/PushNotifications";
// import FloatingActionButton from "./FloatingActionButton";
import { isAuthLocation } from "../libs/Misc";
import theme from "../themes/default"; // here we choose the theme
import config from "../config";

function App() {
  
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <OnlineStatusProvider>
          <ServiceProvider>
            <CssBaseline />
            <BrowserRouter>
              {config.mode.development && <Banner text="development" />}
              {config.mode.development && <ClientInfoDisplay />}
              <Loader />
              <Contents />
              <CookieBanner />
              {/* <FloatingActionButton/> */}
            </BrowserRouter>
            {/* <PushNotifications /> */}
          </ServiceProvider>
        </OnlineStatusProvider>
      </AuthProvider>
      <ToastContainer />
    </ThemeProvider>
  );
}


const useStyles = makeStyles(theme => ({
  contentsContainer: {
    position: "relative",
    minHeight: "100vh",
  },
  contentsWrap: props => ({
    paddingBottom: props.footerHeight,
  }),
  header: {
  },
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "left",
    padding: theme.spacing(2),
  },
  footer: props => ({
    position: "absolute",
    bottom: "0.5rem",
    width: "100%",
    height: props.footerHeight,
  }),
}));

const Contents = () => {
  const location = useLocation();
  const isOnline = useContext(OnlineStatusContext);
	const classes = useStyles({footerHeight: isAuthLocation(location) ? 0 : config.ui.footerHeight }); // hide footer while in auth screens

  return (
    <div className={classes.contentsContainer}>
      <div className={classes.contentsWrap}>
        <div className={classes.header}>
          <Header />
        </div>
        <div className={classes.body}>
          <Routes />
        </div>
      </div>
      <div className={classes.footer}>
        <Footer isOnline={isOnline} />
      </div>
    </div>
  );
}

export default App;