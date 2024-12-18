import React from "react";
import { useTranslation } from "react-i18next";
import FlexyImageAndText from "./FlexyImageAndText";
import PageNotFoundImage from "../assets/images/PageNotFound.png";


const PageNotFound = () => {
  const { t } = useTranslation();

  return <FlexyImageAndText
    image={PageNotFoundImage}
    imageAlt={t("Page not found image")}
    textTitle={t("Oooops!")}
    textContents={t("I've lost the page you did request! Sorry…")}
  />;
}

export default React.memo(PageNotFound);
