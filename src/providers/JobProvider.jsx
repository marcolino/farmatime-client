import { useState, useEffect, useCallback, useContext } from "react";
import { JobContext, initialJob, initialJobsState } from "./JobContext";
import { useTranslation } from "react-i18next";
//import { useSecureStorage } from "../hooks/useSecureStorage";
//import { isEqual, debounce } from "lodash";
import { apiCall } from "../libs/Network";
import { AuthContext } from "../providers/AuthContext";
//import config from "../config";

export const JobProvider = ({ children }) => {
  //const { secureStorageStatus, secureStorageGet, secureStorageSet } = useSecureStorage();
  const { auth, updateSignedInUserLocally } = useContext(AuthContext);
  const { t } = useTranslation();

  // State for jobs array and current job index
  const [jobs, setJobs] = useState(initialJobsState.jobs);
  const [currentJobId, setCurrentJobId] = useState(initialJobsState.currentJobId);
  const [jobError, setJobError] = useState(null);

  // // Refs for last saved state to avoid redundant writes
  // const lastSavedStateRef = useRef({
  //   jobs: initialJobsState.jobs,
  //   currentJobId: initialJobsState.currentJobId,
  // });

  // // Debounced save function ref
  // const debouncedSaveRef = useRef(null);

  // Convenience getter for current job
  //const job = jobs.find(j => j.id === currentJobId) || initialJob;

  //console.log("initialJobsState.jobs:", initialJobsState.jobs);

  useEffect(() => {
    //if (auth?.user?.jobsData /*&& Array.isArray(auth.user.jobsData.jobs)*/ /*&& auth.user.jobs.length > 0*/) {
    if (auth?.user?.jobsData && Array.isArray(auth.user.jobsData.jobs) && auth.user.jobsData.jobs.length > 0) {
      setJobs(auth.user.jobsData.jobs);
      setCurrentJobId(auth.user.jobsData.currentJobId);
     } else {
      // Reset to initial state on logout
      setJobs(initialJobsState.jobs);
      setCurrentJobId(initialJobsState.currentJobId);
    }
  }, [auth?.user?.jobsData]); // rerun if the jobs array changes
  
  const setJob = useCallback( // TODO: updatedJobOrUpdater => updatedJob
    (updatedJobOrUpdater, id = currentJobId) => {
      setJobs((prevJobs) => {
        const newJobs = [...prevJobs];
        const prevJob = prevJobs[id];
        const newJob =
          typeof updatedJobOrUpdater === "function"
            ? updatedJobOrUpdater(prevJob)
            : updatedJobOrUpdater;
        const index = newJobs.findIndex(j => j.id === id);
        if (index !== -1) {
          newJobs[index] = newJob;
        } else {
          newJobs.push(newJob); // rare fallback, when/if prevJobs is empty (does not contain id)
        }
        return newJobs;
      });
    },
    [currentJobId]
  );

  // Send current job to server for encryption & storage
  const confirmJobsOnServer = async () => {
    if (!auth?.user?.id) {
      setJobError({ type: "auth", message: "User not logged in" });
      return false;
    }

    try {
      // POST job data to server API - server encrypts & stores
      const response = await apiCall("post", "/user/updateUserJobsData", {
        userId: auth.user.id,
        jobsData: { jobs, currentJobId },
      });
      if (response.err) {
        // Mark job as unconfirmed
        //setJob({ ...job, isActive: false, isConfirmed: false }, job.id);
        setJobError({ type: "auth", message: response.message || t("Error saving job on server") });
        return false;
      }

      // Update user's local state
      // const updatedUser = auth.user;
      // updatedUser.jobsData = { jobs, currentJobId };
      const updatedUser = { ...auth.user, jobsData: { jobs, currentJobId } };
      updateSignedInUserLocally(updatedUser);
      
      setJobError(null);
      return true;
    } catch (err) {
      setJobError({ type: "server", message: err.message || t("Failed to save job on server") });
      return false;
    }
  };
  
  // Add a new job
  const addJob = (newJob = null) => {
    setJobs((prevJobs) => {
      // Find the max id currently in jobs to generate a new unique id
      const maxId = prevJobs.reduce((max, job) => (job.id > max ? job.id : max), -1);
      const nextId = maxId + 1;

      // If no job provided, create a default one based on initialJob but with new id
      const jobToAdd = newJob
        ? { ...newJob, id: nextId }
        : { ...initialJob, id: nextId };

      const updatedJobs = [...prevJobs, jobToAdd];

      // Update currentJobId to the new job's id
      setCurrentJobId(nextId);

      return updatedJobs;
    });
  };

  const playPauseJob = (id) => { // Switch active status for jobId
    setJobs((prevJobs) => {
      return prevJobs.map((job) =>
        job.id === id
          ? { ...job, isActive: !job.isActive }
          : job
      );
    });
  }

  const removeJob = (idToRemove) => {
    setJobs((prevJobs) => {
      // Filter out the job to remove
      const filteredJobs = prevJobs.filter(job => job.id !== idToRemove);

      // if no job left, set at least initialJob
      if (filteredJobs.length === 0) {
        return initialJobsState.jobs;
      }

      // Reassign IDs to avoid holes: create new jobs array with sequential IDs starting from 0
      const reindexedJobs = filteredJobs.map((job, index) => ({
        ...job,
        id: index,
      }));

      // Update currentJobId accordingly
      setCurrentJobId((prevCurrentJobId) => {
        if (prevCurrentJobId === idToRemove) {
          // If the removed job was the current one, set to first job's id or 0 if none left
          return reindexedJobs.length > 0 ? 0 : 0;
        } else {
          // If currentJobId was after the removed id, shift it down by 1
          if (prevCurrentJobId > idToRemove) {
            return prevCurrentJobId - 1;
          }
          // Otherwise, keep it unchanged
          return prevCurrentJobId;
        }
      });

      return reindexedJobs;
    });
  };
  
  // Reset all jobs and current index to initial state
  const resetJobs = async () => {
    setJobs(initialJobsState.jobs);
    setCurrentJobId(initialJobsState.currentJobId);

    if (auth?.user) {
      const updatedUser = { ...auth.user, jobsData: initialJobsState };
      updateSignedInUserLocally(updatedUser); // updates AuthContext + localStorage

      try {
        await apiCall("post", "/user/updateUserJobsData", {
          userId: auth.user.id,
          jobsData: initialJobsState,
        });
      } catch (err) {
        setJobError({ type: "server", message: err.message || t("Failed to reset jobs on server") });
      }
    }
  };

  const jobsConfirmedCount = () => {
    //if (!Array.isArray(jobs)) return 0;
    console.log("💡 jobsConfirmedCount:", jobs ? jobs.filter(job => job.isConfirmed).length : 0);
    return jobs ? jobs.filter(job => job.isConfirmed).length : 0;
  };

  const jobIsValid = (id) => {
    // Check if all required fields are valid
    return jobs[id].stepsCompleted.every(Boolean);

    // const job = jobs[id];
    // return job && (
    //   // validateAllFields(fieldsPatient, job.patient) &&
    //   // validateAllFields(fieldsDoctor, job.doctor) &&
    //   job.isConfirmed ||
    //   job.medicines.some(med => med.name)
    // );
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        //setJobs,
        currentJobId,
        setCurrentJobId,
        //job,
        setJob,
        addJob,
        playPauseJob,
        removeJob,
        resetJobs,
        jobError,
        confirmJobsOnServer,
        jobsConfirmedCount,
        jobIsValid,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
