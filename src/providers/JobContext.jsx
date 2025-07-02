import { createContext } from "react";
import { i18n } from "../i18n";

const emailTemplate = {
  subject: i18n.t('Medicines prescription request'),
  body: i18n.t("Good morning, [DOCTOR NAME].<br />\
We require the prescription of this medicine for <i>[FIRST AND LAST NAME OF THE PATIENT]</i>:<br />\
<br /><b>[NAME OF THE MEDICINE]</b><br /><br />\
Best regards.<br />\
--<br />\
<i>[FIRST AND LAST NAME OF THE USER] &lt;[EMAIL OF THE USER]&gt;</i>\
"),
};

export const initialJob = {
  patient: {},
  doctor: {},
  medicines: [],
  emailTemplate: emailTemplate,
  isConfirmed: false,
  currentStep: 0,
  stepsCompleted: [false, false, false],
};

export const initialJobsState = {
  jobs: [initialJob],
  currentJobIndex: 0,
};

export const JobContext = createContext({
  jobs: initialJobsState.jobs,
  currentJobIndex: initialJobsState.currentJobIndex,
  job: initialJobsState.jobs[0],
  stepsCompleted: initialJobsState.stepsCompleted,
  setJobs: () => {},
  setCurrentJobIndex: () => {},
  setJob: () => {},
  resetJobs: () => {},
  jobError: null,
});
