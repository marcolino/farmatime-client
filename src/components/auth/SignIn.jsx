import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Avatar, Box, Link, Checkbox, FormControlLabel, Typography, Tooltip } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import Icon from "@mui/material/Icon";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Person from "@mui/icons-material/Person";
import Lock from "@mui/icons-material/Lock";
//import DialogConfirm from "../DialogConfirm";
import { useDialog } from "../../providers/DialogContext";
import { useSnackbarContext } from "../../providers/SnackbarProvider"; 
import { TextField, TextFieldPassword, Button} from "../custom";
import { AuthContext } from "../../providers/AuthContext";
import { validateEmail } from "../../libs/Validation";
import { apiCall } from "../../libs/Network";
import { secondsToHumanDuration, isPWA } from "../../libs/Misc";
import config from "../../config";


function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const { signIn } = useContext(AuthContext);
  const { showDialog } = useDialog();
  const { showSnackbar } = useSnackbarContext();
  const { t } = useTranslation();
  const [dontRememberMe, setDontRememberMe] = useState(false);
  
  const location = useLocation();

  const handleSocialLogin = (event, provider) => {
    event.preventDefault(); // redirect fails without preventing default behaviour!
    const flow = isPWA() ? "pwa" : "web";
    const redirectUrl = `${config.siteUrl}/api/auth/${provider.toLowerCase()}/${flow}`;
    console.log("redirecting to:", redirectUrl);
    window.location.href = redirectUrl;
  };

  const handleDontRememberMeChange = (event) => {
    setDontRememberMe(event.target.checked);
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
      setError({ email: true });
      showSnackbar(err, "warning");
      return false;
    }

    if (!password) {
      const err = t("Please supply a password");
      setError({ password: true });
      showSnackbar(err, "warning");
      return false;
    }

    return true;
  };

  const formSignIn = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError({});

    const result = await apiCall("post", "/auth/signin", {
      email,
      password,
      rememberMe: !dontRememberMe,
    });
    if (result.err) {
      const codeDeliveryMedium = result.data?.codeDeliveryMedium;
      switch (result.data?.code) {
        case "ACCOUNT_WAITING_FOR_VERIFICATION":
          setError({ email: true });
          //showSnackbar(result.message, "warning");
          showDialog({
            title: t("Account is waiting for verification"),
            message: result.data.message,
            confirmText: t("Ok"),
            onConfirm: () => {
              navigate(`/signup/true/${codeDeliveryMedium}`, { replace: true }); // navigate to signup screen in "waitingForCode" mode
            },
          });
          // setDialogTitle();
          // setDialogContent(result.data.message);
          // setDialogCallback(() => () => {
          //   navigate(`/signup/true/${codeDeliveryMedium}`, { replace: true }); // navigate to signup screen in "waitingForCode" mode
          // });
          // setOpenDialog(true);
          break;
        case "ACCOUNT_DELETED":
          setError({ email: true });
          showSnackbar(result.message, "warning");
          break;
        default:
          setError({}); // we don't know whom to blame
          showSnackbar(result.message, "error");
      }
    } else {
      showSnackbar(t("Sign in successful"), "success");
      console.log("Email signin result:", result);
      signIn(result);
      setEmail("");
      setPassword("");
      //navigate(redirectTo ? `/${redirectTo}` : "/", { replace: true, state: { params: redirectToParams } });
      navigate(location.state?.returnUrl ?? "/", { replace: true });
    }  
  };

  useEffect(() => {
    if (location.state?.reason) {
      switch (location.state.reason) {
        case "expired":
          showDialog({
            title: t("Session expired"),
            message: t("Session has expired. Please sign in again."),
            confirmText: t("Ok"),
          });
          break;
        default: // should not happen
          showDialog({
            title: t("Need to sign in again"),
            message: location.state?.reason,
            confirmText: t("Ok"),
          });
        //alert("REASON: " + location.state.reason);
      }
    }
  }, [location.state]);

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
            <Avatar sx={{ bgColor: "primary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
          </Box>
          <Typography variant="body1" color="textSecondary"
            sx={{
              display: "flex",
              justifyContent: "center",
              my: 1,
            }}
          >
            {t("Sign in with email and password")}
          </Typography>
          <TextField
            autoFocus
            id={"email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={"Email"}
            startIcon={<Person />}
            autoComplete="email"
            error={error.email}
          />
          <TextFieldPassword
            id={"password"}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("Password")}
            startIcon={<Lock />}
            autoComplete="current-password"
            error={error.password}
          />
          <Button
            type="submit"
            onClick={formSignIn}
            sx={{ mt: 1, textAlign: "center" }}
          >
            {t("Sign in")}
          </Button>
          <Box
            display="flex"
            justifyContent="flex-end"
          >
            <Tooltip placement="bottom" title={
              t(`It is recommended to check this flag if you are on a public computer, with low security`) + ".\n" +
              t(`If checked your session will last only for ${secondsToHumanDuration(config.auth.refreshTokenExpirationDontRememberMeSeconds)}`) + ", " +
              t(`otherwise it will last for ${secondsToHumanDuration(config.auth.refreshTokenExpirationSeconds)}`) + "."}
            >
              <FormControlLabel
                checked={dontRememberMe}
                onChange={handleDontRememberMeChange}
                labelPlacement="start" 
                control={
                  <Checkbox 
                    size="small"
                    color="primary"
                    sx={{
                      mr: -1
                    }}
                  />
                }
                label={t("Do not remember me")}
                color='text.secondary'
                sx={{
                  mr: 0,
                  '& .MuiFormControlLabel-label': {
                    fontSize: '1rem',
                  },
                }}
              />
              </Tooltip>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 0,
            }}
          >
            <Typography variant="body2" color="textSecondary">
              <Link
                style={{ cursor: "pointer" }}
                underline="hover"
                onClick={() => navigate("/forgot-password", { replace: true })}
              >
                {t("Forgot password?")}
              </Link>
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2,
            }}
          >
            <Typography variant="body2" color="textSecondary">
              {t("Don't have an account?")}
              {" "}
              <Link
                style={{ cursor: "pointer" }}
                underline="hover"
                onClick={() => navigate("/signup")}
              >
                {t("Register now!")}
              </Link>
            </Typography>
          </Box>
          {config.oauth.federatedSigninProviders.length && (
            <Box>
              <Typography variant="body2" color="textSecondary"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  my: 3,
                }}
              >
                {t("or")}
              </Typography>
              <Typography variant="body2" color="textSecondary"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  my: 1,
                }}
              >
                {t("Sign in with a social account")}
              </Typography>
              <Box display="flex" flexDirection="row">
              {
                config.oauth.federatedSigninProviders.map((provider, index) => (  
                  <Button
                    key={provider}
                    startIcon={(
                      provider === "Google" ? <GoogleIcon sx={{ color: "red" }} /> :
                      provider === "Facebook" ? <FacebookIcon sx={{ color: "blue" }} /> :
                      <Icon sx={{ bgColor: "white", color: "red" }}>G</Icon>
                      // <></>
                    )}
                    sx={{
                      mr: index < (config.oauth.federatedSigninProviders.length - 1) ? 1 : 0,
                    }}
                    type={
                      provider === "Google" ? "socialAuthButtonGoogle" :
                      provider === "Facebook" ? "socialAuthButtonFacebook" :
                      ""
                    }
                    onClick={(e) => handleSocialLogin(e, provider)}
                  >
                    {provider}
                  </Button>
                ))
              }
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      {/* <DialogConfirm
        open={openDialog}
        onClose={handleCloseDialog}
        onCancel={handleCloseDialog}
        title={dialogTitle}
        message={dialogContent}
        cancelText={t("Close")}
      /> */}
    </form>
  );
}

export default React.memo(SignIn);
