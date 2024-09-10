import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { usePromiseTracker } from "react-promise-tracker";
import { useTranslation } from "react-i18next";
//import { makeStyles } from "@material-ui/styles";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import Button from "@mui/material/Button";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Person from "@mui/icons-material/Person";
import Lock from "@mui/icons-material/Lock";
//import i18n from "i18next";
//import { signIn/*, federatedSignIn*/ } from "../../libs/TrackPromise";
import { signIn/*, federatedSignIn*/ } from "../../libs/Fetch";
import { FacebookIcon, GoogleIcon } from "../IconFederated";
import { toast } from "../Toast";

//import { FormInput, FormButton, FormText, FormDividerWithText, /*FormCheckbox,*/ FormLink } from "../FormElements";

import { Typography as FormText } from "@mui/material";
import { Link as FormLink } from "react-router-dom";

import StyledTextField from "../form/TextField";
import StyledButton from "../form/Button";

import CustomButton from '../form/CustomButton';

import { AuthContext } from "../../providers/AuthProvider";
import { OnlineStatusContext } from "../../providers/OnlineStatusProvider";
import { validateEmail } from "../../libs/Validation";
import config from "../../config";

// const styles = theme => ({
//   avatar: {
//     backgroundColor: theme.palette.success.main,
//   },
//   // rememberMe: {
//   //   color: theme.palette.success.main,
//   // },
//   forgotPassword: {
//     color: theme.palette.success.main,
//   },
//   signUp: {
//     color: theme.palette.success.main,
//   },
//   columnLeft: {
//     marginLeft: theme.spacing(0.2),
//   },
//   columnRight: {
//     marginLeft: "auto",
//     marginRight: theme.spacing(0.2),
//   },
//   fieldset: {
//     border: 0,
//   },
// });
// const useStyles = makeStyles((theme) => (styles(theme)));



