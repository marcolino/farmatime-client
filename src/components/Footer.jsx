import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";
//import DialogConfirm from "./DialogConfirm";
import SignalWifi3BarOutlinedIcon from "@mui/icons-material/SignalWifi3BarOutlined";
import SignalWifiBadOutlinedIcon from "@mui/icons-material/SignalWifiBadOutlined";
//import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { AuthContext } from "../providers/AuthContext";
import { useDialog } from "../providers/DialogContext";
import { OnlineStatusContext } from "../providers/OnlineStatusContext";
import { fetchBuildInfoData } from "../libs/Misc";
import { i18n, getNextSupportedLanguage }  from "../i18n";
import packageJson from "../../package.json";
import config from "../config";

const Footer = ({ changeLocale }) => {
  const { t } = useTranslation();
  const [buildInfo, setBuildInfo] = useState(null);
  const [languageFlag, setLanguageFlag] = useState(config.locales[i18n.language].flag);
  const { showDialog } = useDialog();
  // const [openDialog, setOpenDialog] = useState(false);
  // const [dialogTitle, setDialogTitle] = useState(null);
  // const [dialogContent, setDialogContent] = useState(null);
  // const [dialogCallback, setDialogCallback] = useState(null);
  const isOnline = useContext(OnlineStatusContext);
  const { auth, guest } = useContext(AuthContext);

  useEffect(() => { // read build info from file on disk
    if (import.meta.env.MODE === "test") return; // skip in vitest
    if (!buildInfo) {
      (async function () {
        const data = await fetchBuildInfoData();
        setBuildInfo(data);
      })();
    }
    // if (!buildInfo) {
    //   fetch("/build-info.json")
    //     .then((response) => response.json())
    //     .then((data) => {
    //       let d = new Date(data.buildTimestamp);
    //       data.buildDateTime = // convert timestamp to human readable compact date
    //         d.getFullYear() + "-" +
    //         ("00" + (d.getMonth() + 1)).slice(-2) + "-" +
    //         ("00" + d.getDate()).slice(-2) + " " +
    //         ("00" + d.getHours()).slice(-2) + ":" +
    //         ("00" + d.getMinutes()).slice(-2) + ":" +
    //         ("00" + d.getSeconds()).slice(-2)
    //         ;
    //       setBuildInfo(data);
    //       //console.log("data:", data);
    //     })
    //     .catch((error) => console.error("Failed to fetch build info:", error))
    //     ;
    // }
  }, []);

  useEffect(() => { // update language depending on user propertis change
    // get the current user's language preference or fall back to the default
    const userPreferences = auth.user?.preferences || guest.user?.preferences;
    const currentLanguage = userPreferences?.locale || i18n.language;
    
    // update the language flag
    setLanguageFlag(config.locales[currentLanguage]?.flag);

    i18n.changeLanguage(currentLanguage);
  }, [auth, guest]); // re-run when auth or guest state changes

  // const infoTitle = packageJson.name; 
  // const infoContents = `\
  //   v${packageJson.version} © ${new Date().getFullYear()}, \
  //   ${t("build n.")} ${buildInfo ? buildInfo.buildNumber : "?"} ${t("on date")} ${buildInfo ? buildInfo.buildDateTime : "?"}\
  // `;

  const networkTitle = packageJson.name; 
  const networkContents =
    <>{t("Network is")} {isOnline ? t("online") : t("offline")}</>
  ;

  const changeLanguage = () => {
    const newLanguage = getNextSupportedLanguage();
    i18n.changeLanguage(newLanguage);
    setLanguageFlag(config.locales[newLanguage].flag);
    changeLocale(i18n.language);

    // update index document language related attributes
    document.documentElement.setAttribute("lang", newLanguage);
    document.documentElement.setAttribute("dir", config.locales[newLanguage].dir);
    document.querySelector("meta[charset]").setAttribute("charset", config.locales[newLanguage].charset); 
  }
  
  // const handleOpenDialog = (title, content, callbackOnClose) => {
  //   setDialogTitle(title);
  //   setDialogContent(content);
  //   setDialogCallback(() => callbackOnClose);
  //   setOpenDialog(true);
  // };

  // const handleCloseDialog = () => {
  //   setOpenDialog(false);
  //   if (dialogCallback) {
  //     setDialogCallback(null);
  //     dialogCallback();
  //   }
  // };

  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        //bgColor: "transparent",
        bgColor: "rgba(255, 255, 255, 0.33)",
        opacity: 0.8,
        textAlign: "center",
        fontStyle: "italic",
        py: 1,
        userSelect: "none",
        zIndex: 1000
      }}>
      <Typography
        component="div"
        variant="body2"
        color="textSecondary"
        sx={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {/* app name, version and copyright */}
        <Box
          sx={{ lineHeight: 1, mr: 2 }}
        >
          {`
            ${packageJson.name.replace(/-.*$/, '')} v${packageJson.version}.${buildInfo ? buildInfo.buildNumber : "?"}
            © ${new Date().getFullYear()}
          `}
        </Box>

        {/* company name */}
        {/* <Link
          href="/"
          color="textSecondary"
          underline="hover"
          sx={{ cursor: "pointer", mr: 3 }}
        >
          &nbsp; {config.company.name}
        </Link> */}

        {/* app and build full info */}
        {/*<Box
          onClick={() => showDialog({
            title: infoTitle,
            message: infoContents,
            confirmText: t("Ok"),
          })}
          sx={{ mr: 1.5, cursor: "pointer" }}
        >
          <InfoOutlinedIcon sx={{ fontSize: 22, verticalAlign: "bottom", marginBottom: 0.3  }}/>
        </Box> */}
        
        {/* network connection indicator */}
        <Box
          onClick={() => showDialog({
            title: networkTitle,
            message: networkContents,
            confirmText: t("Ok"),
          })
        }
          sx={{ mr: 1.5, cursor: "pointer" }}
        >
          {isOnline ?
            <SignalWifi3BarOutlinedIcon sx={{ fontSize: 22, verticalAlign: "bottom", marginBottom: 0.4 }} /> :
            <SignalWifiBadOutlinedIcon sx={{ fontSize: 22, verticalAlign: "bottom", marginBottom: 0.4 }} />
          }
        </Box>

        {/* language / change language flag */}
        <Box
          onClick={changeLanguage}
          sx={{ mr: 1.5, fontSize: 20, verticalAlign: "bottom", cursor: "pointer" }}
        >
          {languageFlag}
        </Box>

      </Typography>

      {/* <DialogConfirm
        open={openDialog}
        onClose={handleCloseDialog}
        onCancel={handleCloseDialog}
        title={dialogTitle}
        message={dialogContent}
        cancelText={t("Close")}
      /> */}

      {/* <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialogTitle}
        </DialogTitle>
        <DialogContent id="alert-dialog-description">
          <Typography component={"span"} variant="body1" sx={{whiteSpace: "pre-line"}}>
            {dialogContent}
          </Typography>
        </DialogContent>
        {/* {!React.isValidElement(dialogContent) && ( // show buttons only if dialogContent is not a component * /}
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              fullWidth={false}
              autoFocus
            >
              {t("Ok")}
            </Button>
          </DialogActions>
        {/* )} * /}
      </Dialog> */}
      
    </Box>
  );
}

export default React.memo(Footer);
