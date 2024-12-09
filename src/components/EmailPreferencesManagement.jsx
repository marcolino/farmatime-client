import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { DateTime } from "luxon";
import DialogConfirm from "./DialogConfirm";
import { apiCall } from "../libs/Network";
import { isBoolean, isString, isNumber, isArray, isObject, isNull } from "../libs/Misc";
import { useSnackbarContext } from "../providers/SnackbarProvider"; 
import { i18n } from "../i18n";
import {
  Box,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
} from "@mui/material";
import { TextFieldSearch, SectionHeader, Button } from "./custom";
import { Search, Edit, Delete, AddCircleOutline } from "@mui/icons-material";
import config from "../config";

const EmailPreferencesManagement = (props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarContext(); 
  const { t } = useTranslation();
  const [action, setAction] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const handleConfirmOpen = (action) => { setAction(action); setConfirmOpen(true); }
  const handleConfirmClose = () => { setConfirmOpen(false); setAction(""); }
  const handleConfirm = () => { // perform the action on confirmation
    onAction(action);
    handleConfirmClose();
  };

  const onAction = (action, params) => {
    switch (action) {
      case "unsubscribe":
        unsubscribe();
        break;
      default: // should not happen...
        showSnackbar(t("Unforeseen action {{action}}", { action }), "error");
    }
  }

  const unsubscribe = () => {
    alert("doing unsubscribe..."); // TODO
    //apiCall(...);
    navigate("/"); // at the end, navigate to home page...
  }

  return(
    <>
      <SectionHeader>
        {t("Email preferences")}
      </SectionHeader>

      <Box sx={{
        my: theme.spacing(4),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        //minHeight: "100vh",
      }}>
        <Button
          onClick={() => handleConfirmOpen("unsubscribe")}
          fullWidth={false}
          variant="contained"
          color="primary"
          size="small"
          sx={{
            mt: theme.spacing(1),
            //height: "40px", // match the height of the TextField with size="small" and margin="dense"
          }}
        >
          {t("Unsubscribe from all emails from {{site}}", { site: config.title})}
        </Button>
      </Box>

      <DialogConfirm
        open={confirmOpen}
        onClose={handleConfirmClose}
        onCancel={handleConfirmClose}
        onConfirm={handleConfirm}
        title={t("Confirm Unsubscription")}
        message={t("Are you sure you want to unsubscribe to all emails from {{site}}?", { site: config.title })}
        confirmText={t("Confirm")}
        cancelText={t("Cancel")}
      />
    </>
  );
};

export default React.memo(EmailPreferencesManagement);
