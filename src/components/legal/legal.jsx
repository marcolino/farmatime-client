import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import Forward from "@mui/icons-material/Forward";
import privacyPolicy_en from "./en/PrivacyPolicy";
import privacyPolicy_it from "./it/PrivacyPolicy";
import termsOfUse_en from "./en/TermsOfUse";
import termsOfUse_it from "./it/TermsOfUse";
import { i18n } from "../../i18n";


function Legal(props) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  language = i18n.getCurrentBrowserLanguage();

  const contents = (
    props.doc === "privacyPolicy" ? (
      (language === "en") ?
        privacyPolicy_en() :
      (language === "it") ?
        privacyPolicy_it() :
      privacyPolicy_en()
    ) :
    props.doc === "termsOfUse" ? (
      (language === "en") ?
        termsOfUse_en() :
      (language === "it") ?
        termsOfUse_it() :
      termsOfUse_en()
    ) :
    t("Unforeseen document {{doc}}", { doc: props.doc })
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
