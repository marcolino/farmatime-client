import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom"
import { Typography, Box, Button } from "@mui/material";
import FlexyImageAndText from "./FlexyImageAndText";
import LocalStorage from "../libs/LocalStorage";
import WorkInProgressImage from "../assets/images/WorkInProgress.png";


const WorkInProgress = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("%%%%%%%%%% location.state is:", location.state);

  const retry = () => {
    const maintenancePath = (LocalStorage.get("x-maintenance-path"));
    navigate(maintenancePath ?? "/");
    LocalStorage.remove("x-maintenance-path");
  };

  return <FlexyImageAndText
    image={WorkInProgressImage}
    imageAlt={t("Work in progress image")}
    title={t("Work in progress")}
    content={t("We are working hard to restore the functionality of this app. Please retry soon…")}
    //   <>
    //     <Typography variant="body1" sx={{ margin: 2 }}>
    //       {t("We are working hard to restore the functionality of this app. Please retry soon…")}
    //     </Typography>
    //     <Button
    //       variant={"contained"} color="primary" fullWidth={false} size={"large"}
    //       onClick={retry}
    //     >
    //       {t("Retry")}
    //     </Button>
    //   </>
    // }
  />;
};

export default React.memo(WorkInProgress);
