import { createContext } from "react";

export const initialJob = {
  patient: {},
  doctor: {},
  medicines: [],
  emailTemplate: '',
  isConfirmed: false,
  currentStep: 0,
};

export const initialJobsState = {
  jobs: [initialJob],
  currentJobIndex: 0,
};

export const JobContext = createContext({
  jobs: initialJobsState.jobs,
  currentJobIndex: initialJobsState.currentJobIndex,
  job: initialJobsState.jobs[0],
  setJobs: () => {},
  setCurrentJobIndex: () => {},
  setJob: () => {},
  resetJobs: () => {},
  jobError: null,
});
