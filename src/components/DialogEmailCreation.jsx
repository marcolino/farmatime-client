import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box, TextField } from "@mui/material";
import { Subject } from "@mui/icons-material";
import { FormInput, FormButton } from "./FormElements";
import { toast } from "./Toast";

function DialogEmailCreation({ open, onClose, onConfirm }) {
  //const classes = useStyles();
  const { t } = useTranslation();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState({});

  const validateForm = () => {
    if (!subject) {
      let err = t("Please supply an email subject");
      setError({ subject: err });
      toast.warning(err);
      return false;
    }
    if (!body) {
      let err = t("Please supply an email body");
      setError({ body: err });
      toast.warning(err);
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
      <DialogTitle>{t("Create email")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormInput
            autoFocus
            id={"subject"}
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder={t("Subject")}
            startAdornmentIcon={<Subject />}
            error={error.subject}
          />
          <Box m={0} />
          <FormInput
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
        <FormButton onClick={onCloseWithValidation} color="secondary">
          {t("Cancel")}
        </FormButton>
        <FormButton onClick={onConfirmWithValidation} color="primary">
          {t("Send email to selected users")}
        </FormButton>
      </DialogActions>
    </Dialog>
  );
}

export default DialogEmailCreation;
