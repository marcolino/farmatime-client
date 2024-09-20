import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import LockOpenOutlined from "@mui/icons-material/LockOpenOutlined";
import ConfirmationNumber from "@mui/icons-material/ConfirmationNumber";
import Lock from "@mui/icons-material/Lock";
import LockOpen from "@mui/icons-material/LockOpen";
import TextField from "../styled/TextField";
import Button from "../styled/Button";
import { apiCall }  from "../../libs/Network";
import { toast } from "../Toast";
import { validateEmail, validatePassword } from "../../libs/Validation";
import config from "../../config";


function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmed, setPasswordConfirmed] = useState("");
  const [error, setError] = useState({ email: false, password: false, passwordConfirmed: false, code: false });
  const [waitingForCode, setWaitingForCode] = useState(false);
  const [codeDeliveryMedium, setCodeDeliveryMedium] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState(null);
  const [dialogContent, setDialogContent] = useState(null);
  const [callbackOnCloseDialog, setCallbackOnCloseDialog] = useState(null);
  const { t } = useTranslation();

  const handleOpenDialog = (title, content, callbackOnClose) => {
    setDialogTitle(title);
    setDialogContent(content);
    setOpenDialog(true);
    setCallbackOnCloseDialog(() => callbackOnClose);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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
        setError({ email: true });
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
        setError({ password: true });
        return false;
      }
    }
    return true;
  }

  const formForgotPassword = async(e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError({});

    const result = await apiCall("post", "/auth/resetPassword", {
      email,
    });
    if (!result.err) {
      setWaitingForCode(true);
      setPassword("");
      const medium = result.codeDeliveryMedium;
      setCodeDeliveryMedium(medium);
      handleOpenDialog(
        t("Confirmation code sent"),
        result.message,
        () => { },
      );
    } else {
      toast.error(result.message);
      setError({});
    }
  };
  
  const formConfirmForgotPassword = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError({});
    
    const result = await apiCall("post", "/auth/resetPasswordConfirm", {
      email,
      code,
      password,
      passwordConfirmed,
    });
    if (!result.err) {
      setWaitingForCode(false);
      setEmail("");
      setPassword("");
      setPasswordConfirmed("");
      setCode("");
      handleOpenDialog(
        t(`Password reset success`),
        t(`You can now sign in with your new password`),
        () => { navigate("/signin", { replace: true }) }
      );
    } else {
      toast.error(result.message);
      switch (result.data.code) {
        case "NotFoundCode":
          setError({ confirmationCode: true }); // blame confirmationCode field for error
          break;
        case "InvalidOrExpiredCode":
          setError({ confirmationCode: true }); // blame confirmationCode field for error
          break;
        default:
          setError({ password: true }); // blame password field for error
      }
      
    }
  };

  const formResendResetPasswordCode = async(e) => {
    e.preventDefault();
    setError({});

    const result = await apiCall("post", "/auth/resendResetPasswordCode", {
      email,
    });
    if (!result.err) {
      setWaitingForCode(true);
      //setEmail("");
      setPassword("");
      setPasswordConfirmed("");
      setCode("");
      handleOpenDialog(
        t(`Reset code resent`),
        result.message,
        () => { }
      );
    } else {
        switch (result.code) {
          case "NotFoundCode":
            setError({ confirmationCode: true }); // blame confirmationCode field for error
            break;
          case "InvalidOrExpiredCode":
            setError({ confirmationCode: true }); // blame confirmationCode field for error
            break;
          default:
            setError({ password: true }); // blame password field for error
        }
        toast.error(result.message);
    }
  };

  return (
    <>
      <form noValidate autoComplete="on">
        
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "start",
            mt: 6,
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 400,
              p: 2,
              border: "1px solid",
              borderColor: "primary.main",
              borderRadius: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 0,
                mb: 3,
              }}
            >
              <Avatar sx={{ backgroundColor: "primary.main" }}>
                <LockOpenOutlined />
              </Avatar>
            </Box>
            {!waitingForCode && (
              <>
                <Typography variant="body2" color="textSecondary"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    my: 1,
                  }}
                >
                  {t("Reset password")}
                </Typography>
                <TextField
                  autoFocus
                  id={"email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("Email")}
                  startIcon={<LockOpen />}
                  error={error.email}
                />
                <Box m={1} />
                <Button type="submit" onClick={formForgotPassword}>
                  {t("Request password reset")}
                </Button>
              </>
            )}
            {waitingForCode && (
              <>
                <Typography variant="body2" color="textSecondary"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    my: 1,
                  }}
                >
                  {t("New password")}
                </Typography>
                <TextField
                  autoFocus
                  id={"password"}
                  type="password"
                  value={password}
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("New password")}
                  startIcon={<Lock />}
                  error={error.password}
                />
                <Box m={1} />
                <TextField
                  id={"passwordConfirmed"}
                  type="password"
                  value={passwordConfirmed}
                  autoComplete="new-password-confirmation"
                  onChange={(e) => setPasswordConfirmed(e.target.value)}
                  placeholder={t("New password confirmation")}
                  startIcon={<Lock />}
                  error={error.passwordConfirmed}
                />
                <Box m={1} />
                <TextField
                  id={"confirmationCode"}
                  type="tel" /* tel type does not show arrows */
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={t("Numeric code received by {{codeDeliveryMedium}}", {codeDeliveryMedium})}
                  startIcon={<ConfirmationNumber />}
                  error={error.confirmationCode}
                />
                <Button
                  type="submit" onClick={formConfirmForgotPassword}>
                  {t("Request password reset")}
                </Button>
                <Button
                  type="submit" onClick={formResendResetPasswordCode}
                  fullWidth={false} size="small" color="tertiary"
                  sx={{ float: "right", marginLeft: "auto", marginRight: 0, mt: 1 }} >
                  {t("Resend code")}
                </Button>
              </>
            )}
          </Box>
        </Box>

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
          <Typography variant="body1" sx={{whiteSpace: "pre-line"}}>
            {dialogContent}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            fullWidth={false}
            className={"buttonSecondary"}
            autoFocus
          >
            {t("Ok")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default React.memo(ForgotPassword);
