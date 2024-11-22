import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
//import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { OnlineStatusContext } from "../providers/OnlineStatusProvider";
import IconCustom from "./IconCustom";
import { i18n }  from "../i18n";
import packageJson from "../../package.json";
import config from "../config";

const changeLanguage = () => {
  const language = i18n.language === "it" ? "en" : "it";
  i18n.changeLanguage(language);
  document.documentElement.setAttribute("lang", language);
}

const Footer = () => {
  //const theme = useTheme();
  const { t } = useTranslation();
  const [buildInfo, setBuildInfo] = useState(null);
  const on = t("on"), off = t("off");
  const languageFlag = config.i18n.languages.supported[i18n.language.slice(0, 2).toLowerCase()].icon;
  const isOnline = useContext(OnlineStatusContext);

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

  const build = config.mode.development ? "" : `build n. ${buildInfo ? buildInfo.buildNumber : "?"} on ${buildInfo ? buildInfo.buildDateTime : "?"} ~ `;

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
        <Box sx={{ lineHeight: 1 }}>
          {`
            ${packageJson.name} v${packageJson.version} ~
            ${build}
            © ${new Date().getFullYear()},
          `}
        </Box>
        <Link
          href="/"
          color="textSecondary"
          underline="hover"
          sx={{
            cursor: "pointer",
            verticalAlign: "baseline"
          }}
        >
          &nbsp; {config.company.name}
        </Link>
        <Box
          onClick={changeLanguage}
          sx={{ cursor: "pointer" }}
        >
          &nbsp;{languageFlag}&nbsp;
        </Box>
        <Box
          sx={{ cursor: "pointer" }}
        >
          &nbsp;<IconCustom
            name={`Network.${isOnline ? "on" : "off"}`}
            size={15}
            alt={t("Network connection indicator")}
            title={t("Network connection is {{how}}", { how: isOnline ? on : off })}
          />&nbsp;
        </Box>
      </Typography>
    </Box>
  );
}

export default Footer;
