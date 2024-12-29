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

const NotificationPreferencesManagement = (props) => {
  console.log("NotificationPreferencesManagement props:", props)
  const theme = useTheme();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarContext(); 
  const { t } = useTranslation();
  const [action, setAction] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState(null);
  const [dialogMessage, setDialogMessage] = useState(null);
  
  //const handleOpenDialog = (action) => { setAction(action); setConfirmOpen(true); }

  const handleOpenDialog = (title, content, action /*callbackOnClose*/) => {
    setDialogTitle(title);
    setDialogContent(content);
    setAction(action);
    //setDialogCallback(() => callbackOnClose);
    setConfirmOpen(true);
  };
  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setAction("");
  }
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
    alert("doing unsubscribe..."); // TODO: add prop to user model on server to store email preferences, and add api to set it
    //apiCall(...);
    navigate("/"); // at the end, navigate to home page...
  }

  return(
    <>
      <SectionHeader>
        {props.section === "all" && t("Notification preferences")}
        {props.section === "email" && props.action === "preferences" && t("Email preferences")}
        {props.section === "email" && props.action === "unsubscribe" && t("Email unsubscribe")}
        {props.section === "push-notifications" && props.action === "preferences" && t("Push notifications preferences")}
        {props.section === "push-notifications" && props.action === "unsubscribe" && t("Push notifications unsubscribe")}
      </SectionHeader>

      <Box sx={{
        my: theme.spacing(4),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        //minHeight: "100vh",
      }}>
        <Button
          onClick={() => handleOpenDialog(t("Confirm Unsubscription"), t("Are you sure you want to unsubscribe to all emails from {{site}}?", { site: config.title }), "unsubscribe")}
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
        title={dialogTitle}
        message={dialogMessage}
        // title={t("Confirm Unsubscription")}
        // message={t("Are you sure you want to unsubscribe to all emails from {{site}}?", { site: config.title })}
        confirmText={t("Confirm")}
        cancelText={t("Cancel")}
      />
    </>
  );
};

export default React.memo(NotificationPreferencesManagement);
