import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { OnlineStatusContext } from "../providers/OnlineStatusProvider";
import IconCustom from "./IconCustom";
import { i18n }  from "../i18n";
import packageJson from "../../package.json";
import config from "../config";


const changeLanguage = () => {
  const language = i18n.language === "it" ? "en" : "it"; // simple switch it<=> en - TODO: let user select language...
  i18n.changeLanguage(language);
  document.documentElement.setAttribute("lang", language);
}

const Footer = (props) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const on = t("on"), off = t("off");
  const languageFlag = config.i18n.languages.supported[i18n.language.slice(0, 2).toLowerCase()].icon; // TODO: do something safer...
  const isOnline = useContext(OnlineStatusContext);

  return (
    <Box
      component="footer"
      sx={{
        // position: "fixed", // fixes footer on bottom, even when scrolling
        bottom: 0,
        width: "100%",
        backgroundColor: "transparent", // theme.palette.ochre.main,
        opacity: 0.8,
        textAlign: "center",
        fontStyle: "italic",
        pt: 2,
        pb: 1,
        zIndex: 1000, // ensures the footer stays on top of the content
      }}
    >
      <Typography
        component="span"
        variant="body2"
        color={"textSecondary"}
        sx={{
          display: "inline-flex",
          alignItems: "baseline",
          flexWrap: "nowrap",
          "& > a": {
            display: "inline",
            whiteSpace: "nowrap",
          },
        }}
      >
        {packageJson.name} {" "}
        {"v"}{packageJson.version} {" ~ "}
        {"©"} {" "} {new Date().getFullYear()}, &nbsp;
        <Link
          href="/"
          component="a"
          color="textSecondary"
          underline="hover"
          sx={{ cursor: "pointer", fontSize: 18, mr: 2 }}
        >
          {config.company.name}
        </Link>
        <Typography
          onClick={() => changeLanguage()}
          variant="body2"
          sx={{
            cursor: "pointer",
            mr: 2
          }}
        >
          {languageFlag}
        </Typography>
        <Typography
          sx={{ cursor: "pointer" }}
        >
          <IconCustom
            name={`Network.${isOnline ? "on" : "off"}`}
            size={15}
            alt={t("Network connection indicator")}
            title={t("Network connection is {{how}}", { how: isOnline ? on : off })}
            sx={{ cursor: "pointer" }}
          />
        </Typography>
      </Typography>
    </Box>
  );
};

export default Footer;
