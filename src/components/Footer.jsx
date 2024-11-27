import React, { useState, useEffect, useContext } from "react";
import { Box, Link, Typography } from "@mui/material";
import Button from "./custom/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import SignalWifi3BarOutlinedIcon from "@mui/icons-material/SignalWifi3BarOutlined";
// import SignalWifi3BarOutlinedIcon from '@mui/icons-material/SignalWifi3BarOutlined';

import SignalWifiBadOutlinedIcon from "@mui/icons-material/SignalWifiBadOutlined";
//import SignalWifiConnectedNoInternet4OutlinedIcon from "@mui/icons-material/SignalWifiConnectedNoInternet4Outlined";

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useTranslation } from "react-i18next";
import { OnlineStatusContext } from "../providers/OnlineStatusProvider";
import { i18n }  from "../i18n";
import packageJson from "../../package.json";
import config from "../config";

const Footer = () => {
  const { t } = useTranslation();
  const [buildInfo, setBuildInfo] = useState(null);
  const languageFlag = config.i18n.languages.supported[i18n.language.slice(0, 2).toLowerCase()].icon;
  const isOnline = useContext(OnlineStatusContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState(null);
  const [dialogContent, setDialogContent] = useState(null);
  const [dialogCallback, setDialogCallback] = useState(null);

  useEffect(() => { // read build info from file on disk
    if (!buildInfo) {
      fetch("/build-info.json")
        .then((response) => response.json())
        .then((data) => {
          let d = new Date(data.buildTimestamp);
          data.buildDateTime = // convert timestamp to human readable compact date
            d.getFullYear() + "-" +
            ("00" + (d.getMonth() + 1)).slice(-2) + "-" +
            ("00" + d.getDate()).slice(-2) + " " +
            ("00" + d.getHours()).slice(-2) + ":" +
            ("00" + d.getMinutes()).slice(-2) + ":" +
            ("00" + d.getSeconds()).slice(-2)
            ;
          setBuildInfo(data);
          //console.log("data:", data);
        })
        .catch((error) => console.error("Failed to fetch build info:", error))
        ;
    }
  }, []);

  const build = `${packageJson.name} v${packageJson.version} © ${new Date().getFullYear()}
    ${t("build n.")} ${buildInfo ? buildInfo.buildNumber : "?"} ${t("on date")} ${buildInfo ? buildInfo.buildDateTime : "?"}`;

  const changeLanguage = () => {
    const language = i18n.language === "it" ? "en" : "it";
    i18n.changeLanguage(language);
    document.documentElement.setAttribute("lang", language);
  }
  
  const handleOpenDialog = (title, content, callbackOnClose) => {
    setDialogTitle(title);
    setDialogContent(content);
    setDialogCallback(() => callbackOnClose);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    if (dialogCallback) {
      setDialogCallback(null);
      dialogCallback();
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        //backgroundColor: "transparent",
        backgroundColor: "rgba(255, 255, 255, 0.33)",
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
            ${packageJson.name} v${packageJson.version}
            © ${new Date().getFullYear()}
          `}
        </Box>

        {/* company name */}
        <Link
          href="/"
          color="textSecondary"
          underline="hover"
          sx={{ cursor: "pointer", mr: 3 }}
        >
          &nbsp; {config.company.name}
        </Link>

        {/* app and build full info */}
        <Box
          onClick={() => handleOpenDialog(
              t("App name and version"),
              <>{ build }</>,
              null,
            )
          }
          sx={{ mr: 1.5, cursor: "pointer" }}
        >
          <InfoOutlinedIcon sx={{ fontSize: 22, verticalAlign: "bottom", marginBottom: 0.3  }}/>
        </Box>
        
        {/* network connection indicator */}
        <Box
          onClick={() => handleOpenDialog(
            t("Network status"),
            <>{isOnline ? t("On") : t("Off")}</>,
            null,
          )
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

      <Dialog
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
        {/* {!React.isValidElement(dialogContent) && ( // show buttons only if dialogContent is not a component */}
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              fullWidth={false}
              autoFocus
            >
              {t("Ok")}
            </Button>
          </DialogActions>
        {/* )} */}
      </Dialog>
      
    </Box>
  );
}

export default Footer;
