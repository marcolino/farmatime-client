import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Button,
} from "@mui/material";
import TextField from "./custom/TextField";
import { Subject } from "@mui/icons-material";
import { useSnackbar } from "../providers/SnackbarManager";


function DialogEmailCreation({ open, onClose, onConfirm }) {
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState({});

  const validateForm = () => {
    if (!subject) {
      let err = t("Please supply an email subject");
      setError({ subject: err });
      showSnackbar(err, "warning");
      return false;
    }
    if (!body) {
      let err = t("Please supply an email body");
      setError({ body: err });
      showSnackbar(err, "warning");
      return false;
    }
    return true;
  };

  const cleanForm = () => {
    setSubject("");
    setBody("");
  }

  const onCloseWithValidation = (e) => {
    onClose();
    cleanForm();
  }

  const onConfirmWithValidation = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError({});
    onConfirm({ subject, body });
    cleanForm();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{t("Create and send email")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <TextField
            autoFocus
            id={"subject"}
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder={t("Subject")}
            startAdornmentIcon={<Subject />}
            error={error.subject}
          />
          <Box m={0} />
          <TextField
            id={"body"}
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder={t("Body")}
            //startAdornmentIcon={<Drafts />}
            error={error.body}
            multiline
            rows={4}
            maxRows={Infinity}
          />
          <Box m={0} />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseWithValidation} color="secondary" variant="contained">
          {t("Cancel")}
        </Button>
        <Button onClick={onConfirmWithValidation} color="primary" variant="contained">
          {t("Send email")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogEmailCreation;
