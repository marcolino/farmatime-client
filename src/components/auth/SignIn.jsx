import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
//import { useSnackbar } from "notistack";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import Icon from "@mui/material/Icon";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Person from "@mui/icons-material/Person";
import Lock from "@mui/icons-material/Lock";
//import { useSnackbar } from "../../providers/SnackbarManager";
import { useSnackbarContext } from "../../providers/SnackbarProvider"; 
import { TextField, TextFieldPassword, Button } from "../custom";
import { AuthContext } from "../../providers/AuthProvider";
import { validateEmail } from "../../libs/Validation";
import { apiCall }  from "../../libs/Network";
import config from "../../config";


function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const { /*setAuth, */signIn } = useContext(AuthContext);
  const { showSnackbar } = useSnackbarContext(); 
  const { t } = useTranslation();

  const handleSocialLogin = (event, provider) => {
    event.preventDefault(); // redirect fails without preventing default behaviour!
    //window.open(`${config.siteUrl}/api/auth/${provider.toLowerCase()}`, "_self"); // use "_self" to open social login page in this same window
    window.location.replace(`${config.siteUrl}/api/auth/${provider.toLowerCase()}`);
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
    });
    if (result.err) {
      showSnackbar(result.message, "error");
      setError({});
    } else {
      showSnackbar(t("Sign in successful"), "success");
      console.log("Email signin result:", result);
      signIn(result);
      // if (!rememberMe) { // to handle remember-me flag
      //   localStorage.clear();
      // }
      setEmail("");
      setPassword("");
      navigate("/", { replace: true });
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
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 1,
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
                      <Icon sx={{ backgroundColor: "white", color: "red" }}>G</Icon>
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
    </form>
  );
}

export default React.memo(SignIn);