function SignIn() {
  const classes = {}; //useStyles();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState({});
  const { setAuth } = useContext(AuthContext);
  const isOnline = useContext(OnlineStatusContext);
  /* UNUSED */ const { promiseInProgress } = usePromiseTracker({delay: config.spinner.delay});
  const { t } = useTranslation();

  const onlineCheck = () => { // TODO: put this check one level upper... Ask AI on how to do it...
    if (!isOnline) {
      toast.warning("Sorry, we are currently offline. Please wait for the network to become available.");
      return false;
    }
    return true;
  };

  const validateForm = () => {   
    // validate email formally
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
      setError({ email: true/*err*/ });
      toast.warning(err);
      return false;
    }

    if (!password) {
      const err = t("Please supply a password");
      setError({ password: true/*err*/ });
      toast.warning(err);
      return false;
    }

    return true;
  };

  const formSignIn = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!onlineCheck()) return;
    setError({});

    signIn({
      email,
      password,
    }).then(data => {
      if (!data.ok) {
        console.warn("signIn error:", data);
        toast.error(t(data.message));
        setError({});
        return;
      }
      console.log("signIn success:", data);
      const user = data;
      console.log("SETAUTH {user}:", user);
      setAuth({ user });

      // if (!rememberMe) { // to handle remember-me flag
      //   localStorage.clear();
      // }
      setEmail("");
      setPassword("");
      navigate("/");
    }).catch(err => {
      console.error("signIn error catched:", err);
      toast.error(t(err.message));
      setError({}); // we can't blame some user input, it's a server side error
    });
  };

  const formFederatedSignIn = (e, provider) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!onlineCheck()) return;
    setError({});

    window.open("/api/auth/loginGoogle", "_self");

    // federatedSignIn().then(data => {
    //   console.log("federatedSignIn calling setAuth - data:", data);
    //   // TODO: do we need tokens here?
    //   setAuth({ user: { ...data.user, accessToken: data.accessToken, refreshToken: data.refreshToken }});
    //   if (!rememberMe) {
    //     localStorage.clear();
    //   }
    //   setEmail("");
    //   setPassword("");
    //   navigate("/");
    // }).catch(err => {
    //   console.error("federatedSignIn error:", err);
    //   toast.error(t(err.message));
    //   setError({}); // we don't know whom to blame
    // });
  };

  //console.log("config.oauth.federatedSigninProviders.length:", config.oauth.federatedSigninProviders.length);
  return (
    <Container maxWidth="xs" sx={{ py:4 }}>

      <form className={classes.form} noValidate autoComplete="off">
        <fieldset disabled={promiseInProgress} style={{border: 0}}>

          <Box m={0} />

          <Grid container justifyContent="center">
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
          </Grid>

          <Box m={2} />

          <Grid container justifyContent="flex-start">
            <FormText>
              {t("Sign in with email and password")}
            </FormText>
          </Grid>

          <Box m={0} />

          <StyledTextField
            autoFocus
            id={"email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("Email")}
            startIcon={<Person />}
            autoComplete="email"
            // fullWidth={true}
            // size={"small"}
            // margin={"dense"}
            error={error.email}
          />

          <StyledTextField
            id={"password"}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("Password")}
            startIcon={<Lock />}
            autoComplete="current-password"
            // fullWidth={true}
            // size={"small"}
            // margin={"dense"}
            error={error.password}
          />

          <Box m={1} />

          <CustomButton>Default Button</CustomButton>

          {/* Custom variant */}
          <CustomButton variant="contained">Contained Button</CustomButton>

          {/* Custom background color */}
          <CustomButton /*backgroundColor="#ff0000"*/>Red Button</CustomButton>

          {/* Both custom variant and background color */}
          <CustomButton variant="text" /*backgroundColor="#00ff00"*/>
            Green Text Button
          </CustomButton>
          
          <CustomButton
            variant="contained" // or 'outlined', 'text', etc.
            color="primary"
            fullWidth
            onClick={formSignIn}
          >
            {t("Sign In")}
          </CustomButton>
  
          <CustomButton variant="outlined">CUSTOM-BUTTON</CustomButton>
          
          <Grid container alignItems="center">
            <Grid className={classes.columnLeft}>
              {/* <FormCheckbox
                checked={rememberMe}
                onChange={setRememberMe}
                className={classes.rememberMe}
              >
                {t("Remember me")}
              </FormCheckbox> */}
            </Grid>
            <Grid className={classes.columnRight} style={{marginTop: 5}}>
              <FormLink
                onClick={() => navigate("/forgot-password")}
                className={classes.forgotPassword}
              >
                {t("Forgot Password?")}
              </FormLink>
            </Grid>
          </Grid>

          <Box m={2} />

          <Grid container direction="row" justifyContent="center" spacing={1}>
            <Grid item>
              <FormText>
                {t("Don't have an account?")}
              </FormText>
            </Grid>
            <Grid item>
              <FormLink
                onClick={() => navigate("/signup")}
                className={classes.signUp}
              >
                {t("Register Now!")}
              </FormLink>
            </Grid>
          </Grid>

          {!!config.oauth.federatedSigninProviders.length && (
            <>
              <Box m={3} />

              {/* <FormDividerWithText>
                <FormText>
                  <i>{t("or")}</i>
                </FormText>
              </FormDividerWithText> */} or

              <Box m={3} />

              <Grid container justifyContent="flex-start">
                <FormText>
                  {t("Sign in with a social account")}
                </FormText>
              </Grid>

              <Box m={0} />

              {/*
                config.oauth.federatedSigninProviders.map(provider => (
                  <FormButton
                    key={provider}
                    social={provider}
                    startIcon={
                      provider === "Facebook" ? <FacebookIcon /> :
                      provider === "Google" ? <GoogleIcon /> :
                      <GoogleIcon />
                    }
                    onClick={(e) => formFederatedSignIn(e, provider)}
                  >
                    {provider}
                  </FormButton>
                ))
              */}
            </>
          )}
        </fieldset>
      </form>

    </Container>
  );
}

export default React.memo(SignIn);
