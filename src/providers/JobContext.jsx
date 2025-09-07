import { createContext } from "react";
import { i18n } from "../i18n";

export const emailTemplate = {
  subject: i18n.t('Medicines prescription request'),
  body: i18n.t("Good morning, [DOCTOR NAME].<br />\
We require the prescription of this medicine for <i>[NAME OF THE PATIENT]</i>:<br />\
<br /> <b>[MEDICINE]</b><br /><br />\
Best regards.<br />\
--<br />\
<i>[NAME OF THE USER] &lt;[EMAIL OF THE USER]&gt;</i>\
"),
};

// export const initialJob = {
//   id: null, // to be set when creating a new job
//   patient: {},
//   doctor: {},
//   medicines: [],
//   emailTemplate: emailTemplate,
//   isActive: false,
//   isConfirmed: false,
//   currentStep: 0,
//   stepsCompleted: [false, false, false], // we currently have 3 steps in job flow
//   timestampCreation: 0, // TODO
//   timestampLastModification: 0, // TODO
// };

// export const initialJobsState = {
//   jobs: [],
//   currentJobId: null, // no job selected
// };

export const jobContext = { // TODO: ask AI what to include here in JobContext: why not jobs?
  //...initialJobsState,
  jobs: [],
  getJobById: () => {},
  //job: initialJobsState.jobs[initialJobsState.currentJobId],
  //stepsCompleted: [], //[false, false, false], // we currently have 3 steps in job flow
  setJobs: () => { },
  //setCurrentJobId: () => { },
  confirmJob: () => { },
  confirmJobsOnServer: () => { },
  resetJobs: () => { },
  jobIsCompleted: () => { },
  jobsConfirmedCount: () => { },
  //setJob: () => { },
  jobsError: null,
};

export const JobContext = createContext(jobContext);
