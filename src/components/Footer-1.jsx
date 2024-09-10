import React from "react";
//import { makeStyles } from "@material-ui/styles";
import { useTheme } from '@mui/material/styles';
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
//import Link from "@mui/material/Link";
import { i18n }  from "../i18n";
import IconCustom from "./IconCustom";
import { isAuthLocation } from "../libs/Misc";
import config from "../config";
//import packageJson from "../package.alias.json";
import packageJson from "../../package.json";

// const useStyles = makeStyles(theme => ({
//   footer: {
//     fontStyle: "italic",
//   },
//   pointer: {
//     cursor: "pointer",
//   }
// }));

const changeLanguage = () => {
  const language = i18n.language === "it" ? "en" : "it"; // simple switch it<=> en - TODO: let user select language...
  i18n.changeLanguage(language);
  document.documentElement.setAttribute("lang", language);
}

function Footer(props) {
  const location = useLocation();
  const classes = useStyles();
  const { t } = useTranslation();
  const on = t("on"), off = t("off");
  const languageIcon = config.i18n.languages.supported[i18n.language.slice(0, 2).toLowerCase()].icon; // TODO: do something safer...

  return isAuthLocation(location) ? null : ( // hide footer while in auth screens
    <Container className={classes.footer}>
      <Grid container justifyContent="center">
        <Typography component="h6" variant="body2" color={"textSecondary"}>
          {packageJson.name} {" "}
          {"v"}{packageJson.version} {" ~ "}
          {"©"} {" "} {new Date().getFullYear()}, {" "}
          {/* here Link component (in StrictMode) gives a warning ("Warning: findDOMNode is deprecated in StrictMode.") */}
          <a href={config.company.homeSite.url} color="inherit">
            {config.company.name}
          </a>
          <span>&emsp;</span>
          <span className={classes.pointer} onClick={() => changeLanguage()}>{languageIcon}</span>
          <span>&emsp;</span>
          <IconCustom name={`Network.${props.isOnline ? "on" : "off"}`} fill="red" size={12} alt={t("Network connection indicator")} title={t("Network connection is {{how}}", { how: props.isOnline ? on : off })} />
        </Typography>
      </Grid>
    </Container>
  );
}

export default React.memo(Footer);
