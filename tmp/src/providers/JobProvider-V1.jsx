// src/providers/JobProvider.jsx
import { useState, useEffect } from "react";
import { JobContext } from "./JobContext";
import { useSecureStorage } from "../hooks/useSecureStorage";

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
  const resetJob = () => setJob(initialJob);
  
  // Load from SecureStorage on mount
  useEffect(() => {
    if (secureStorageStatus === 'ready') {
      (async () => {
        try {
          const saved = await secureStorageGet(jobKey);
          console.log(" <<< secureStorageGet called fine.")
          if (saved) {
            setJob(saved);
          }
        } catch (e) {
          console.error("Failed to load job state from secure storage:", e);
        }
      })();
    }
  }, [secureStorageStatus, secureStorageGet]);

  // Save to SecureStorage on changes
  useEffect(() => {
    if (secureStorageStatus === 'ready') {
      (async () => {
        try {
          await secureStorageSet(jobKey, job);
          console.log(" >>> secureStorageSet called fine.")
        } catch (e) {
          console.error("Failed to save job state to secure storage:", e);
        }
      })();
    }
  }, [job, secureStorageStatus, secureStorageSet]);

  return (
    <JobContext.Provider value={{ job, setJob, resetJob }}>
      {children}
    </JobContext.Provider>
  );
};
