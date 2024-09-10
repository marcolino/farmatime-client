import React, { useContext } from "react";
import { Paper, Typography } from "@mui/material";
import { AuthContext } from "../providers/AuthProvider";
import { useTranslation } from "react-i18next";

function Products() {
  const { auth } = useContext(AuthContext);
  const { t } = useTranslation();

  return (
    <Paper>
      <Typography>
        {`${t("Products")} ${t("for")} ${auth.user ? t("authenticated user") : t("guest user")} ${auth.user ? auth.user.email : ""}`}
      </Typography>
    </Paper>
  );
}

export default React.memo(Products);