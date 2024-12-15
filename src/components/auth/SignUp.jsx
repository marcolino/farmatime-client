import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Avatar from "@mui/material/Avatar";
import { Box, Grid, Typography, Link } from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import TextField from "../custom/TextField";
import TextFieldPassword from "../custom/TextFieldPassword";
import Button from "../custom/Button";
import {
  AccountCircleOutlined,
  ConfirmationNumber,
  Person,
  Email,
  Lock
} from "@mui/icons-material";
//import { useSnackbar } from "../../providers/SnackbarManager";
import { useSnackbarContext } from "../../providers/SnackbarProvider"; 
import { apiCall } from "../../libs/Network";
import { validateFirstName, validateLastName, validateEmail, validatePassword } from "../../libs/Validation";


function SignUp() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmed, setPasswordConfirmed] = useState("");
  const [codeDeliveryMedium, setCodeDeliveryMedium] = useState("");
  const [waitingForCode, setWaitingForCode] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState(null);
  const [dialogContent, setDialogContent] = useState(null);
  const [dialogCallback, setDialogCallback] = useState(null);
  const { showSnackbar } = useSnackbarContext(); 
  const { t } = useTranslation();

  const handleOpenDialog = (title, content, callbackOnClose) => {
    setDialogTitle(title);
    setDialogContent(content);
    setDialogCallback(() => callbackOnClose);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    if (dialogCallback) {
      setDialogCallback(null);
      dialogCallback();
    }
  };

  const validateForm = (params) => {
    let validation;
    if (!waitingForCode) {
      // validate firstName formally
      validation = validateFirstName(firstName);
      if (validation !== true) {
        let err;
        switch (validation) {
          case "ERROR_PLEASE_SUPPLY_A_FIRSTNAME":
            err = t("Please supply first name");
            break;
          case "ERROR_PLEASE_SUPPLY_A_VALID_FIRSTNAME":
            err = t("Please supply a valid first name");
            break;
          default:
            err = validation;
        }
        setError({ firstName: true });
        showSnackbar(err, "warning");
        return false;
      }

       // validate lastName formally
       validation = validateLastName(lastName);
       if (validation !== true) {
         let err;
         switch (validation) {
           case "ERROR_PLEASE_SUPPLY_A_LASTNAME":
             err = t("Please supply last name");
             break;
           case "ERROR_PLEASE_SUPPLY_A_VALID_LASTNAME":
             err = t("Please supply a valid last name");
             break;
           default:
             err = validation;
         }
         setError({ lastName: true });
         showSnackbar(err, "warning");
         return false;
       }
    }

    // validate email formally
    if (!waitingForCode || params?.waitingForCodeResend) {
      validation = validateEmail(email);
      if (validation !== true) {
        let err;
        switch (validation) {
          case "ERROR_PLEASE_SUPPLY_AN_EMAIL":
            err = t("Please supply an email");
            break;
          case "ERROR_PLEASE_SUPPLY_A_VALID_EMAIL":
            err = t("Please supply a valid email");
            break;
          default:
            err = validation;
        }
        setError({ email: true });
        //toast.warning(err);
        showSnackbar(err, "warning");
        return false;
      }
    }

    if (!waitingForCode) {
      // validate password formally
      const [ validation, explanation ] = validatePassword(password, passwordConfirmed);
      if (validation !== true) {
        let err;
        switch (validation) {
          case "ERROR_PLEASE_SUPPLY_A_PASSWORD":
            err = t("Please supply a password");
            break;
          case "ERROR_PLEASE_SUPPLY_A_MORE_COMPLEX_PASSWORD":
            err = t("Please supply a more complex password") + ".\n\n" + explanation;
            break;
          case "PLEASE_CONFIRM_THE_PASSWORD":
            err = t("Please confirm the password");
            break;
          case "ERROR_THE_CONFIRMED_PASSWORD_DOES_NOT_MATCH_THE_PASSWORD":
            err = t("The confirmed password does not match the password");
            break;
          default:
            err = validation;
        }
        setError({ password: true });
        //toast.warning(err);
        showSnackbar(err, "warning");
        return false;
      }
      return true;
    }

    if (waitingForCode && !params?.waitingForCodeResend) {
      if (code.length <= 0) {
        setError({ code: true });
        return false;
      }
      return true;
    }

    return true;
  }

  const formSignUp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError({});

    const result = await apiCall("post", "/auth/signUp", {
      email,
      password,
      firstName,
      lastName,
    });
    if (result.err) {
      switch (result.err.code) {
        case "EMAIL_EXISTS_ALREADY":
        case "ACCOUNT_WAITING_FOR_VERIFICATION":
        case "DeletedUser":
          setError({ email: true });
          //toast.warning(t(result.message));
          showSnackbar(result.message, "warning");
          break;
        default:
          setError({}); // we don't know whom to blame
          //toast.error(t(result.message));
          showSnackbar(result.message, "error");
      }
    } else {
      console.devAlert(`SIGNUP VERIFICATION CODE: ${result.code}`);
      setWaitingForCode(true);
      setFirstName("");
      setLastName("");
      //setEmail("");
      setPassword("");
      const medium = result.codeDeliveryMedium;
      setCodeDeliveryMedium(medium);
      handleOpenDialog(
        t("Confirmation code sent by {{medium}}", { medium }),
        result.message,
        () => {},
      );
    }
  };
    
  const formSignupVerification = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError({});

    const result = await apiCall("post", "/auth/signupVerification", {
      email,
      code,
    });
    if (result.err) {
      showSnackbar(result.message, "error");
      setError({ code: true });
    } else {
      setEmail("");
      setCode("");
      handleOpenDialog(
        t("Registered successfully"),
        result.message,
        () => { navigate("/signin", { replace: true }) }
      );
    }
  };
  
  const formResendSignupVerificationCode = async (e) => {
    e.preventDefault();
    if (!validateForm({ waitingForCodeResend: true })) return;
    setError({});

    const result = await apiCall("post", "/auth/resendSignupVerificationCode", {
      email,
    });
    if (result.err) {
      showSnackbar(result.message, "error");
      setError({ code: true });
    } else {
      console.devAlert(`SIGNUP VERIFICATION CODE: ${result.code}`);
      const medium = result.codeDeliveryMedium;
      setCodeDeliveryMedium(medium);
      handleOpenDialog(
        t("Confirmation code resent by {{medium}}", { medium }),
        result.message,
        () => { },
      );
    }
  };

  return (
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
              <AccountCircleOutlined />
            </Avatar>
          </Box>
          {!waitingForCode && (
            <>
              <Typography variant="body1" color="textSecondary"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  my: 1,
                }}
              >
                {t("Register with your data")}
              </Typography>
              <TextField
                autoFocus
                id={"firstName"}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t("First Name")}
                startIcon={<Person />}
                error={error.firstName}
              />
              <TextField
                id={"lastName"}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={t("Last Name")}
                startIcon={<Person />}
                error={error.lastName}
              />
              <TextField
                id={"email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("Email")}
                startIcon={<Email />}
                error={error.email}
              />
              <TextFieldPassword
                id={"password"}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("Password")}
                startIcon={<Lock />}
                autoComplete="password"
                error={error.password}
              />
              <TextFieldPassword
                id={"passwordConfirmed"}
                type="password"
                value={passwordConfirmed}
                onChange={(e) => setPasswordConfirmed(e.target.value)}
                placeholder={t("Password confirmation")}
                startIcon={<Lock />}
                autoComplete="password-confirmation"
                error={error.passwordConfirmed}
              />
              <Box m={1} />
              <Button
                type="submit"
                onClick={formSignUp}
                sx={{ mt: 1, textAlign: "center" }}
              >
                {t("Sign Up")}
              </Button>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  {t("Already have an account?")}
                  {" "}
                  <Link
                    style={{ cursor: "pointer" }}
                    underline="hover"
                    onClick={() => navigate("/signin")}
                  >
                    {t("Sign in")}!
                  </Link>
                </Typography>
              </Box>
              
              <Grid container justifyContent="flex-start" sx={{ mt: 4 }}>
                <Typography component="h6" variant="caption" color="textSecondary" align="center">
                  {t("By signing up you agree to our")} <Link href="/terms-of-use" color="textPrimary">{t("terms of use")}</Link> {" "}
                  {t("and you confirm you have read our")} <Link href="/privacy-policy" color="textPrimary">{t("privacy policy")}</Link>
                  {", "} {t("including cookie use")} {"."}
                </Typography>
              </Grid>
            </>
          )}
          {waitingForCode && (
            <>
              <Typography variant="body1" color="textSecondary"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  my: 1,
                }}
              >
                {t("Verify Sign Up")}
              </Typography>
              
              <TextField
                id={"signUpCode"}
                type="tel" /* tel type does not show arrows */
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t("Numeric code just received by {{codeDeliveryMedium}}", {codeDeliveryMedium})}
                startIcon={<ConfirmationNumber />}
                error={error.code}
              />
              <Box m={1} />
              <Button
                type="submit"
                onClick={formSignupVerification}
              >
                {t("Verify Sign Up")}
              </Button>
              <Button
                onClick={formResendSignupVerificationCode}
                fullWidth={false}
                size="small"
                color="tertiary"
                sx={{ float: "right", marginLeft: "auto", marginRight: 0, mt: 1 }} >
                {t("Resend code")}
              </Button>
            </>
          )}
        </Box>
      </Box>
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
            autoFocus
          >
            {t("Ok")}
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}

export default React.memo(SignUp);
