// src/providers/JobProvider.jsx
import { useState, useEffect, useRef } from "react";
import { JobContext } from "./JobContext";
import { useSecureStorage } from "../hooks/useSecureStorage";
import { isEqual }  from "lodash";
import { debounce } from "lodash";

const jobKey = "job";

const initialJob = {
  patient: {},
  doctor: {},
  medicines: [],
  emailTemplate: '',
  isConfirmed: false,
  currentStep: 0,
};

export const JobProvider = ({ children }) => {
  const { secureStorageStatus, secureStorageGet, secureStorageSet } = useSecureStorage();
  const [job, setJob] = useState(initialJob);
  const [jobError, setJobError] = useState(null);
  const resetJob = () => setJob(initialJob);

  const lastSavedJobRef = useRef(initialJob);

  // Debounced save function (only created once)
  const debouncedSaveRef = useRef(null);

  // Create debounced function once status is 'ready' and secureStorageSet is defined
  useEffect(() => {
    if (secureStorageStatus === 'ready') {
      const debounced = debounce(async (newJob) => {
        try {
          await secureStorageSet(jobKey, newJob);
          lastSavedJobRef.current = newJob;
          console.log(" >>> secureStorageSet (debounced & changed)");
        } catch (e) {
          console.error("Failed to save job state to secure storage:", e); // TODO: console error is for debug only
          setJobError({ type: "store", e });
        }
      }, 300);

      debouncedSaveRef.current = debounced;

      return () => {
        debounced.cancel();
      };
    }
  }, [secureStorageStatus, secureStorageSet]);

  // Load job state from secure storage on mount
  useEffect(() => {
    if (secureStorageStatus === 'ready') {
      (async () => {
        try {
          const saved = await secureStorageGet(jobKey);
          console.log(" <<< secureStorageGet called");
          if (saved) {
            setJob(saved);
            lastSavedJobRef.current = saved; // Sync reference
          }
        } catch (e) {
          console.error("Failed to load job state to secure storage:", e); // TODO: console error is for debug only
          setJobError({ type: "load", e });
        }
      })();
    }
  }, [secureStorageStatus, secureStorageGet]);

  // Save job state to secure storage on change (debounced + deduplicated)
  useEffect(() => {
    if (
      secureStorageStatus === 'ready' &&
      !isEqual(job, lastSavedJobRef.current)
    ) {
      debouncedSaveRef.current(job);
    }
  }, [job, secureStorageStatus]);

  return (
    <JobContext.Provider value={{ job, setJob, resetJob, jobError }}>
      {children}
    </JobContext.Provider>
  );
};
