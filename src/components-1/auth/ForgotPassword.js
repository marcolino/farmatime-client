import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { usePromiseTracker } from "react-promise-tracker";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/styles";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import LockOpenOutlined from "@material-ui/icons/LockOpenOutlined";
import ConfirmationNumber from "@material-ui/icons/ConfirmationNumber";
import Lock from "@material-ui/icons/Lock";
import LockOpen from "@material-ui/icons/LockOpen";
// TODO: do not use trackpromise, but "../../libs/Fetch" ...
//import { forgotPassword, forgotPasswordSubmit, resendResetPasswordCode } from "../../libs/TrackPromise";
import { forgotPassword, forgotPasswordSubmit, resendResetPasswordCode } from "../../libs/Fetch";
import { toast } from "../Toast";
import { FormInput, FormButton, FormText } from "../FormElements";
import { validateEmail, validatePassword } from "../../libs/Validation";
import config from "../../config";

const styles = theme => ({
  avatar: {
    backgroundColor: theme.palette.success.main,
  },
  fieldset: {
    border: 0,
  },
});
const useStyles = makeStyles((theme) => (styles(theme)));

function ForgotPassword() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmed, setPasswordConfirmed] = useState("");
  const [error, setError] = useState({ email: null, password: null, passwordConfirmed: null, code: null });
  const [waitingForCode, setWaitingForCode] = useState(false);
  const [codeDeliveryMedium, setCodeDeliveryMedium] = useState("");
  const [code, setCode] = useState("");
  const history = useHistory();
  const { promiseInProgress } = usePromiseTracker({delay: config.spinner.delay});
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState(null);
  const [dialogContent, setDialogContent] = useState(null);
  const [callbackOnCloseDialog, setCallbackOnCloseDialog] = useState(null);

  const [openDialog1, setOpenDialog1] = useState(false);
  const [dialogTitle1, setDialogTitle1] = useState(null);
  const [dialogContent1, setDialogContent1] = useState(null);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [dialogTitle2, setDialogTitle2] = useState(null);
  const [dialogContent2, setDialogContent2] = useState(null);
  const { t } = useTranslation();

  const handleOpenDialog = (title, content, callbackOnCLose) => {
    setDialogTitle(title);
    setDialogContent(content);
    setOpenDialog(true);
    setCallbackOnCloseDialog(callbackOnCLose);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    // setDialogTitle(null);
    // setDialogContent(null);
    if (callbackOnCloseDialog) {
      setCallbackOnCloseDialog(null);
      callbackOnCloseDialog();
    }
  };

  const validateForm = () => { // validate email formally
    if (!waitingForCode) {
      const response = validateEmail(email);
      if (response !== true) {
        let err;
        switch (response) {
          case "ERROR_PLEASE_SUPPLY_AN_EMAIL":
            err = t("Please supply an email");
            break;
          case "ERROR_PLEASE_SUPPLY_A_VALID_EMAIL":
            err = t("Please supply a valid email");
            break;
          default:
            err = response;
        }
        toast.warning(err);
        setError({ email: err });
        return false;
      }
    }

    if (waitingForCode) {
      const response = validatePassword(password, passwordConfirmed);
      if (response !== true) {
        let err;
        switch (response) {
          case "ERROR_PLEASE_SUPPLY_A_PASSWORD":
            err = t("Please supply a password");
            break;
          case "ERROR_PLEASE_SUPPLY_A_MORE_COMPLEX_PASSWORD":
            err = t("Please supply a more complex password");
            break;
          case "PLEASE_CONFIRM_THE_PASSWORD":
            err = t("Please confirm the password");
            break;
          case "ERROR_THE_CONFIRMED_PASSWORD_DOES_NOT_MATCH_THE_PASSWORD":
            err = t("The confirmed password does not match the password");
          break;
          default:
            err = response;
        }
        toast.warning(err);
        setError({ password: err });
        return false;
      }
    }

    return true;
  }

  const formForgotPassword = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError({});

    //console.log("formForgotPassword");
    forgotPassword({
      email
    }).then(data => {
      if (!data.ok) {
        console.warn("forgotPassword error:", data);
        toast.error(t(data.message));
        setError({ email: data.message }); // TODO: should we always blame email input for error?
        return;
      }
      //console.log("forgotPassword success:", data);
      setWaitingForCode(true);
      setPassword("");
      const medium = data.codeDeliveryMedium;
      const email = data.codeDeliveryEmail;
      setCodeDeliveryMedium(medium);
      handleOpenDialog(
        t("Confirmation code sent"),
        t(`\
Confirmation code sent via {{medium}} to {{email}}.
Please copy and paste it here.`, { medium, email }),
        () => { },
      );
    });
  };
  
  const formConfirmForgotPassword = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError({});
    
    forgotPasswordSubmit({email, code, password, passwordConfirmed}).then(data => {
      if (!data.ok) {
        console.warn("forgotPasswordSubmit error:", data);
        toast.error(t(data.message));
        setError({ password: data.message}); // TODO: check whom to blame for error
        return;
      }
      //console.log("confirmForgotPasswordSubmit success data:", data);
      setWaitingForCode(false);
      setEmail("");
      setPassword("");
      setPasswordConfirmed("");
      setCode("");
      handleOpenDialog(
        t(`Password reset success`),
        t(`You can now sign in with your new password`),
        () => {history.push("/signin")}
      );
    });
  };
  
  const formResendResetPasswordCode = (e) => {
    e.preventDefault();
    setError({});

    resendResetPasswordCode({email}).then(data => {
      if (!data.ok) {
        console.warn("formResendResetPasswordCode error:", data);
        switch (data.code) {
          case "ExpiredCodeException":
            setError({ confirmationCode: data }); // blame confirmationCode field as guilty
            break;
          default:
            setError({}); // we don't know whom to blame
        }
        toast.error(t(data.message));
        return;
      }
      console.log("TODO: CHECK IF IN DATA WE HAVE MESSAGE TO SHOW TO THE USER resendResetPasswordCode success data:", data);
      toast.info("Code resent successfully");
    });
  };

  return (
    <Container maxWidth="xs">

      <form className={classes.form} noValidate autoComplete="off">
        <fieldset disabled={promiseInProgress} className={classes.fieldset}>
          {!waitingForCode && (
            <>

              <Box m={1} />

              <Grid container justifyContent="center">
                <Avatar className={classes.avatar}>
                  <LockOpenOutlined />
                </Avatar>
              </Grid>

              <Box m={3} />

              <Grid container justifyContent="flex-start">
                <FormText>
                  {t("Reset password")}
                </FormText>
              </Grid>

              <Box m={1} />

              <FormInput
                autoFocus
                id={"email"}
                value={email}
                onChange={setEmail}
                placeholder={t("Email")}
                startAdornmentIcon={<LockOpen />}
                error={error.email}
              />

              <Box m={1} />

              <FormButton
                onClick={formForgotPassword}
              >
                {t("Request password reset")}
              </FormButton>
              
            </>
          )}
          {waitingForCode && (
            <>

              <FormInput
                id={"password"}
                type="password"
                value={password}
                onChange={setPassword}
                placeholder={t("New password")}
                startAdornmentIcon={<Lock />}
                error={error.password}
              />

              <FormInput
                id={"passwordConfirmed"}
                type="password"
                value={passwordConfirmed}
                onChange={setPasswordConfirmed}
                placeholder={t("New password confirmation")}
                startAdornmentIcon={<Lock />}
                error={error.passwordConfirmed}
              />

              <FormInput
                id={"confirmationCode"}
                type="number"
                value={code}
                onChange={setCode}
                placeholder={t("Numeric code just received by {{codeDeliveryMedium}}", {codeDeliveryMedium})}
                startAdornmentIcon={<ConfirmationNumber />}
                error={error.confirmationCode}
              />

              <Box m={1} />

              <FormButton
                onClick={formConfirmForgotPassword}
              >
                {t("Confirm Password Reset")}
              </FormButton>

              <Grid container justifyContent="flex-end">
                <FormButton
                  onClick={formResendResetPasswordCode}
                  fullWidth={false}
                  className={"buttonSecondary"}
                >
                  {t("Resend code")}
                </FormButton>
              </Grid>

            </>
          )}
        </fieldset>
      </form>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialogTitle}
        </DialogTitle>
        <DialogContent id="alert-dialog-description">
          <Typography variant="body1" style={{whiteSpace: 'pre-line'}}>
            {dialogContent}
          </Typography>
        </DialogContent>
        <DialogActions>
          <FormButton
            onClick={handleCloseDialog}
            fullWidth={false}
            className={"buttonSecondary"}
            autoFocus
          >
            {t("Ok")}
          </FormButton>
        </DialogActions>
      </Dialog>

    </Container>
  );
}

export default React.memo(ForgotPassword);