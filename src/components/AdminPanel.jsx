import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
// import { makeStyles } from "@material-ui/styles";
//import { toast } from "./Toast";
import {
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";

// const useStyles = makeStyles((theme) => ({
//   title: {
//     padding: 8,
//     paddingRight: 24,
//     borderRadius: 4,
//     textAlign: "right",
//     color: theme.palette.title.color,
//     backgroundColor: theme.palette.title.backgroundColor,
//   },
// }));


const AdminPanel = () => {
  const classes = {}; //useStyles();
  const navigate = useNavigate();
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
            onClick={() => navigate("/handle-users")}
          >
            {t("Handle users")}
          </Button>
        </Box>
        <Box sx={{ padding: 8 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/handle-products")}
          >
            {t("Handle products")}
          </Button>
        </Box>
      </Paper>
    </>
  );
};

export default React.memo(AdminPanel);