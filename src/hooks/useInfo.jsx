import { useState, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDialog } from "../providers/DialogContext";
import { fetchBuildInfoData } from "../libs/Misc";
import logoMainHeader from "../assets/images/LogoMainHeader.png";
import serverPackageJson from "../../../farmatime-server/package.json"; // WARNING: this depends on folders structure...
import config from "../config";

export const useInfo = () => {
  const { showDialog } = useDialog();
  const { t } = useTranslation();
  const [buildInfo, setBuildInfo] = useState(null);

  useEffect(() => {
    if (!buildInfo) {
      (async () => {
        const data = await fetchBuildInfoData();
        setBuildInfo(data);
      })();
    }
  }, [buildInfo]);

  const info = () => {
    const infoTitle = t("Informations about this app");

    const mode =
      config.mode.production ? "production" :
      config.mode.staging ? "staging" :
      config.mode.development ? "development" :
      config.mode.test ? "test" :
      config.mode.testInCI ? "testInCI" :
      "?";

    const infoContents = (
      <Box>
        <Grid
          container
          alignItems="center"
          sx={{
            width: "100%",
            backgroundColor: "tertiary.dark",
            borderRadius: 2,
          }}
        >
          {/* Left column */}
          <Grid size={{ xs: 3, md: 1 }} display="flex" alignItems="center">
            <Box
              component="img"
              src={logoMainHeader}
              alt="Main logo"
              sx={{
                width: { xs: 40, md: 48 },
                height: "auto",
                my: 1,
                ml: 1,
                borderRadius: 2,
              }}
            />
          </Grid>

          {/* Middle column */}
          <Grid size={{ xs: 6, md: 10 }} textAlign="center">
            <Typography
              variant="h4"
              align="center"
              sx={{
                width: "100%",
                fontWeight: "bold",
                whiteSpace: "nowrap",
                color: "background.default",
              }}
            >
              {config.title}
            </Typography>
          </Grid>

          {/* Right column (empty, balances left) */}
          <Grid size={{ xs: 3, md: 1 }} />
        </Grid>

        <Typography variant="body1" sx={{ mt: 4 }}>
          {t("This app is produced by")} {config.company.owner.name}<br />
          {t("You can reach us at email")} &lt;{config.company.email}&gt;<br />
          {t("App mode")} {t("is")} {t(mode)}<br />
          {t("Version")} {t("is")} v{serverPackageJson.version} © {new Date().getFullYear()}<br />
          {t("Client build")} {t("is")} {t("n.")} {buildInfo?.client ? buildInfo.client.buildNumber : "?"} {t("on date")} {buildInfo?.client ? buildInfo.client.buildDateTime : "?"}<br />
          {t("Server build")} {t("is")} {t("n.")} {buildInfo?.server ? buildInfo.server.buildNumber : "?"} {t("on date")} {buildInfo?.server ? buildInfo.server.buildDateTime : "?"}<br />
        </Typography>
      </Box>
    );
    // {t("Phone is")}: ${config.company.phone}.<br />
    // {t("Street address is")}: ${config.company.streetAddress}.<br />
    // {t("Email address is")}: ${config.company.email}.<br />

    showDialog({
      title: infoTitle,
      message: infoContents,
      confirmText: t("Ok"),
    });
  };

  return { info };
}

