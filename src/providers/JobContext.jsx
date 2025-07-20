import { createContext } from "react";
import { i18n } from "../i18n";

const emailTemplate = {
  subject: i18n.t('Medicines prescription request'),
  body: i18n.t("Good morning, [DOCTOR NAME].<br />\
We require the prescription of this medicine for <i>[NAME OF THE PATIENT]</i>:<br />\
<br /><b>[MEDICINE]</b><br /><br />\
Best regards.<br />\
--<br />\
<i>[NAME OF THE USER] &lt;[EMAIL OF THE USER]&gt;</i>\
"),
};

export const initialJob = {
  id: 0,
  patient: {},
  doctor: {},
  medicines: [],
  emailTemplate: emailTemplate,
  isConfirmed: false,
  currentStep: 0,
  stepsCompleted: [false, false, false],
  timestampCreation: 0, // TODO
  timestampLastModification: 0, // TODO
};

export const initialJobsState = {
  jobs: [initialJob],
  currentJobId: 0,
};

export const initialJobContext = {
  ...initialJobsState,
  job: initialJobsState.jobs[initialJobsState.currentJobId],
  stepsCompleted: initialJob.stepsCompleted,
  setJobs: () => {},
  setCurrentJobId: () => {},
  setJob: () => {},
  resetJobs: () => {},
  jobError: null,
  confirmJobsOnServer: () => {},
};

export const JobContext = createContext(initialJobContext);
