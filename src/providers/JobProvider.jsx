import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { JobContext, initialJob, initialJobsState } from "./JobContext";
import { useSecureStorage } from "../hooks/useSecureStorage";
import { isEqual, debounce } from "lodash";
import { AuthContext } from "../providers/AuthContext";
//import config from "../config";

export const JobProvider = ({ children }) => {
  const { secureStorageStatus, secureStorageGet, secureStorageSet } = useSecureStorage();
  const { auth } = useContext(AuthContext);

  // State for jobs array and current job index
  const [jobs, setJobs] = useState(initialJobsState.jobs);
  const [currentJobId, setCurrentJobId] = useState(initialJobsState.currentJobId);
  const [jobError, setJobError] = useState(null);

  // Refs for last saved state to avoid redundant writes
  const lastSavedStateRef = useRef({
    jobs: initialJobsState.jobs,
    currentJobId: initialJobsState.currentJobId,
  });

  // Debounced save function ref
  const debouncedSaveRef = useRef(null);

  // Convenience getter for current job
  const job = jobs.find(j => j.id === currentJobId) || initialJob;

  const setJob = useCallback(
    (updatedJobOrUpdater, id = currentJobId) => {
      setJobs((prevJobs) => {
        const newJobs = [...prevJobs];
        const prevJob = prevJobs[id];
        const newJob =
          typeof updatedJobOrUpdater === "function"
            ? updatedJobOrUpdater(prevJob)
            : updatedJobOrUpdater;
        newJobs[id] = newJob;
        return newJobs;
      });
    },
    [currentJobId]
  );

  useEffect(() => {
    console.log("*** jobs:", jobs);
    console.log("*** currentJobId:", currentJobId);
    console.log("*** auth?.user?.id:", auth?.user?.id);
  }, [jobs, currentJobId, auth?.user?.id]),
    
  // Initialize debounced save function when storage is ready
  useEffect(() => {
    if (secureStorageStatus.status === "ready") {
      debouncedSaveRef.current = debounce(async (newState) => {
        try {
          await secureStorageSet(auth?.user?.id ?? "0"/*config.ui.jobs.storageKey*/, newState);
          lastSavedStateRef.current = newState;
          console.log(">>> secureStorageSet (debounced & changed)");
        } catch (err) {
          console.error("Failed to set jobs state to secure storage:", err);
          setJobError({
            type: "store",
            message: err.message,
            code: err.code || null,
          });
        }
      }, 500); // Debounce by half a second

      return () => {
        debouncedSaveRef.current.cancel();
      };
    }
  }, [secureStorageStatus, secureStorageSet, auth?.user?.id]);

  // Load jobs data on mount
  useEffect(() => {
    if (secureStorageStatus.status === "ready") {
      (async () => {
        try {
          const savedState = await secureStorageGet(auth?.user?.id ?? "0"/*config.ui.jobs.storageKey*/);
          console.log("<<< secureStorageGet called");

          if (
            savedState &&
            Array.isArray(savedState.jobs) &&
            savedState.jobs.length > 0 //&&
            //typeof savedState.currentJobId === "number" // it should ALWAYS be a number
          ) {
            setJobs(savedState.jobs);
            setCurrentJobId(savedState.currentJobId);
            lastSavedStateRef.current = savedState;
          } else {
            console.info("Jobs not set yet");
            // throw (new Error("Error setting jobs!"));
          }
        } catch (err) {
          console.error("Failed to get jobs state from secure storage:", err.message);
          setJobError({
            type: "store",
            message: err.message,
            code: err.code || null,
          });
        } finally {
          //setisJobHydrating(false);
        }
      })();
    }
  }, [secureStorageStatus, secureStorageGet, auth?.user?.id]);

  // Save jobs state on change (debounced + deduplicated)
  useEffect(() => {
    if (secureStorageStatus.status === "ready") {
      const newState = { jobs, currentJobId };
      if (!isEqual(newState, lastSavedStateRef.current)) {
        debouncedSaveRef.current(newState);
      }
    }
  }, [jobs, currentJobId, secureStorageStatus]);

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
      //setisJobHydrating(false); // stop hydration even on failure
    }
  }, [secureStorageStatus]);
  
  // A function to dectect "empty" jobs
  const isJobEmpty = (job) => {
    if (!job) {
      return true;
    }
    return (
      job.id !== 0 && // first job must never be deleted, it's a placeholder
      Object.keys(job.patient || {}).length === 0 &&
      Object.keys(job.doctor || {}).length === 0 &&
      Array.isArray(job.medicines) && (job.medicines.length === 0)
    );
  };

  // // Remove "empty" jobs
  // useEffect(() => {
  //   const nonEmptyJobs = jobs.filter(job => !isJobEmpty(job));

  //   if (nonEmptyJobs.length !== jobs.length) {
  //     // If some jobs were removed, update jobs state
  //     setJobs(nonEmptyJobs);

  //     // Adjust currentJobId if needed (e.g., reset to first job or 0)
  //     if (!nonEmptyJobs.find(job => job.id === currentJobId)) {
  //       setCurrentJobId(nonEmptyJobs.length > 0 ? nonEmptyJobs[0].id : 0);
  //     }
  //   }
  // }, [jobs, currentJobId]);

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

  const removeJob = (idToRemove) => {
    setJobs((prevJobs) => {
      // Filter out the job to remove
      const filteredJobs = prevJobs.filter(job => job.id !== idToRemove);

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
  
  const removeJobV1 = (idToRemove) => {
    setJobs((prevJobs) => {
      const updatedJobs = prevJobs.filter(job => job.id !== idToRemove);

      // If the currentJobId is the one removed, update it
      if (currentJobId === idToRemove) {
        if (updatedJobs.length > 0) {
          // Set currentJobId to the first job's id in the updated list
          setCurrentJobId(updatedJobs[0].id);
        } else {
          // No jobs left, reset currentJobId to 0
          setCurrentJobId(0);
        }
      }

      return updatedJobs;
    });
  };
  
  // Reset all jobs and current index to initial state
  const resetJobs = () => {
    setJobs(initialJobsState.jobs);
    setCurrentJobId(initialJobsState.currentJobId);
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        //setJobs,
        currentJobId,
        setCurrentJobId,
        job,
        setJob,
        addJob,
        removeJob,
        resetJobs,
        jobError,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
