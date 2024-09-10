import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/styles";
//import { toast } from "./Toast";
import { FormTitle } from "./FormElements";
import {
  Box, Paper, Typography,
} from "@mui/material";

const useStyles = makeStyles((theme) => ({
  title: {
    padding: 8,
    paddingRight: 24,
    borderRadius: 4,
    textAlign: "right",
    color: theme.palette.title.color,
    backgroundColor: theme.palette.title.backgroundColor,
  },
}));


const HandleProducts = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <FormTitle>
         {t("Handle products")}
        </FormTitle>
      <Paper>
        {t("Work in progress")}...
      </Paper>
    </>
  );
};

export default React.memo(HandleProducts);