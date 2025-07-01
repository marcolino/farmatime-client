import { createContext } from "react";
import { i18n } from "../i18n";

const emailTemplate = {
  subject: i18n.t('Medicines prescription request'),
  body: i18n.t("\
Good morning, {DOCTOR NAME}.<br />\n\
We require the <i>prescription</i> of this medicine for <i>{FIRST AND LAST NAME OF THE PATIENT}</i>:<br />\n\
<b>{NAME OF THE MEDICINE}</b><br />\n\
Best regards.<br />\n\
--<br />\n\
<i>{FIRST AND LAST NAME OF THE USER} &lt;{EMAIL OF THE USER}&gt;</i>\
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
