import React from "react";
import { useTranslation } from "react-i18next";
import FlexyImageAndText from "./FlexyImageAndText";
import ToBeDoneImage from "../assets/images/ToBeDone.png";


const ToBeDone = () => {
  const { t } = useTranslation();

  return <FlexyImageAndText
    image={ToBeDoneImage}
    imageAlt={t("'To be done' image")}
    title={t("Not yet ready")}
    content={t("This feature is being implemented, but it is not yet ready for lunch time. Please retry soon…")}
  />;
};

export default React.memo(ToBeDone);
