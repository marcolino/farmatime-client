import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Button,
  InputAdornment,
} from "@mui/material";
import TextField from "./custom/TextField";
import { useDialog } from "../providers/DialogContext";
import { Subject } from "@mui/icons-material";
import { useSnackbarContext } from "../hooks/useSnackbarContext";


function DialogEmailCreation({ open, onClose, onConfirm }) {
  const { showSnackbar } = useSnackbarContext(); 
  const { t } = useTranslation();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState({});
  const { showDialog } = useDialog();
  // const [openHelp, setOpenHelp] = React.useState(false);
  // const onOpenHelp = () => setOpenHelp(true);
  // const onCloseHelp = () => setOpenHelp(false);
  const helpTitle = t("Email composition");
  const helpContents =
    t("In the email subject and in the email body you can use these \"strings\", enclosed among \"$\" signs, which will be replaced with the values for each user, before sending each email") +
    ": \n\n" +
    " • $NAME$ => " + t("The name of the user") + "\n" +
    " • $SURNAME$ => " + t("The surname of the user") + "\n" +
    " • $EMAIL$ => " + t("The email of the user") + "\n" +
    " • $PHONE$ => " + t("The phone of the user") + "\n" +
    " • $ADDRESS$ => " + t("The address of the user") + "\n" +
    " • $FISCALCODE$ => " + t("The fiscal code/VAT of the user") + "\n" +
    " • $ROLES$ => " + t("The role or roles of the user") + "\n" +
    " • $PLAN$ => " + t("The plan of the user") + "\n" +
    " • $COMPANY$ => " + t("The company of the user") + "\n"
  ;
  
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

  const onCloseWithValidation = () => {
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
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            autoFocus
            id={"subject"}
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder={t("Email subject")}
            //startAdornmentIcon={<Subject />}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Subject />
                </InputAdornment>
              ),
            }}
            title={t("Subject")}
            error={error.subject}
          />
          <Box m={0} />
          <TextField
            id={"body"}
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder={t("Email body")}
            error={error.body}
            multiline
            rows={4}
          />
          <Box m={0} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() =>
          showDialog({
            title: helpTitle,
            message: helpContents,
            confirmText: t("Ok"),
          })
        } color="secondary" variant="contained">
          ?
        </Button>
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
