import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Container,
  Box,
  Button,
} from "@mui/material";
import SectionHeader from "./custom/SectionHeader";
import TextField from "./custom/TextField";
import TextFieldPhone from "./custom/TextFieldPhone";
import Select from "./custom/Select";
import { apiCall } from "../libs/Network";
import { AuthContext } from "../providers/AuthProvider";
//import { useSnackbar } from "../providers/SnackbarManager";
import { useSnackbarContext } from "../providers/SnackbarProvider"; 
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
import { i18n }  from "../i18n";
import config from "../config";


function EditUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState(false);
  const [error, setError] = useState({});
  const { auth, setAuth } = useContext(AuthContext);
  const { showSnackbar } = useSnackbarContext(); 
  const { t } = useTranslation();

  const { userId, origin } = useParams();
  console.log("userId:", userId);
  console.log("origin:", origin);
  if (!userId) {
    showSnackbar(t("No user id specified", "error"));
    navigate(-1);
    return;
  }
  
  const [allRoles, setAllRoles] = useState(false);
  const [allPlans, setAllPlans] = useState(false);
    
  const [updateReady, setUpdateReady] = useState(false); // to handle form values changes refresh
  //const [sameUserProfile, setSameUserProfile] = useState(false); // to know if profile is the logged user's
  
  useEffect(() => { // get all users on mount
    (async() => {
      const result = await apiCall("post", "/user/getUser", { userId });
      if (result.err) {
        if (result.status === 401) alert("401 !!!"); // TODO: check if really we have to care about 401 here...
        showSnackbar(result.message, result.status === 401 ? "warning" : "error");
      } else {
        setUser(result.user);
        // if (result.user._id === userId) {
        //   setSameUserProfile(true);
        // }
      }
    })();
  }, [userId]);
  // empty dependency array: this effect runs once when the component mounts
  
  useEffect(() => {
    (async() => {
      const result = await apiCall("get", "/user/getAllRoles");
      if (result.err) {
        showSnackbar(result.message, "error");
      } else {
        setAllRoles(result.roles);
      }
    })();
  }, [t]);
  
  useEffect(() => {
    (async() => {
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
      setError({ firstName: err });
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
      setError({ lastName: err });
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
      setError({ email: err });
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
          newPhone = `${config.i18n.phonePrefix} ${oldPhone}`;
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
      setError({ email: err });
      showSnackbar(err, "warning");
      return false;
    }

    return true;
  };

  const setFirstName = (value) => {
    setUser({ ...user, firstName: value });
  };

  const setLastName = (value) => {
    setUser({ ...user, lastName: value });
  };
  
  const setEmail = (value) => {
    setUser({ ...user, email: value });
  };

  const setPhone = (value) => {
    setUser({ ...user, phone: value });
  };

  const setRoles = (values) => {
    const roles = allRoles.filter(role => values.includes(role.name));
    setUser({ ...user, roles });
  };

  const setPlan = (value) => {
    const plan = allPlans.find(plan => value === plan.name);
    setUser({ ...user, plan });
  };

  const setAddress = (value) => {
    setUser({ ...user, address: value });
  };

  const setFiscalCode = (value) => {
    setUser({ ...user, fiscalCode: value });
  };
  
  const setBusinessName = (value) => {
    setUser({ ...user, businessName: value });
  };

  // const setProfileImage = (value) => {
  //   setUser({ ...user, profileImage: value });
  // };

  const formSubmitBeforeUpdate = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setUpdateReady(true); // set this flag and the updateUser, since we can force some changes on user input fields
    setError({});
  }

  const formSubmit = (e) => {
    (async () => {
      const result = await apiCall("post", "/user/updateUser", { userId, ...user });
      if (result.err) {
        showSnackbar(result.message, "error");
      } else {
        setAllPlans(result.plans);
        // TODO: put the following code in a function, used also in signIn, for sure...
        if (auth.user.id === result.user._id) { // the user is the logged one
          // update user fields in auth
          const updatedUser = auth.user;
          updatedUser.email = result.user.email;
          updatedUser.firstName = result.user.firstName;
          updatedUser.lastName = result.user.lastName;
          console.log(" *** updated user ***:", result.user);
          setAuth({ user: updatedUser });
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

/**
 * TODO: check why these fields are in auth, and if they are really needed:
 *  - phone
 *  - ok
 * and check plan (which is {supportTypes: Array(1), _id: '66b385bbb1f43bf477a6d6a1', name: 'free', priceCurrency: 'EUR', pricePerYear: 0})
 * and roles (which is ['admin'])
 */
      
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
 
  // TODO: do something better, to check for data is present... :-/
  if (!user || !allRoles || !allPlans) {
    return (
      <p> loading... </p>
    );
  }
  
  return (
    <>
      <SectionHeader text={t("Users handling")}>
        {origin === "editUser" ? t("Edit user") :  t("Edit profile")}
      </SectionHeader>

      <Container maxWidth="xs">
        <form noValidate autoComplete="off">
          <TextField
            autoFocus
            id={"firstName"}
            value={user.firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder={t("First Name")}
            startIcon={<Person />}
            error={error.firstName}
          />

          <TextField
            id={"lastName"}
            value={user.lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder={t("Last Name")}
            startIcon={<Person />}
            error={error.lastName}
          />

          <TextField
            id={"email"}
            value={user.email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("Email")}
            startIcon={<Email />}
            error={error.email}
          />

          <TextFieldPhone
            id={"phone"}
            value={user.phone}
            onChange={(value) => setPhone(value)}
            placeholder={t("Phone")}
            error={error.phone}
          />

          <Select
            id={"roles"}
            //value={user ? user?.roles?.map(role => role.name) : []}
            value={user.roles.sort((a, b) => b["priority"] - a["priority"]).map(role => t(role.name))}
            options={allRoles.sort((a, b) => b["priority"] - a["priority"]).map(role => role.name)}
            optionsDisabled={allRoles.map(role => role.priority > auth.user.roles[0].priority)}
            multiple={true}
            onChange={(e) => setRoles(e.target.value)}
            placeholder={t("Roles")}
            startIcon={<SupervisedUserCircle />}
            error={error.roles}
          />
        
          {config.ui.usePlans && (
            <Select
              id={"plan"}
              //value={user ? user?.roles?.map(role => role.name) : []}
              value={t(user.plan.name)}
              options={allPlans.map(plan => plan.name)}
              optionsDisabled={allPlans.map(role => !isAdmin(auth.user))}
              multiple={false}
              onChange={(e) => setPlan(e.target.value)}
              placeholder={t("Plan")}
              startIcon={<PlaylistAddCheck />}
              error={error.plan}
            />
          )}
          
          <TextField
            id={"address"}
            value={user.address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={t("Address")}
            startIcon={<LocationOnIcon />}
            error={error.address}
          />
          {/* <PlacesAutocomplete /> */}
          
          <TextField
            id={"fiscalCode"}
            value={user.fiscalCode}
            onChange={(e) => setFiscalCode(e.target.value)}
            placeholder={t("Tax Code or VAT Number")}
            startIcon={<Payment />}
            error={error.address}
            inputProps={{ style: { textTransform: "uppercase" } }}
          />

          <TextField
            id={"businessName"}
            value={user.businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder={t("Business name")}
            startIcon={<Business />}
            error={error.businessName}
          />

          {/* <TextField
            id={"profileImage"}
            value={user.profileImage}
            onChange={(e) => setProfileImage(e.target.value)}
            placeholder={t("Profile image")}
            startIcon={<PermIdentity />}
            error={error.profileImage}
          /> */}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end', // Aligns the buttons to the right
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
      </Container>
    </>
  );
}

export default React.memo(EditUser);
