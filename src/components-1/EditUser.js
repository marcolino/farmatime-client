import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { usePromiseTracker } from "react-promise-tracker";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/styles";
import { Grid, Container, Box } from "@material-ui/core";
import {
  Person, Email, Phone, SupervisedUserCircle, PlaylistAddCheck,
  Payment, Business, LocationOn as LocationOnIcon
} from "@material-ui/icons";
import { FormTitle, FormInput, FormPhoneInput, FormSelect, FormButton, FormText } from "./FormElements";
import { getUser, updateUser, getAllRoles, getAllPlans } from "../libs/Fetch";
//import { mergeObjects } from "../libs/Misc";
import { toast } from "./Toast";
import { AuthContext } from "../providers/AuthProvider";
import {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePhone,
} from "../libs/Validation";
import config from "../config";

const styles = theme => ({
  fieldset: {
    border: 0,
  },
});
const useStyles = makeStyles((theme) => (styles(theme)));



function EditUser(props) {
  const classes = useStyles();
  const history = useHistory();
  const userId = props?.match?.params?.userId;
  const [user, setUser] = useState(false);
  const [error, setError] = useState({});
  const { auth, setAuth } = useContext(AuthContext);
  const { promiseInProgress } = usePromiseTracker({delay: config.spinner.delay});
  const { t } = useTranslation();
  // const apiKey = process.env.REACT_APP_GEOAPIFY_API_KEY;

  const [allRoles, setAllRoles] = React.useState(false);
  const [allPlans, setAllPlans] = React.useState(false);
    
  const [updateReady, setUpdateReady] = useState(false); // to handle form values changes refresh

  if (!userId) {
    toast.error(t("No user id specified"));
    history.goBack();
    return;
  }

  useEffect(() => {
    if (updateReady) {
      setUpdateReady(false);
      formSubmit();
    }
  }, [updateReady]);

  useEffect(() => {
    getAllRoles().then((data) => {
      if (!data.ok) {
        console.warn("getAllRoles error:", data);
        if (data.message) {
          toast.error(t(data.message)); 
        }
        return;
      }
      //console.info("getAllRoles data:", data);
      setAllRoles(data.roles);
      console.log("getAllRoles success:", data);
    });
  }, [t]);

  useEffect(() => {
    getAllPlans().then((data) => {
      if (!data.ok) {
        console.warn("getAllPlans error:", data);
        if (data.message) {
          toast.error(t(data.message)); 
        }
        return;
      }
      //console.info("getAllPlans data:", data);
      setAllPlans(data.plans);
      console.log("getAllPlans success:", data);
    });
  }, [t]);

  useEffect(() => {
    getUser({ userId }).then((data) => {
      if (!data.ok) {
        console.warn("getUser error:", data);
        if (data.message) {
          toast.error(t(data.message)); 
        }
        return;
      }
      //toast.info(`${data.user.firstName} ${data.user.lastName} loaded`);
      setUser(data.user);
      console.log("getUser success:", data);
    });
  }, [t]);

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
      toast.warning(err);
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
      toast.warning(err);
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
      toast.warning(err);
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
      toast.warning(err);
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
    // console.log("handleRolesChange values:", values);
    const roles = allRoles.filter(role => values.includes(role.name));
    // console.log("handleRolesChange roles:", roles);
    setUser({ ...user, roles });
  };

  const setPlan = (value) => {
    // console.log("handlePlanChange value:", value);
    const plan = allPlans.find(plan => value === plan.name);
    // console.log("handlePlanChange plan:", plan);
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
    updateUser({ userId, ...user }).then(data => {
      if (!data.ok) {
        console.warn("updateUser error:", data);
        toast.error(t(data.message));
        setError({});
        return;
      }
      console.log("updateUser success:", data.user);

/**
 * TODO: check why these fields are in auth, and if they are really needed:
 *  - phone
 *  - ok
 * and check plan (which is {supportTypes: Array(1), _id: '66b385bbb1f43bf477a6d6a1', name: 'free', priceCurrency: 'EUR', pricePerYear: 0})
 * and roles (which is ['admin'])
 */
      
      if (auth.user.id === data.user._id) { // the user is the logged one
        // update user fields in auth
        const updatedUser = auth.user;
        updatedUser.email = data.user.email;
        updatedUser.firstName = data.user.firstName;
        updatedUser.lastName = data.user.lastName;
        console.log(" *** updated user ***:", data.user);
        setAuth({ user: updatedUser });
      }

      history.goBack();
    }).catch(err => {
      console.error("updateUser error catched:", err);
      toast.error(t(err.message));
      setError({}); // we can't blame some user input, it's a server side error
    });
  };

  const formCancel = (e) => {
    e.preventDefault();
    setError({});
    history.goBack();
  }

  // const resetForm = () => {
  //   set
  //   setFirstName("");
  //   setEmail("");
  // }

  // function onPlaceSelect(value) {
  //   console.log("onPlaceSelect:", value);
  // }

  // function onSuggectionChange(value) {
  //   console.log("onSuggectionChange:", value);
  // }
 
  if (!user) {
    return (
      <p> loading user... </p>
    );
  }
  if (!allRoles) {
    return (
      <p> loading all roles... </p>
    );
  }
  if (!allPlans) {
    return (
      <p> loading all plans... </p>
    );
  }
  
  return (
    <>
      <FormTitle>
        {t("Edit user")}
      </FormTitle>

      <Container maxWidth="xs">

        <form className={classes.form} noValidate autoComplete="off">
          <fieldset disabled={promiseInProgress} className={classes.fieldset}>

            <Box m={2} />

            <FormInput
              autofocus
              id={"firstName"}
              value={user.firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t("First Name")}
              startAdornmentIcon={<Person />}
              error={error.firstName}
            />

            <FormInput
              id={"lastName"}
              value={user.lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t("Last Name")}
              startAdornmentIcon={<Person />}
              error={error.lastName}
            />

            <FormInput
              id={"email"}
              value={user.email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("Email")}
              startAdornmentIcon={<Email />}
              error={error.email}
            />

            <FormPhoneInput
              id={"phone"}
              value={user.phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("Phone")}
              startAdornmentIcon={<Phone />}
              error={error.phone}
            />

            <FormSelect
              id={"roles"}
              //value={user ? user?.roles?.map(role => role.name) : []}
              value={user.roles.map(role => role.name)}
              options={allRoles.map(role => role.name)}
              multiple={true}
              onChange={(e) => setRoles(e.target.value)}
              placeholder={t("Roles")}
              startAdornmentIcon={<SupervisedUserCircle />}
              error={error.roles}
            />
          
            {config.ui.usePlans && (
              <FormSelect
                id={"plan"}
                //value={user ? user?.roles?.map(role => role.name) : []}
                value={user.plan.name}
                options={allPlans.map(plan => plan.name)}
                multiple={false}
                onChange={(e) => setPlan(e.target.value)}
                placeholder={t("Plan")}
                startAdornmentIcon={<PlaylistAddCheck />}
                error={error.plan}
              />
            )}
            
            <FormInput
              id={"address"}
              value={user.address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t("Address")}
              startAdornmentIcon={<LocationOnIcon />}
              error={error.address}
            />
            {/* <PlacesAutocomplete /> */}
            
            <FormInput
              id={"fiscalCode"}
              value={user.fiscalCode}
              onChange={(e) => setFiscalCode(e.target.value)}
              placeholder={t("Tax Code or VAT Number")}
              startAdornmentIcon={<Payment />}
              error={error.address}
            />

            <FormInput
              id={"businessName"}
              value={user.businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder={t("Business name")}
              startAdornmentIcon={<Business />}
              error={error.businessName}
            />

            {/* <FormInput
              id={"profileImage"}
              value={user.profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              placeholder={t("Profile image")}
              startAdornmentIcon={<PermIdentity />}
              error={error.profileImage}
            /> */}
  
            <Box m={2} />

            <FormButton
              onClick={formSubmitBeforeUpdate}
            >
              {t("Confirm")}
            </FormButton>

            <Grid container justifyContent="flex-end">
              <FormButton
                onClick={formCancel}
                fullWidth={false}
                className={"buttonSecondary"}
              >
                {t("Cancel")}
              </FormButton>
              </Grid>

          </fieldset>
        </form>

      </Container>
    </>
  );
}

export default React.memo(EditUser);
