import { createContext } from "react";
import { i18n } from "../i18n";
import {
  validateJobPatientFirstName,
  validateJobPatientLastName,
  validateJobPatientEmail,
  validateJobDoctorName,
  validateJobDoctorEmail,
} from "../libs/Validation";

// Steps
export const steps = (isMobile = false) => [
  { id: 0, label: isMobile ? i18n.t("Patient & Doctor") : i18n.t("Patient & Doctor Info") },
  { id: 1, label: i18n.t("Medicines") },
    //{ id: 2, label: i18n.t('Email Template') }, // removing this step from main steps, it is moved to advanced tools
  { id: 2, label: i18n.t("Confirmation") },
];

// Patient fields
export const fieldsPatient = [
  {
    label: i18n.t("Patient first name"),
    key: "firstName",
    helpKey: "PatientFirstName",
    placeholder: "",
    isValid: validateJobPatientFirstName,
  },
  {
    label: i18n.t("Patient last name"),
    key: "lastName",
    helpKey: "PatientLastName",
    placeholder: "",
    isValid: validateJobPatientLastName,
  },
  {
    label: i18n.t("Patient email"),
    key: "email",
    helpKey: "PatientEmail",
    type: "email",
    placeholder: "info@mail.it",
    isValid: validateJobPatientEmail,
  },
];

// Doctor fields
export const fieldsDoctor = [
  {
    label: i18n.t("Doctor name"),
    key: "name",
    helpKey: "DoctorName",
    placeholder: i18n.t("Dr. ..."),
    isValid: validateJobDoctorName,
  },
  {
    label: i18n.t("Doctor email"),
    key: "email",
    helpKey: "DoctorEmail",
    placeholder: i18n.t("doc@studio-medico.it"),
    type: "email",
    isValid: validateJobDoctorEmail,
  },
];

// Job skeleton
export const jobSkeleton = {
  id: "new",
  patient: {},
  doctor: {},
  medicines: [],
  isActive: false,
  currentStep: 0,
  stepsCompleted: new Array(steps().length).fill(false),
  timestampCreation: 0,
  timestampLastModification: 0,
};

// Email template skeleton
export const emailTemplateSkeleton = {
  subject: i18n.t("Medicines prescription request"),
  body: i18n.t(
    "Good morning, [DOCTOR NAME].<br />\
We require the prescription of this medicine for <i>[NAME OF THE PATIENT]</i>:<br />\
<br /> <b>[MEDICINE]</b><br /><br />\
Best regards.<br />\
--<br />\
<i>[NAME OF THE USER] &lt;[EMAIL OF THE USER]&gt;</i>\
"
  ),
};

export const JobContext = createContext(undefined);
