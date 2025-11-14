import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Container,
  Box,
  Typography,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  Person, Email, SupervisedUserCircle, PlaylistAddCheck,
  Payment, Business, PermIdentity, LocationOn as LocationOnIcon,
  AccountCircle
} from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField, TextFieldPhone, Select, Button } from "./custom";
import { SectionHeader1 } from "mui-material-custom";
import { apiCall } from "../libs/Network";
import { objectsAreEqual } from "../libs/Misc";
import { useDialog } from "../providers/DialogContext";
import { AuthContext } from "../providers/AuthContext";
import { useSnackbarContext } from "../hooks/useSnackbarContext"; 
import PreferencesCookie from "./PreferencesCookie";
import PreferencesNotification from "./PreferencesNotification";
import ChangeEmail from "./auth/ChangeEmail";
import {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePhone,
} from "../libs/Validation";
//import { i18n }  from "../i18n";
import config from "../config";


function UserEdit() {
  const navigate = useNavigate();
  const [user, setUser] = useState(false);
  const [userOriginal, setUserOriginal] = useState(false);
  const [error, setError] = useState({})
  //const [emailChanging, setEmailChanging] = useState(false);
  //const [emailNew, setEmailNew] = useState("");
  const { auth, updateSignedInUserLocally } = useContext(AuthContext);
  const { showSnackbar } = useSnackbarContext();
  const { showDialog } = useDialog();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState(null);
  const [dialogContent, setDialogContent] = useState(null);
  const [dialogCallback, setDialogCallback] = useState(null);
  const { t } = useTranslation();

  const { userId, origin } = useParams();
  let profile = false;
  if (userId === auth.user?.id) { // requested user id is the same as logged user id, so we are editing our own profile
    profile = true;
  }
  
  const [allRoles, setAllRoles] = useState(false);
  const [allPlans, setAllPlans] = useState(false);
  const [isChanged, setIsChanged] = useState({});

  const [updateReady, setUpdateReady] = useState(false); // to handle form values changes refresh
  //const [sameUserProfile, setSameUserProfile] = useState(false); // to know if profile is the logged user's
  
  const formSubmitBeforeUpdate = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setUpdateReady(true); // set this flag and the updateUser, since we can force some changes on user input fields
    setError({});
  }

  const formSubmit = useCallback(() => {
    (async () => {
      //console.log("*** user for update:", user);
      const result = await apiCall("post", "/user/updateUser", { userId, ...user });
      if (result.err) {
        showSnackbar(result.message, "error");
      } else {
        //console.log("*** updateUser result:", result);
        if (auth.user?.id === result.user._id) { // the user is the logged one
          // update user fields in local auth
          const updatedUser = auth.user;
          //updatedUser.email = result.user.email; // email can be changed in a dedicated component, auth/ChangeEmail
          updatedUser.firstName = result.user.firstName;
          updatedUser.lastName = result.user.lastName;
          updatedUser.roles = result.user.roles;
          updatedUser.plan = result.user.plan;
          //updateSignedInUserLocally(updatedUser);
          updateSignedInUserLocally({ user: updatedUser });
        }
        navigate("/", { replace: true });
      }
    })();
  }, [auth.user, navigate, showSnackbar, updateSignedInUserLocally, user, userId]);

  const formCancel = (e) => {
    e.preventDefault();
    setError({});
    navigate(-1);
  }
 
  useEffect(() => { // get all users on mount
    if (auth.user) {
      (async () => {
        const result = await apiCall("get", "/user/getUser", { userId });
        if (result.err) {
          showSnackbar(result.message, result.status === 401 ? "warning" : "error");
        } else {
          setUser(result.user);
          setUserOriginal(result.user);
        }
      })();
    }
  }, [auth.user, userId, showSnackbar]);
  // empty dependency array: this effect runs once when the component mounts
  
  useEffect(() => {
    if (auth.user) {
      (async () => {
        const result = await apiCall("get", "/user/getAllRoles");
        if (result.err) {
          showSnackbar(result.message, "error");
        } else {
          setAllRoles(result.roles);
        }
      })();
    }
  }, [t, auth.user, showSnackbar]);
  
  useEffect(() => {
    if (auth.user) {
      (async () => {
        const result = await apiCall("get", "/user/getAllPlans");
        if (result.err) {
          showSnackbar(result.message, "error");
        } else {
          setAllPlans(result.plans);
        }
      })();
    }
  }, [t, auth.user, showSnackbar]);

  useEffect(() => {
    if (updateReady) {
      setUpdateReady(false);
      formSubmit();
    }
  }, [updateReady, formSubmit]);

  const validateForm = () => {
    let response;

    // validate firstName formally
    response = validateFirstName(user.firstName);
    if (response !== true) {
      let err;
      switch (response) {
        case "ERROR_PLEASE_SUPPLY_A_FIRSTNAME":
          err = t("Please supply a first name");
          break;
        case "ERROR_PLEASE_SUPPLY_A_VALID_FIRSTNAME":
          err = t("Please supply a valid first name");
          break;
        default:
          err = response;
      }
      setError({ firstName: true });
      showSnackbar(err, "warning");
      return false;
    }

    // validate lastName formally
    response = validateLastName(user.lastName);
    if (response !== true) {
      let err;
      switch (response) {
        case "ERROR_PLEASE_SUPPLY_A_LASTNAME":
          err = t("Please supply a last name");
          break;
        case "ERROR_PLEASE_SUPPLY_A_VALID_LASTNAME":
          err = t("Please supply a valid last name");
          break;
        default:
          err = response;
      }
      setError({ lastName: true });
      showSnackbar(err, "warning");
      return false;
    }

    // validate email formally
    response = validateEmail(user.email);
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

    // validate phone formally, and format it according to standard format, if necessary
    response = validatePhone(user.phone);
    if (response !== true) {
      let err, oldPhone, newPhone;
      const internationalPrefixZeroRegex = /(^00\s?)/;
      const internationalPrefixPlus = "+";
      switch (response) {
        case "ERROR_PLEASE_SUPPLY_A_PHONE_NUMBER":
          err = t("Please supply a phone"); // accept empty phone number
          break;
        case "ERROR_PLEASE_SUPPLY_A_VALID_PHONE":
          err = t("Please supply a valid phone");
          break;
        case "WARNING_NO_INTERNATIONAL_PREFIX":
          oldPhone = user.phone;
          newPhone = `${config.locales[config.serverLocale].phonePrefix} ${oldPhone}`;
          setUser({ ...user, phone: newPhone });
          return true;
        case "WARNING_ZERO_INTERNATIONAL_PREFIX":
          oldPhone = user.phone;
          newPhone = oldPhone.replace(internationalPrefixZeroRegex, internationalPrefixPlus);
          setUser({ ...user, phone: newPhone });
          return true;
        default:
          err = response;
      }
      setError({ phone: true });
      showSnackbar(err, "warning");
      return false;
    }

    return true;
  };

  const setFirstName = (value) => {
    setUser({ ...user, firstName: value });
    setIsChanged({ ...isChanged, firstName: value != userOriginal.firstName });
  };

  const setLastName = (value) => {
    setUser({ ...user, lastName: value });
    setIsChanged({ ...isChanged, lastName: value != userOriginal.lastName });
  };
  
  /*
  const setEmail = (value) => {
    setUser({ ...user, email: value });
    setIsChanged({ ...isChanged, email: value != userOriginal.email });
  };
  */
  
  const setPhone = (value) => {
    setUser({ ...user, phone: value });
    setIsChanged({ ...isChanged, phone: value != userOriginal.phone });
  };

  const setRoles = (values) => {
    const roles = allRoles.filter(role => values.includes(role.name));
    setUser({ ...user, roles });
    setIsChanged({ ...isChanged, roles: !objectsAreEqual(values, userOriginal.roles.map(r => r.name)) });
  };

  const setPlan = (values) => {
    const plan = allPlans.find(plan => values === plan.name);
    setUser({ ...user, plan });
    setIsChanged({ ...isChanged, plan: !objectsAreEqual(values, userOriginal.plan.name) });
  };

  const setAddress = (value) => {
    setUser({ ...user, address: value });
    setIsChanged({ ...isChanged, address: value != userOriginal.address });
  };

  const setFiscalCode = (value) => {
    // allow only alphanumeric characters and convert to uppercase
    const filteredValue = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    setUser({ ...user, fiscalCode: filteredValue });
    setIsChanged({ ...isChanged, fiscalCode: filteredValue != userOriginal.fiscalCode });
  };
  
  const setBusinessName = (value) => {
    setUser({ ...user, businessName: value });
    setIsChanged({ ...isChanged, businessName: value != userOriginal.businessName });
  };

  const setProfileImage = (value) => {
    setUser({ ...user, profileImage: value });
    setIsChanged({ ...isChanged, profileImage: value != userOriginal.profileImage });
  };

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
  
  const openCookiesConsent = () => {
    handleOpenDialog(
      t("Cookies preferences"),
      <PreferencesCookie customizeOnly={true} onClose={handleCloseDialog} />,
      null,
    );
  };

  const openPreferencesNotification = () => {
    handleOpenDialog(
      t("Notification preferences"),
      <PreferencesNotification internalRouting="true" section="all" onClose={handleCloseDialog} />,
      null,
    );
  };

  const styleForChangedFields = (fieldName) => {
    const sx = { fontWeight: isChanged[fieldName] ? "bold" : "normal", };
    return {
      ...sx, // for standard fields
      input: sx, // for multiline fields
    };
  }

  /*
  const confirmEmailChange = () => {
    if (user.email === emailNew) {
      setEmailChanging(false);
      showSnackbar(t("Email unchanged"), "info");
    }

    showDialog({
      title: t("Email Change"),
      message: <EmailChange />,
      confirmText: null,
      // onConfirm: () => {
      //   emptyCartItems();
      //   navigate("/products");
      // },
      onConfirm: () => setEmailChanging(false),
      onCancel: () => setEmailChanging(false),
    });
    
    // TODO ...

    // if (ok) {
    // setEmailChanging(false);
    // }
  }
*/
  
  if (!userId) {
    showSnackbar(t("No user id specified", "error"));
    navigate(-1);
    return;
  }
  
  if (user && allRoles && allPlans) {
    return (
      <>
        <SectionHeader1 text={t("Users handling")}>
          <AccountCircle fontSize="large" /> {origin === "userEdit" ? t("Edit user") : t("Edit profile")}
        </SectionHeader1>
        
        <Container maxWidth="xs">
          <Box display="flex" flexDirection="column" gap={2}>
            <form noValidate autoComplete="off">
              
              <TextField
                autoFocus
                id={"firstName"}
                value={user.firstName ?? ""}
                label={t("First name")}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t("First Name")}
                startIcon={<Person />}
                error={error.firstName}
                sx={styleForChangedFields("firstName")}
              />

              {/* <Tooltip title={"test"}><span>
                <TextField />
              </span></Tooltip> */}

              <TextField
                id={"lastName"}
                value={user.lastName ?? ""}
                label={t("Last name")}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={t("Last Name")}
                startIcon={<Person />}
                error={error.lastName}
                sx={styleForChangedFields("lastName")}
              />

              <Stack direction="row" gap={1} alignItems="center">
                <TextField
                  id={"email"}
                  //value={!emailChanging ? (user.email ?? "") : emailNew}
                  value={user.email ?? ""}
                  label={t("Email")}
                  //readOnly={!emailChanging}
                  readOnly={true}
                  //disabled={!emailChanging}
                  disabled={true}
                  //onChange={(e) => emailChanging ? setEmailNew(e.target.value) : null}
                  placeholder={t("Email")}
                  startIcon={<Email />}
                  error={error.email}
                  sx={styleForChangedFields("email")}
                />
                {/*!emailChanging && ( */}
                  <Tooltip title={t("Change email, after code confirmation via email")}>
                    <Box>
                      <Button
                        onClick={() => {
                          showDialog({
                            title: t("Email Change"),
                            //message: <ChangeEmail email={user.email ?? ""} />,
                            message: () => <ChangeEmail email={user.email ?? ""} />,
                            //confirmText: null,
                            // onConfirm: () => {
                            //   emptyCartItems();
                            //   navigate("/products");
                            // },
                            //onConfirm: () => setEmailChanging(false),
                            //onCancel: () => setEmailChanging(false),
                          });
                        }}
                        variant="contained"
                        color="primary"
                        sx={{
                          flex: 1,
                          mt: 0.5,
                          // px: 1,
                          // pt: 1,
                          // pb: 1,
                          //mt: 0,
                          backgroundColor: "secondary.light",
                          flexShrink: 0,
                          whiteSpace: 'nowrap',
                          minWidth: 'auto'
                        }}
                      >
                        {t("Change")}
                      </Button>
                    </Box>
                  </Tooltip>
                {/*})}*/}
                {/*
                {emailChanging && (
                  <Tooltip title={t("Confirm new email, after code confirmation via email")}>
                    <Box>
                      <Button
                        onClick={() => {
                          showDialog({
                            title: t("Email Change"),
                            message: <ChangeEmail />,
                            //confirmText: null,
                            // onConfirm: () => {
                            //   emptyCartItems();
                            //   navigate("/products");
                            // },
                            //onConfirm: () => setEmailChanging(false),
                            //onCancel: () => setEmailChanging(false),
                          });
                        }}
                        //fullWidth={true}
                        variant="contained"
                        color="primary"
                        sx={{
                          flex: 1,
                          mt: 0.8,
                          // px: 1,
                          // //mt: 0,
                          backgroundColor: "secondary.main",
                          flexShrink: 0, whiteSpace: 'nowrap', minWidth: 'auto'
                        }}
                      >
                        {t("Confirm")}
                      </Button>
                    </Box>
                  </Tooltip>
                )}
                */}
              </Stack>
              
              <TextFieldPhone
                id={"phone"}
                value={user.phone ?? ""}
                label={t("Phone")}
                onChange={(value) => setPhone(value)}
                placeholder={t("Phone")}
                error={error.phone}
                sx={styleForChangedFields("phone")}
              />

              <Select
                id={"roles"}
                value={user.roles.sort((a, b) => b["priority"] - a["priority"]).map(role => (role.name ?? ""))}
                label={t("Roles")}
                options={allRoles.sort((a, b) => b["priority"] - a["priority"]).map(role => (role.name ?? ""))}
                optionsDisabled={
                  auth.user
                    ? allRoles.map(role =>
                        role.priority > Math.max(...(auth.user.roles?.map(r => r.priority) ?? []))
                      )
                    : true
                }
                multiple={true}
                onChange={(e) => setRoles(e.target.value)}
                placeholder={t("Roles")}
                startIcon={<SupervisedUserCircle />}
                error={error.roles}
                sx={styleForChangedFields("roles")}
              />
            
              {config.ui.usePlans && (
                <Select
                  id={"plan"}
                  //value={user ? user?.roles?.map(role => role.name) : []}
                  value={user.plan.name ?? ""}
                  label={t("Plan")}
                  options={allPlans.map(plan => plan.name)}
                  optionsDisabled={[]}
                  multiple={false}
                  onChange={(e) => setPlan(e.target.value)}
                  placeholder={t("Plan")}
                  startIcon={<PlaylistAddCheck />}
                  error={error.plan}
                  sx={styleForChangedFields("plan")}
                />
              )}
              
              {config.ui.useAddress && (
                <TextField
                  id={"address"}
                  value={user.address ?? ""}
                  label={t("Address")}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t("Address")}
                  startIcon={<LocationOnIcon />}
                  error={error.address}
                  sx={styleForChangedFields("address")}
                />
              )}

              {/* <PlacesAutocomplete /> */}
              
              {config.ui.useFiscalCode && (
                <TextField
                  id={"fiscalCode"}
                  value={user.fiscalCode ?? ""}
                  label={t("Fiscal code")}
                  onChange={(e) => setFiscalCode(e.target.value)}
                  placeholder={t("Tax Code or VAT Number")}
                  startIcon={<Payment />}
                  error={error.address}
                  inputProps={{ style: { textTransform: "uppercase" } }}
                  sx={styleForChangedFields("fiscalCode")}
                />
              )}

              {config.ui.useBusinessName && (
                <TextField
                  id={"businessName"}
                  value={user.businessName ?? ""}
                  label={t("Business name")}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder={t("Business name")}
                  startIcon={<Business />}
                  error={error.businessName}
                  sx={styleForChangedFields("businessName")}
                />
              )}

              {config.ui.useProfileImage && (
                <TextField
                  id={"profileImage"}
                  value={user.profileImage ?? ""}
                  label={t("Profile image")}
                  onChange={(e) => setProfileImage(e.target.value)}
                  placeholder={t("Profile image")}
                  startIcon={<PermIdentity />}
                  error={error.profileImage}
                  sx={styleForChangedFields("profileImage")}
                />
              )}

              {profile &&
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mt: 1,
                  }}
                >
                  <Button
                    onClick={openCookiesConsent}
                    fullWidth={true}
                    variant="contained"
                    color="default"
                    sx={{
                      flex: 1,
                      px: 1,
                      mt: 1,
                      backgroundColor: "secondary.light",
                    }}
                  >
                    {t("Cookies preferences")}
                  </Button>

                  <Button
                    onClick={openPreferencesNotification}
                    fullWidth={true}
                    variant="contained"
                    color="secondary.main"
                    sx={{
                      flex: 1,
                      px: 1,
                      mt: 1,
                      backgroundColor: "secondary.light",
                    }}
                  >
                   {t("Notification preferences")}
                  </Button>
                </Box>
              }
              
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end", // Aligns the buttons to the right
                  gap: 2, // Adds spacing between the buttons
                  mt: 2, // Optional: Add margin-top for spacing
                }}
              >
                <Button
                  onClick={formCancel}
                  fullWidth={false}
                  variant="contained"
                  color="secondary"
                >
                  {t("Cancel")}
                </Button>
                <Button
                  onClick={formSubmitBeforeUpdate}
                  variant="contained"
                  color="success"
                >
                  {t("Confirm")}
                </Button>
              </Box>
            </form>
          </Box>
        </Container>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {(dialogTitle) &&
            <DialogTitle id="alert-dialog-title"
              sx={{
                bgcolor: "primary.main", // theme color
                color: "primary.contrastText", // ensures text is readable
                fontWeight: "bold",
                _fontSize: "1.25rem",
                mb: 2,
              }}
            >
              {dialogTitle}
            </DialogTitle>
          }
          <DialogContent id="alert-dialog-description">
            <Typography component={"span"} variant="body1" sx={{whiteSpace: "pre-line"}}>
              {dialogContent}
            </Typography>
          </DialogContent>
          {!React.isValidElement(dialogContent) && ( // show buttons only if dialogContent is not a component
            <DialogActions>
              <Button
                onClick={handleCloseDialog}
                fullWidth={false}
                autoFocus
              >
                {t("Ok")}
              </Button>
            </DialogActions>
          )}
        </Dialog>
        
      </>
    );
  }
}

export default React.memo(UserEdit);
