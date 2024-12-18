import React from "react";
import { useTranslation } from "react-i18next";
import FlexyImageAndText from "./FlexyImageAndText";
import WorkInProgressImage from "../assets/images/WorkInProgress.png";


const WorkInProgress = () => {
  const { t } = useTranslation();
  
  return <FlexyImageAndText
    image={WorkInProgressImage}
    imageAlt={t("Work in progress image")}
    textTitle={t("Work in progress")}
    textContents={t("We are working hard to restore the functionality of this web app. Please come back soon…")}
  />;
};

export default React.memo(WorkInProgress);
