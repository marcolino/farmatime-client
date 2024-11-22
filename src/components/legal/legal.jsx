import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import Forward from "@mui/icons-material/Forward";
import privacyPolicy_en from "./en/PrivacyPolicy";
import privacyPolicy_it from "./it/PrivacyPolicy";
import termsOfUse_en from "./en/TermsOfUse";
import termsOfUse_it from "./it/TermsOfUse";
import config from "../../config";


function Legal(props) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!props.language) {
    props.language = config.i18n.languages.fallback;
  }

  const contents = (
    props.doc === "privacyPolicy" ? (
      (props.language === "en") ?
        privacyPolicy_en() :
      (props.language === "it") ?
        privacyPolicy_it() :
      t("unsupported language property")
    ) :
    props.doc === "termsOfUse" ? (
      (props.language === "en") ?
        termsOfUse_en() :
      (props.language === "it") ?
        termsOfUse_it() :
      "unsupported language property"
    ) :
    "unsupported doc property"
  );

  return (
    <>
      <Button
        variant="contained"
        color="default"
        onClick={() => navigate(-1)}
        sx={{
          alignSelf: "center"
        }}
      >
        <Forward sx={{ transform: "rotate(180deg)" }} />
      </Button>
      {contents}
    </>
  );

}

export default React.memo(Legal);
