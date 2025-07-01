import { useState, useEffect, useRef, useCallback } from "react";
import { JobContext, initialJob, initialJobsState } from "./JobContext";
import { useSecureStorage } from "../hooks/useSecureStorage";
import { isEqual, debounce } from "lodash";

const storageKey = "jobs"; // TODO: to config

export const JobProvider = ({ children }) => {
  const { secureStorageStatus, secureStorageGet, secureStorageSet } = useSecureStorage();

  // State for jobs array and current job index
  const [jobs, setJobs] = useState(initialJobsState.jobs);
  const [currentJobIndex, setCurrentJobIndex] = useState(initialJobsState.currentJobIndex);
  const [jobError, setJobError] = useState(null);

  // Refs for last saved state to avoid redundant writes
  const lastSavedStateRef = useRef({
    jobs: initialJobsState.jobs,
    currentJobIndex: initialJobsState.currentJobIndex,
  });

  // Debounced save function ref
  const debouncedSaveRef = useRef(null);

  // Convenience getter for current job
  const job = jobs[currentJobIndex] || initialJob;

  // setJob updates the job at currentJobIndex or optionally at a passed index
  // const setJob = useCallback(
  //   (updatedJob, index = currentJobIndex) => {
  //     setJobs((prevJobs) => {
  //       const newJobs = [...prevJobs];
  //       newJobs[index] = updatedJob;
  //       return newJobs;
  //     });
  //   },
  //   [currentJobIndex]
  // );
  const setJob = useCallback(
  (updatedJobOrUpdater, index = currentJobIndex) => {
    setJobs((prevJobs) => {
      const newJobs = [...prevJobs];
      const prevJob = prevJobs[index];
      const newJob =
        typeof updatedJobOrUpdater === "function"
          ? updatedJobOrUpdater(prevJob)
          : updatedJobOrUpdater;
      newJobs[index] = newJob;
      return newJobs;
    });
  },
  [currentJobIndex]
);

  // Initialize debounced save function when storage is ready
  useEffect(() => {
    if (secureStorageStatus.status === "ready") {
      debouncedSaveRef.current = debounce(async (newState) => {
        try {
          await secureStorageSet(storageKey, newState);
          lastSavedStateRef.current = newState;
          console.log(">>> secureStorageSet (debounced & changed)");
        } catch (err) {
          console.error("Failed to save jobs state to secure storage:", err);
          setJobError({
            type: "store",
            message: err.message,
            code: err.code || null,
          });
        }
      }, 300);

      return () => {
        debouncedSaveRef.current.cancel();
      };
    }
  }, [secureStorageStatus, secureStorageSet]);

  // Load jobs and currentJobIndex on mount
  useEffect(() => {
    if (secureStorageStatus.status === "ready") {
      (async () => {
        try {
          const savedState = await secureStorageGet(storageKey);
          console.log("<<< secureStorageGet called");

          if (
            savedState &&
            Array.isArray(savedState.jobs) &&
            savedState.jobs.length > 0 &&
            typeof savedState.currentJobIndex === "number"
          ) {
            setJobs(savedState.jobs);
            setCurrentJobIndex(savedState.currentJobIndex);
            lastSavedStateRef.current = savedState;
          } else {
            console.info("Jobs not set yet");
            // throw (new Error("Error setting jobs!"));
          }
        } catch (err) {
          console.error("Failed to load jobs state from secure storage:", err);
           setJobError({
            type: "store",
            message: err.message,
            code: err.code || null,
          });
        }
      })();
    }
  }, [secureStorageStatus, secureStorageGet]);

  // Save jobs state on change (debounced + deduplicated)
  useEffect(() => {
    if (secureStorageStatus.status === "ready") {
      const newState = { jobs, currentJobIndex };
      if (!isEqual(newState, lastSavedStateRef.current)) {
        debouncedSaveRef.current(newState);
      }
    }
  }, [jobs, currentJobIndex, secureStorageStatus]);

  // Set jobError when it becomes "error"
  useEffect(() => {
    if (secureStorageStatus.status === "error") {
      if (secureStorageStatus.code !== 403) { // a code of 403 means the user is not logged in, so we don't want to show an error
        setJobError({
          type: "init",
          message: secureStorageStatus.error || "SecureStorage initialization failed",
          code: secureStorageStatus.code || null,
        });
      }
    }
  }, [secureStorageStatus]);
  
  // Reset all jobs and current index to initial state
  const resetJobs = () => {
    setJobs(initialJobsState.jobs);
    setCurrentJobIndex(initialJobsState.currentJobIndex);
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        setJobs,
        currentJobIndex,
        setCurrentJobIndex,
        job,
        setJob,
        resetJobs,
        jobError,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
