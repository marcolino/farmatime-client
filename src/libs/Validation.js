import parsePhoneNumber from "libphonenumber-js";
import { i18n } from "../i18n";

export const isAdmin = (user) => {
  if (!user) {
    console.error("isAdmin: user is not set!");
    return false;
  }
  if (!user.roles) {
    console.error("isAdmin: user.roles is not set!");
    return false;
  }
  //return user?.roles?.includes("admin");
  return user?.roles?.some(role => role.priority >= 100);
};

export const validateFirstName = (firstName) => {
  const re = /.{2,}/;
  if (!String(firstName)) {
    return "ERROR_PLEASE_SUPPLY_A_FIRSTNAME";
  }
  if (!re.test(String(firstName).toLowerCase())) {
    return "ERROR_PLEASE_SUPPLY_A_VALID_FIRSTNAME";
  }
  return true;
};

export const validateLastName = (lastName) => {
  const re = /.{2,}/;
  if (!String(lastName)) {
    return "ERROR_PLEASE_SUPPLY_A_LASTNAME";
  }
  if (!re.test(String(lastName).toLowerCase())) {
    return "ERROR_PLEASE_SUPPLY_A_VALID_LASTNAME";
  }
  return true;
};

export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!String(email)) {
    return "ERROR_PLEASE_SUPPLY_AN_EMAIL";
  }
  if (!re.test(String(email).toLowerCase())) {
    return "ERROR_PLEASE_SUPPLY_A_VALID_EMAIL";
  }
  return true;
};

export const validatePhone = (phone) => {
  //const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //const phoneRegex = /^(\+?\d{1,3}\s?)|(^00\s?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/;
  const internationalPrefixRegex = /^(\+\d{1,3}\s?)|(^00\s?)/;
  const internationalPrefixZeroRegex = /(^00\s?)/;

  if (!phone) {
    return "ERROR_PLEASE_SUPPLY_A_PHONE";
  }
  // if (!phoneRegex.test(phone)) {
  //   return "ERROR_PLEASE_SUPPLY_A_VALID_PHONE";
  // }
  const phoneNumber = parsePhoneNumber(phone);
  if (phoneNumber && phoneNumber.isPossible() !== true) {
    return "ERROR_PLEASE_SUPPLY_A_VALID_PHONE";
  }
  if (!internationalPrefixRegex.test(phone)) {
    return "WARNING_NO_INTERNATIONAL_PREFIX";
  }
  if (internationalPrefixZeroRegex.test(phone)) {
    return "WARNING_ZERO_INTERNATIONAL_PREFIX";
  }
  return true;
};

export const validatePassword = (password, passwordConfirmed) => {
  // check for password presence
  if (!password) {
    return ["ERROR_PLEASE_SUPPLY_A_PASSWORD"];
  }

  // check password for minimum complexity
  const explanation = checkPassword(password);
  if (explanation !== null) {
    return ["ERROR_PLEASE_SUPPLY_A_MORE_COMPLEX_PASSWORD", explanation];
  }

  // check for password confirmed presence
  if (!passwordConfirmed) {
    return ["PLEASE_CONFIRM_THE_PASSWORD"];
  }

  // check password and password confirmed do match
  if (password !== passwordConfirmed) {
    return ["ERROR_THE_CONFIRMED_PASSWORD_DOES_NOT_MATCH_THE_PASSWORD"];
  }

  return [true];
};

/**
 * 
 * @param {string} password 
 * @returns null if passord passes complexity requirements
 *          a string (i18n'ed) to expain requirements
 */
const checkPassword = (password) => {
  /**
   * ^	                The password string will start this way
   * (?=.*[a-z])	      The string must contain at least one lowercase alphabetical character
   * (?=.*[A-Z])	      The string must contain at least one uppercase alphabetical character
   * (?=.*[0-9])	      The string must contain at least one numeric character
   * (?=.*[!@#$%^&*])	  The string must contain at least one special character,
   *                     but we are escaping reserved RegEx characters to avoid conflict
   * (?=.{8,})	        The string must be eight characters or longer
   */
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

  return re.test(String(password)) ? null : i18n.t("\
The password must contain at least:\n\
  - one lowercase alphabetical character,\n\
  - one uppercase alphabetical character,\n\
  - one numeric character,\n\
  - one special character,\n\
  - and a total of at least eight characters.\n\
");
}