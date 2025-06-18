import { useState, useEffect } from "react";
import { JobContext } from "./JobContext";

const initialJob = {
  patient: {},
  doctor: {},
  medicines: [],
  jobEmailTemplate: '',
  isConfirmed: false
};

export const JobProvider = ({ children }) => {
  const [job, setJob] = useState(() => {
    const saved = localStorage.getItem("jobState");
    return saved ? JSON.parse(saved) : initialJob;
  });

  useEffect(() => {
    localStorage.setItem("jobState", JSON.stringify(job));
  }, [job]);

  return (
    <JobContext.Provider value={{ job, setJob }}>
      {children}
    </JobContext.Provider>
  );
};
