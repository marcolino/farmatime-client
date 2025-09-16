import parsePhoneNumber from "libphonenumber-js";
import { i18n } from "../i18n";

export const isAdmin = (user) => {
  if (!user) {
    console.info("isAdmin: user is not set");
    return false;
  }
  if (!user.roles) {
    console.info("isAdmin: user.roles is not set");
    return false;
  }
  return user.roles.some(role => role.priority >= 100);
};

export const isDealer = (user) => {
  if (!user) {
    console.info("isDealer: user is not set");
    return false;
  }
  if (!user.roles) {
    console.info("isDealer: user.roles is not set");
    return false;
  }
  return user.roles.some(role => role.priority >= 10);
};

export const isOperator = (user) => {
  if (!user) {
    console.info("isOperator: user is not set");
    return false;
  }
  if (!user.roles) {
    console.info("isOperator: user.roles is not set");
    return false;
  }
  return user.roles.some(role => role.priority >= 20);
};

export const validateFirstName = (value) => {
  const re = /.{2,}/;
  // if (!String(value)) {
  if (value == null) {
    return "ERROR_PLEASE_SUPPLY_A_FIRSTNAME";
  }
  if (!re.test(String(value).toLowerCase())) {
    return "ERROR_PLEASE_SUPPLY_A_VALID_FIRSTNAME";
  }
  return true;
};

export const validateLastName = (value) => {
  const re = /.{2,}/;
  // if (!String(value)) {
  if (value == null) {
    return "ERROR_PLEASE_SUPPLY_A_LASTNAME";
  }
  if (!re.test(String(value).toLowerCase())) {
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
  const internationalPrefixRegex = /^(\+\d{1,3}\s?)|(^00\s?)/;
  const internationalPrefixZeroRegex = /(^00\s?)/;

  if (!phone) {
    return "ERROR_PLEASE_SUPPLY_A_PHONE_NUMBER";
  }
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

  return re.test(String(password)) ? null : i18n.t(`\
The password must contain at least:
  - one lowercase alphabetical character,
  - one uppercase alphabetical character,
  - one numeric character,
  - one special character
  - and a total of at least eight characters.
`);
};

export const validateJobPatientFirstName = (value) => {
  const re = /.{2,}/;
  if (value == null) {
    return "ERROR_PLEASE_SUPPLY_A_FIRSTNAME";
  }
  if (!re.test(String(value).toLowerCase())) {
    return "ERROR_PLEASE_SUPPLY_A_VALID_FIRSTNAME";
  }
  return true;
}

export const validateJobPatientLastName = (value) => {
  const re = /.{2,}/;
  if (value == null) {
    return "ERROR_PLEASE_SUPPLY_A_LASTNAME";
  }
  if (!re.test(String(value).toLowerCase())) {
    return "ERROR_PLEASE_SUPPLY_A_VALID_LASTNAME";
  }
  return true;
}

export const validateJobPatientEmail = (jobDraft, value) => {
  const retval = validateEmail(value);
  // Check patient email is not the same as doctor's
  if (value && retval && (jobDraft.doctor?.email?.toLowerCase() === value?.toLowerCase())) {
    return "ERROR_PATIENT_AND_DOCTOR_EMAILS_CANNOT_BE_THE_SAME";
  }
  return retval;
}

export const validateJobDoctorName = (value) => {
  const re = /.{2,}/;
  if (value == null) {
    return "ERROR_PLEASE_SUPPLY_A_NAME";
  }
  if (!re.test(String(value).toLowerCase())) {
    return "ERROR_PLEASE_SUPPLY_A_VALID_NAME";
  }
  return true;
}

export const validateJobDoctorEmail = (jobDraft, value) => {
  const retval = validateEmail(value);
  // Check patient email is not the same as doctor's
  if (value && retval && (jobDraft.patient?.email?.toLowerCase() === value?.toLowerCase())) {
    return "ERROR_PATIENT_AND_DOCTOR_EMAILS_CANNOT_BE_THE_SAME";
  }
  return retval;
}

export const validateAllFields = (jobDraft, fields, data) => {
  if (!data) return false;
  let valid = true;
  fields.forEach(field => {
    if (field.isValid(jobDraft, data[field.key]) !== true) {
      valid = false;
      return; // break forEach loop
    }
  });
  return valid;
};

// Helper to turn error codes into messages
export const mapErrorCodeToMessage = (code) => {
  switch (code) {
    case "ERROR_PLEASE_SUPPLY_A_FIRSTNAME":
      return i18n.t("Please supply a first name");
    case "ERROR_PLEASE_SUPPLY_A_VALID_FIRSTNAME":
      return i18n.t("Please supply a valid first name");
    case "ERROR_PLEASE_SUPPLY_A_LASTNAME":
      return i18n.t("Please supply a last name");
    case "ERROR_PLEASE_SUPPLY_A_VALID_LASTNAME":
      return i18n.t("Please supply a valid last name");
    case "ERROR_PLEASE_SUPPLY_AN_EMAIL":
      return i18n.t("Please supply an email");
    case "ERROR_PLEASE_SUPPLY_A_VALID_EMAIL":
      return i18n.t("Please supply a valid email");
    case "ERROR_PLEASE_SUPPLY_A_NAME":
      return i18n.t("Please supply a name");
    case "ERROR_PLEASE_SUPPLY_A_VALID_NAME":
      return i18n.t("Please supply a valid name");
    case "ERROR_PLEASE_SUPPLY_A_PHONE_NUMBER":
      return i18n.t("Please supply a phone number");
    case "ERROR_PLEASE_SUPPLY_A_VALID_PHONE":
      return i18n.t("Please supply a valid phone number");
    case "ERROR_PATIENT_AND_DOCTOR_EMAILS_CANNOT_BE_THE_SAME":
      return i18n.t("Patient and doctor emails cannot be the same");
    case "WARNING_NO_INTERNATIONAL_PREFIX":
      return true;
    case "WARNING_ZERO_INTERNATIONAL_PREFIX":
      return true;
    default:
      return i18n.t("Invalid input");
  }
};
