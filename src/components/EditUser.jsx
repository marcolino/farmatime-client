import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Container,
  Box,
  Typography,
  //Button,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { SectionHeader, TextField, TextFieldPhone, Select, Button } from "./custom";
import { apiCall } from "../libs/Network";
import { objectsAreEqual } from "../libs/Misc";
import { AuthContext } from "../providers/AuthProvider";
//import { useSnackbar } from "../providers/SnackbarManager";
import { useSnackbarContext } from "../providers/SnackbarProvider"; 
import CookieConsent from "./CookieConsent";
import NotificationPreferences from "./NotificationPreferences";
import {
  Person, Email, SupervisedUserCircle, PlaylistAddCheck,
  Payment, Business, LocationOn as LocationOnIcon
} from "@mui/icons-material";
import {
  isAdmin,
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePhone,
} from "../libs/Validation";
//import { i18n }  from "../i18n";
import config from "../config";


function EditUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState(false);
  const [userOriginal, setUserOriginal] = useState(false);
  const [error, setError] = useState({});
  const { auth, updateSignIn/*, setAuth*/ } = useContext(AuthContext);
  const { showSnackbar } = useSnackbarContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState(null);
  const [dialogContent, setDialogContent] = useState(null);
  const [dialogCallback, setDialogCallback] = useState(null);
  const { t } = useTranslation();

  const { userId, origin } = useParams();
  console.log("userId:", userId);
  console.log("origin:", origin);
  if (!userId) {
    showSnackbar(t("No user id specified", "error"));
    navigate(-1);
    return;
  }
  
  let profile = false;
  console.log("userId, auth.user?.id:", userId, auth.user?.id);
  if (userId === auth.user?.id) { // requested user id is the same as logged user id, so we are editing our own profile
    profile = true;
  }
  
  const [allRoles, setAllRoles] = useState(false);
  const [allPlans, setAllPlans] = useState(false);
  const [isChanged, setIsChanged] = useState({});

  const [updateReady, setUpdateReady] = useState(false); // to handle form values changes refresh
  //const [sameUserProfile, setSameUserProfile] = useState(false); // to know if profile is the logged user's
  
  useEffect(() => { // get all users on mount
    (async () => {
      const result = await apiCall("post", "/user/getUser", { userId });
      if (result.err) {
        showSnackbar(result.message, result.status === 401 ? "warning" : "error");
      } else {
        setUser(result.user);
        setUserOriginal(result.user);
      }
    })();
  }, [userId]);
  // empty dependency array: this effect runs once when the component mounts
  
  useEffect(() => {
    (async () => {
      const result = await apiCall("get", "/user/getAllRoles");
      if (result.err) {
        showSnackbar(result.message, "error");
      } else {
        setAllRoles(result.roles);
      }
    })();
  }, [t]);
  
  useEffect(() => {
    (async () => {
      const result = await apiCall("get", "/user/getAllPlans");
      if (result.err) {
        showSnackbar(result.message, "error");
      } else {
        setAllPlans(result.plans);
      }
    })();
  }, [t]);

  useEffect(() => {
    if (updateReady) {
      setUpdateReady(false);
      formSubmit();
    }
  }, [updateReady]);

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
      switch (response) {
        case "ERROR_PLEASE_SUPPLY_A_PHONE_NUMBER":
          err = t("Please supply a phone");
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
          const internationalPrefixZeroRegex = /(^00\s?)/;
          const internationalPrefixPlus = "+";
          oldPhone = user.phone;
          newPhone = oldPhone.replace(internationalPrefixZeroRegex, internationalPrefixPlus);
          setUser({ ...user, phone: newPhone });
          return true;
        default:
          err = response;
      }
      setError({ email: true });
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
  
  const setEmail = (value) => {
    setUser({ ...user, email: value });
    setIsChanged({ ...isChanged, email: value != userOriginal.email });
  };

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

  // const setProfileImage = (value) => {
  //   setUser({ ...user, profileImage: value });
  //   setIsChanged({ ...isChanged, profileImage: value != userOriginal.profileImage });
  // };

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
    //<CookieConsent onClose={handleCloseDialog} />
    handleOpenDialog(
      t("Cookies preferences"),
      <CookieConsent customizeOnly={true} onClose={handleCloseDialog} />,
      null,
    );
  };

  const openNotificationPreferences = () => {
    handleOpenDialog(
      "",
      <NotificationPreferences internalRouting="true" section="all" onClose={handleCloseDialog} />,
      null,
    );
  };

  const formSubmitBeforeUpdate = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setUpdateReady(true); // set this flag and the updateUser, since we can force some changes on user input fields
    setError({});
  }

  const formSubmit = (e) => {
    (async () => {
      console.log("*** user for update:", user);
      const result = await apiCall("post", "/user/updateUser", { userId, ...user });
      if (result.err) {
        showSnackbar(result.message, "error");
      } else {
        console.log("*** updateUser result:", result);
        //setAllPlans(result.plans);
        if (auth.user?.id === result.user._id) { // the user is the logged one
          // update user fields in auth
          const updatedUser = auth.user;
          updatedUser.email = result.user.email;
          updatedUser.firstName = result.user.firstName;
          updatedUser.lastName = result.user.lastName;
          updatedUser.roles = result.user.roles;
          updatedUser.plan = result.user.plan;
          //setAuth({ user: updatedUser });
          updateSignIn(updatedUser);
        }
        navigate(-1);
      }
    })();
    // updateUser({ userId, ...user }).then(data => {
    //   if (data.err) {
    //     console.warn("updateUser error:", data);
    //     showSnackbar(data.message, "warning");
    //     setError({});
    //     return;
    //   }
    //   console.log("updateUser success:", data.user);
      
    // }).catch(err => {
    //   console.error("updateUser error catched:", err);
    //   showSnackbar(err.message, "error");
    //   setError({}); // we can't blame some user input, it's a server side error
    // });
  };

  const formCancel = (e) => {
    e.preventDefault();
    setError({});
    navigate(-1);
  }
 
  const styleForChangedFields = (fieldName) => {
    const sx = { fontWeight: isChanged[fieldName] ? "bold" : "normal", };
    return {
      ...sx, // for standard fields
      input: sx, // for multiline fields
    };
  }
  
  if (user && allRoles && allPlans) {
    console.log("### allRoles ###", allRoles);
    console.log("### auth.user.roles ###", auth.user?.roles);
    return (
      <>
        <SectionHeader text={t("Users handling")}>
          {origin === "editUser" ? t("Edit user") : t("Edit profile")}
        </SectionHeader>
        
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

              <TextField
                id={"email"}
                value={user.email ?? ""}
                label={t("Email")}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("Email")}
                startIcon={<Email />}
                error={error.email}
                sx={styleForChangedFields("email")}
              />

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
                optionsDisabled={allRoles.map(role => role.priority > Math.max(...auth.user?.roles?.map(r => r.priority)))}
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
                  optionsDisabled={allPlans.map(role => !isAdmin(auth.user))}
                  multiple={false}
                  onChange={(e) => setPlan(e.target.value)}
                  placeholder={t("Plan")}
                  startIcon={<PlaylistAddCheck />}
                  error={error.plan}
                  sx={styleForChangedFields("plan")}
                />
              )}
              
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
              {/* <PlacesAutocomplete /> */}
              
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

              {/* <TextField
                id={"profileImage"}
                value={user.profileImage ?? ""}
                label={t("Profile image")}
                onChange={(e) => setProfileImage(e.target.value)}
                placeholder={t("Profile image")}
                startIcon={<PermIdentity />}
                error={error.profileImage}
                sx={styleForChangedFields("profileImage")}
              /> */}

              {profile &&
                <Button
                  onClick={openCookiesConsent}
                  fullWidth={true}
                  variant="contained"
                  color="default"
                  sx={{
                    mt: 1,
                  }}
                >
                  {t("Cookies preferences")}
                </Button>
              }

              {profile &&
                <Button
                  onClick={openNotificationPreferences}
                  fullWidth={true}
                  variant="contained"
                  color="default"
                  sx={{
                    mt: 1,
                  }}
                >
                  {t("Notification preferences")}
                </Button>
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
          {dialogTitle &&
            <DialogTitle id="alert-dialog-title">
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

export default React.memo(EditUser);
