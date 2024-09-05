import React from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/styles";
//import { toast } from "./Toast";
import {
  Box,
  Button,
  Paper,
  Typography,
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


const AdminPanel = () => {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <>
      <Box sx={{ marginBottom: 24 }} className={classes.title}>
        <Typography variant="h6">
         {t("Admin panel")}
        </Typography>
      </Box>
      <Paper>
        <Box sx={{ padding: 8 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => history.push("/handle-users")}
          >
            {t("Handle users")}
          </Button>
        </Box>
        <Box sx={{ padding: 8 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => history.push("/handle-articles")}
          >
            {t("Handle articles")}
          </Button>
        </Box>
      </Paper>
    </>
  );
};

export default React.memo(AdminPanel);