import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
//import Snackbar from "@mui/material/Snackbar";
import { SectionHeader } from "./custom";
import {
  Paper,
} from "@mui/material";


const HandleProducts = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <SectionHeader>
       {t("Handle products")}
      </SectionHeader>
      <Paper>
        {t("Work in progress")}...
      </Paper>
    </>
  );
};

export default React.memo(HandleProducts);