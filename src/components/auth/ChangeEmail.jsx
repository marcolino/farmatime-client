import React, { useState, useContext } from "react";
import { useParams/*, useNavigate*/ } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";
import TextField from "../custom/TextField";
import Button from "../custom/Button";
import {
  ConfirmationNumber,
  Email,
} from "@mui/icons-material";
import { AuthContext } from "../../providers/AuthContext";
//import { useMediaQueryContext } from "../../providers/MediaQueryContext";
import { useSnackbarContext } from "../../hooks/useSnackbarContext"; 
import { useDialog } from "../../providers/DialogContext";
import { apiCall } from "../../libs/Network";
import { validateEmail } from "../../libs/Validation";
//import config from "../../config";

function ChangeEmail({ email }) {
  // const navigate = useNavigate();
  const { waitingForCode: waitingForCodeFromParams } = useParams();
  const { codeDeliveryMedium: codeDeliveryMediumFromParams } = useParams();
  // const { email: emailFromParams } = useParams();
  // const [email, setEmail] = useState(emailFromParams || "");
  const [emailNew, setEmailNew] = useState(email || "");
  const [waitingForCode, setWaitingForCode] = useState(waitingForCodeFromParams || false);
  const [codeDeliveryMedium, setCodeDeliveryMedium] = useState(codeDeliveryMediumFromParams || "");
  const [code, setCode] = useState("");
  const [error, setError] = useState({});
  const { showDialog } = useDialog();
  const { auth, updateSignedInUserLocally, /*signOut, cloneGuestUserPreferencesToAuthUser*/ } = useContext(AuthContext);
  const { showSnackbar } = useSnackbarContext();
  //const { isMobile } = useMediaQueryContext();
  const { t } = useTranslation();

  const { closeDialog } = useDialog();

  console.log("waitingForCodeFromParams, waitingForCode:", waitingForCodeFromParams, waitingForCode);
  console.log("codeDeliveryMediumFromParams, codeDeliveryMedium:", codeDeliveryMediumFromParams, codeDeliveryMedium);

  const validateForm = (params) => {
    let validation;

    // validate email formally
    if (!waitingForCode || params?.waitingForCodeResend) {
      validation = validateEmail(emailNew);
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
        showSnackbar(err, "warning");
        return false;
      }
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

  const formChangeEmail = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError({});

    const result = await apiCall("post", "/auth/changeEmail", {
      email,
      emailNew,
    });
    if (result.err) {
      switch (result.data?.code) {
        case "ACCOUNT_WAITING_FOR_VERIFICATION":
          setError({ email: true });
          //showSnackbar(result.message, "warning");
          showDialog({
            title: t("Account is waiting for verification"),
            message: result.data.message,
            confirmText: t("Ok"),
            onConfirm: () => {
              setWaitingForCode(true);
            },
          });
          break;
        case "EMAIL_EXISTS_ALREADY":
        case "ACCOUNT_DELETED":
          setError({ email: true });
          showSnackbar(result.message, "warning");
          break;
        default:
          setError({}); // we don't know whom to blame
          showSnackbar(result.message, "error");
      }
    } else {
      console.devAlert(`EMAIL CHANGE VERIFICATION CODE: ${result.code}`);
      setWaitingForCode(true);
      //setEmail("");
      const medium = result.codeDeliveryMedium;
      setCodeDeliveryMedium(medium);
      showDialog({
        title: t("Confirmation code sent by {{medium}}", { medium }),
        message: result.message,
        confirmText: t("Ok"),
      });
    }
  };
    
  const formChangeEmailVerification = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError({});

    const result = await apiCall("post", "/auth/changeEmailVerification", {
      emailNew,
      code,
    });
    if (result.err) {
      showSnackbar(result.message, "error");
      setError({ code: true });
    } else {
      setCode("");
      showDialog({
        title: t("Email changed successfully"),
        message: result.message,
        confirmText: t("Ok"),
        onConfirm: () => {
          const updatedUser = auth.user;
          updatedUser.email = emailNew;
          updateSignedInUserLocally({ user: updatedUser });
          closeDialog(); closeDialog(); // close 2 dialogs
        },
      });
    }
  };
  
  const formResendChangeEmailVerificationCode = async (e) => {
    e.preventDefault();
    if (!validateForm({ waitingForCodeResend: true })) return;
    setError({});

    const result = await apiCall("post", "/auth/resendChangeEmailVerificationCode", {
      email,
      emailNew,
    });
    if (result.err) {
      showSnackbar(result.message, "error");
      setError({ code: true });
    } else {
      console.devAlert(`CHANGE EMAIL VERIFICATION CODE: ${result.code}`);
      const medium = result.codeDeliveryMedium;
      setCodeDeliveryMedium(medium);
      showDialog({
        title: t("Confirmation code resent by {{medium}}", { medium }),
        message: result.message,
        confirmText: t("Ok"),
      });
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
          // mt: 6,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
            p: 2,
            // border: "1px solid",
            // borderColor: "primary.main",
            // borderRadius: 4,
          }}
        >
          {!waitingForCode && (
            <>
              <Typography variant="body1" color="textSecondary"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  my: 1,
                }}
              >
                {t("Change your email, and then confirm it")}
              </Typography>
              <TextField
                id={"email"}
                value={emailNew}
                onChange={(e) => setEmailNew(e.target.value)}
                placeholder={t("Email")}
                startIcon={<Email />}
                error={error.email}
              />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 2,
                  mt: 0,
                }}
              >
                <Button
                  type="button"
                  variant="outlined" 
                  onClick={closeDialog}
                  sx={{ mt: 1, textAlign: "center" }}
                >
                  {t("Cancel")}
                </Button>
                <Button
                  type="submit"
                  onClick={formChangeEmail}
                  sx={{ mt: 1, textAlign: "center" }}
                >
                  {t("Confirm")}
                </Button>
              </Box>
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
                {t("Verify Email Change")}
              </Typography>
              
              <TextField
                id={"changeEmailCode"}
                type="tel" /* tel type does not show arrows */
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t("Numeric code received by {{codeDeliveryMedium}}", {codeDeliveryMedium})}
                startIcon={<ConfirmationNumber />}
                error={error.code}
              />
              <Box m={1} />
              <Button
                type="submit"
                onClick={formChangeEmailVerification}
              >
                {t("Confirm")}
              </Button>
              <Button
                onClick={formResendChangeEmailVerificationCode}
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
    </form>
  );
}

export default React.memo(ChangeEmail);
