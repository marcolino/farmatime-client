import React from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/styles";
//import { toast } from "./Toast";
import { FormTitle } from "./FormElements";
import {
  Box, Paper, Typography,
} from "@material-ui/core";

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


const HandleArticles = () => {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <>
      <FormTitle>
         {t("Handle articles")}
        </FormTitle>
      <Paper>
        {t("Work in progress")}...
      </Paper>
    </>
  );
};

export default React.memo(HandleArticles);