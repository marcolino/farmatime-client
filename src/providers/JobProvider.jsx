import { useState, useEffect, useCallback, useContext } from "react";
import { JobContext, jobSkeleton, emailTemplateSkeleton } from "./JobContext";
import { useTranslation } from "react-i18next";
import { apiCall } from "../libs/Network";
import { AuthContext } from "../providers/AuthContext";
import { isEmptyObject } from '../libs/Misc';
//import config from "../config";

export const JobProvider = ({ children }) => {
  const { auth, updateSignedInUserLocally } = useContext(AuthContext);
  const { t } = useTranslation();

  // State for jobs array and current job index
  const [jobs, setJobs] = useState([]);
  const [emailTemplate, setEmailTemplate] = useState(emailTemplateSkeleton);
  const [jobsError, setJobsError] = useState(null);

  // const [draftChanges, setDraftChanges] = useState({}); // { jobId: boolean }
  // const jobDraftIsChanged = (jobId) => jobId && !!draftChanges[jobId];
  // const setJobDraftChanged = (jobId, changed) => {
  //   setDraftChanges((prev) => ({ ...prev, [jobId]: changed }));
  // };
  const [jobDraftIsDirty, setJobDraftDirty] = useState(false);

  useEffect(() => {
    if (auth?.user?.jobs) {
      // Load jobsData from auth.user if available
      setJobs(auth.user.jobs);
    } else {
      // Reset to initial state otherwises
      setJobs([]);
    }
  }, [auth?.user?.jobs]); // rerun if the jobs array changes
  
  useEffect(() => {
    if (auth?.user?.emailTemplate) {
      // Load email template from auth.user if available
      setEmailTemplate(auth.user.emailTemplate);
    } else {
      // Reset to initial state otherwises
      setEmailTemplate(emailTemplateSkeleton);
    }
  }, [auth?.user?.emailTemplate]); // rerun if the jobs array changes

  const getJobById = (id) => {
    if (id === 'new') return jobSkeleton;
    //return jobs.find(j => j.id === parseInt(id, 10)) || null;
    return jobs.find(j => j.id === id) || null;
  };

  const getJobNumberById = (id) => {
    if (id === 'new') return 1; // new job being created, not yet in jobs array
    for (let i = 0; i < jobs.length; i++) {
      if (jobs[i].id === id) {
        return 1 + i;
      }
    }
    return ''; // Not found
  };

  const clearJobsError = () => setJobsError(null);

  const confirmJob = useCallback(
    (jobDraft) => {
      //const isConfirmed = true;
      if (jobDraft.id === "new") {
        // // new job, assign new unique id
        // const maxId = jobs.reduce((max, job) => Math.max(max, job.id), -1);
        // const id = maxId + 1;
        // new job, assign new unique random UUID
        const id = crypto.randomUUID(); 
        const confirmedJob = { ...jobDraft, id };
        return [...jobs, confirmedJob];
      } else {
        // existing job, update it in jobs array
        if (!jobs.find(job => job.id === jobDraft.id)) { // safety check
          console.warn(
            `Warning: confirmJob() tried to update job id ${jobDraft.id}, but no job with such id is present!`
          );
          return jobs; // return unchanged jobs on safety check fail
        }
        return jobs.map(job =>
          job.id === jobDraft.id
            ? { ...jobDraft }
            : job
        );
      }
    },
    [jobs]
  );

  // Send current job to server for encryption & storage
  const confirmJobsOnServer = async (jobsConfirmed) => {
    if (!auth?.user?.id) {
      setJobsError({ type: "auth", message: "User not logged in" });
      return false;
    }

    try {
      // POST job data to server API - server encrypts & stores
      const response = await apiCall("post", "/user/updateUserJobs", {
        //userId: auth.user.id, // not needed, it is in auth token
        jobs: jobsConfirmed,
      });
      if (response.err) {
        setJobsError({ type: "auth", message: response.message || t("Error saving jobs on server") });
        return false;
      }

      // Update user's local state
      // const updatedUser = { ...auth.user, jobs: jobsConfirmed };
      // updateSignedInUserLocally(updatedUser);
      updateSignedInUserLocally({ jobs: jobsConfirmed });
      
      setJobsError(null);
      return true;
    } catch (err) {
      setJobsError({ type: "server", message: err.message || t("Failed saving jobs on server") });
      return false;
    }
  };


  // Confirm email template on server
  const confirmEmailTemplateOnServer = async (emailTemplateConfirmed) => {
    if (!auth?.user?.id) {
      setJobsError({ type: "auth", message: "User not logged in" });
      return false;
    }

    try {
      // POST emailTemplate data to server API
      const response = await apiCall("post", "/user/updateUserEmailTemplate", {
        //userId: auth.user.id, // not needed, it is in auth token
        emailTemplate: emailTemplateConfirmed,
      });
      if (response.err) {
        setJobsError({ type: "auth", message: response.message || t("Error saving email template on server") });
        return false;
      }
          
      // Update user's local state
      // const updatedUser = { ...auth.user, emailTemplate: emailTemplateConfirmed };
      // updateSignedInUserLocally(updatedUser); // updates AuthContext + localStorage
      updateSignedInUserLocally({ emailTemplate: emailTemplateConfirmed }); // updates AuthContext + localStorage

      setJobsError(null);
      return true;
    } catch (err) {
      setJobsError({ type: "server", message: err.message || t("Failed saving email template on server") });
    }

  };

  // Check if user job requests are full
  const checkUserJobRequests = async (medicines) => {
    if (!auth?.user?.id) {
      setJobsError({ type: "auth", message: "User not logged in" });
      return false;
    }
    try {
      const response = await apiCall("post", "/request/checkUserJobRequests", {
        medicines,
      });
      if (response.err) {
        setJobsError({ type: "auth", message: response.message || t("Error checking user job requests on server") });
      }
      return response;
    } catch (err) {
      setJobsError({ type: "server", message: err.message || t("Failed checking user job requests on server") });
    }
  };

  // Reset all jobs on server
  const resetJobs = async () => {
    if (!auth?.user?.id) {
      setJobsError({ type: "auth", message: "User not logged in" });
      return false;
    }

    try {
      const response = await apiCall("post", "/user/updateUserJobs", {
        userId: auth.user.id,
        jobs: [],
      });
      if (response.err) {
        setJobsError({ type: "auth", message: response.message || t("Error resetting jobs on server") });
        return false;
      }

      // Update user's local state
      // const updatedUser = { ...auth.user, jobs: [] };
      // updateSignedInUserLocally(updatedUser); // updates AuthContext + localStorage
      updateSignedInUserLocally({ jobs: [] }); // updates AuthContext + localStorage

      setJobsError(null);
      setJobs([]);
    } catch (err) {
      setJobsError({ type: "server", message: err.message || t("Failed to reset jobs on server") });
    }
  };

  const getPlayPauseJob = useCallback(
    (id) => { // Switch active status for job id
      return jobs.map(job =>
        job.id === id
          ? { ...job, isActive: !job.isActive }
          : job
      );
    },
    [jobs]
  );

  const removeJob = useCallback(
    (idToRemove) => {
      return jobs.filter(job => job.id !== idToRemove);
    },
    [jobs]
  );

  const removeJobs = useCallback(
    (idsToRemove) => {
      return jobs.filter(job => !idsToRemove.includes(job.id));
    },
    [jobs]
  );

  const jobIsCompleted = (id) => {
    // Check if all required fields are valid
    return jobs.find(job => job.id === id).stepsCompleted.every(Boolean);
    //return jobs[id].stepsCompleted.every(Boolean);
  };

  const jobIsEmpty = (job) => {
    if (!job) return true;
    if (!isEmptyObject(job.patient)) return false;
    if (!isEmptyObject(job.doctor)) return false;
    if (job.isActive !== false) return false;
    return true;
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        setJobs,
        jobsError,
        getJobById,
        getJobNumberById,
        getPlayPauseJob,
        confirmJob,
        confirmJobsOnServer,
        jobDraftIsDirty,
        setJobDraftDirty,
        removeJob,
        removeJobs,
        resetJobs,
        clearJobsError,
        jobIsCompleted,
        jobIsEmpty,
        checkUserJobRequests,
        emailTemplate,
        setEmailTemplate,
        confirmEmailTemplateOnServer,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
