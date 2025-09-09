import { useState, useEffect, useCallback, useContext } from "react";
import { JobContext, jobSkeleton } from "./JobContext";
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
  //const [currentJobId, setCurrentJobId] = useState(initialJobsState.currentJobId);
  const [jobsError, setJobsError] = useState(null);

  useEffect(() => {
    if (auth?.user?.jobs /*&& Array.isArray(auth.user.jobsData.jobs) && auth.user.jobsData.jobs.length > 0*/) {
      // Load jobsData from auth.user if available
      setJobs(auth.user.jobs);
      //setCurrentJobId(auth.user.jobsData.currentJobId);
    } else {
      // Reset to initial state otherwises
      setJobs([]);
      //setCurrentJobId(initialJobsState.currentJobId);
    }
  }, [auth?.user?.jobs]); // rerun if the jobs array changes
  
  // const setJob = useCallback( // TODO: updatedJobOrUpdater => updatedJob
  //   (updatedJobOrUpdater, id = currentJobId) => {
  //     setJobs((prevJobs) => {
  //       const newJobs = [...prevJobs];
  //       const prevJob = prevJobs[id];
  //       const newJob =
  //         typeof updatedJobOrUpdater === "function"
  //           ? updatedJobOrUpdater(prevJob)
  //           : updatedJobOrUpdater;
  //       const index = newJobs.findIndex(j => j.id === id);
  //       if (index !== -1) {
  //         newJobs[index] = newJob;
  //       } else {
  //         newJobs.push(newJob); // rare fallback, when/if prevJobs is empty (does not contain id)
  //       }
  //       return newJobs;
  //     });
  //   },
  //   [currentJobId]
  // );

  const getJobById = (id) => {
    if (id === 'new') return jobSkeleton;
    return jobs.find(j => j.id === parseInt(id, 10)) || null;
  };

  const getJobNumberById = (id) => {
    if (id === 'new') return 0; // new job being created, not yet in jobs array
    for (let i = 0; i < jobs.length; i++) {
      if (jobs[i].id === id) {
        return i;
      }
    }
    return -1; // Not found
  };

  const normalizeJobs = (jobs) => jobs.map((job, index) => ({ ...job, id: index }));
  
  // // update job by id in jobs array
  // const setJob = useCallback(
  //   (jobDraft, id = currentJobId) => {
  //     setJobs(prevJobs => {
  //       const newJobs = [...prevJobs];
  //       const newJob = jobDraft;
  //       const index = newJobs.findIndex(j => j.id === id);
  //       if (index !== -1) {
  //         newJobs[index] = newJob;
  //       } else { // fallback, when/if prevJobs is empty (does not contain id) (should not happen)
  //         alert(`Warning: setJob() with id ${id} is adding new job to jobs array, should not happen...`); // TODO
  //         newJobs.push(newJob);
  //       }
  //       return newJobs;
  //     });
  //   },
  //   [currentJobId]
  // );

  /**
   * Confirm a draft job to jobs array:
   *  - mark it as confirmed
   *  - if it is new: assign it a new unique id
   *  - if it has an existing id: update the existing job in jobs array
   */
  /*
  const confirmJob = useCallback(
    (jobDraft) => {
      const isConfirmed = true;
      if (jobDraft.id === 'new') { // new job, assign new unique id
        setJobs(prevJobs => {
          const maxId = prevJobs.reduce((max, j) => Math.max(max, j.id), -1);
          const id = maxId + 1;
          const confirmedJob = { ...jobDraft, id, isConfirmed };
          return [...prevJobs, confirmedJob];
        });
      } else { // existing job, update it in jobs array
        if (!jobs.find(j => j.id === jobDraft.id)) { // safety check (TODO: REMOVE-ME ...)
          return alert(`Warning: confirmJob() with id ${jobDraft.id} is updating existing job in jobs array, but no job with such id is found...`);
        }
        setJobs(prevJobs =>
          prevJobs.map(j =>
            j.id === jobDraft.id
              ? { ...jobDraft, isConfirmed }
              : j
          )
        );
      }
    },
    [jobs]
  );
  */
  const confirmJob = useCallback(
    (jobDraft) => {
      const isConfirmed = true;
      if (jobDraft.id === "new") {
        // new job, assign new unique id
        const maxId = jobs.reduce((max, job) => Math.max(max, job.id), -1);
        const id = maxId + 1;
        const confirmedJob = { ...jobDraft, id, isConfirmed };
        return [...jobs, confirmedJob];
      } else {
        // existing job, update it in jobs array
        if (!jobs.find(job => job.id === jobDraft.id)) { // safety check (TODO: REMOVE-ME ...)
          console.warn(
            `Warning: confirmJob() tried to update job id ${jobDraft.id}, but no job with such id is present!`
          );
          return jobs; // return unchanged jobs on safety check fail
        }
        return jobs.map(job =>
          job.id === jobDraft.id
            ? { ...jobDraft, isConfirmed }
            : job
        );
      }
    },
    [jobs]
  );

  // Add a new draft job to jobs array
  // const addJob = (jobDraft = null) => {
  //   setJobs(prevJobs => {
  //     // Find the max id currently in jobs to generate a new unique id
  //     const maxId = prevJobs.reduce((max, job) => (job.id > max ? job.id : max), -1);
  //     const nextId = maxId + 1;

  //     // If no job provided, create a default one based on initialJob but with new id
  //     const jobToAdd = jobDraft
  //       ? { ...jobDraft, id: nextId }
  //       : { ...initialJob, id: nextId };

  //     const updatedJobs = [...prevJobs, jobToAdd];

  //     // Update currentJobId to the new job's id
  //     setCurrentJobId(nextId);

  //     return updatedJobs;
  //   });
  // };

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
        // Mark job as unconfirmed
        //setJob({ ...job, isActive: false, isConfirmed: false }, job.id);
        setJobsError({ type: "auth", message: response.message || t("Error saving jobs on server") });
        return false;
      }

      // Update user's local state
      const updatedUser = { ...auth.user, jobs: jobsConfirmed };
      updateSignedInUserLocally(updatedUser);
      
      setJobsError(null);
      return true;
    } catch (err) {
      setJobsError({ type: "server", message: err.message || t("Failed to save jobs on server") });
      return false;
    }
  };

  /*
  const playPauseJob = (id) => { // Switch active status for job id
    setJobs((prevJobs) => {
      return prevJobs.map((job) =>
        job.id === id
          ? { ...job, isActive: !job.isActive }
          : job
      );
    });
  }
  */
  
  const playPauseJob = useCallback(
    (id) => { // Switch active status for job id
      return jobs.map(job =>
        job.id === id
          ? { ...job, isActive: !job.isActive }
          : job
      );
    },
    [jobs]
  );

  // const removeJob = (idToRemove) => {
  //   setJobs((prevJobs) => {
  //     // Filter out the job to remove
  //     const filteredJobs = prevJobs.filter(job => job.id !== idToRemove);

  //     return filteredJobs;
  //   });
  // };
  
  const removeJob = useCallback(
    (idToRemove) => normalizeJobs(jobs.filter((job) => job.id !== idToRemove)),
    [jobs]
  );

  // Reset all jobs
  const resetJobs = async () => {
    // setJobs(initialJobsState.jobs);
    // setCurrentJobId(initialJobsState.currentJobId);
    setJobs([]);

    if (auth?.user) {
      const updatedUser = { ...auth.user, jobs: [] };
      updateSignedInUserLocally(updatedUser); // updates AuthContext + localStorage

      try {
        await apiCall("post", "/user/updateUserJobs", {
          userId: auth.user.id,
          jobs: [],
        });
      } catch (err) {
        setJobsError({ type: "server", message: err.message || t("Failed to reset jobs on server") });
      }
    }
  };

  const jobsConfirmedCount = () => {
    //if (!Array.isArray(jobs)) return 0;
    console.log("💡 jobsConfirmedCount:", jobs ? jobs.filter(job => job.isConfirmed).length : 0);
    return jobs ? jobs.filter(job => job.isConfirmed).length : 0;
  };

  const jobIsCompleted = (id) => {
    // Check if all required fields are valid
    return jobs[id].stepsCompleted.every(Boolean);
  };

  const jobIsEmpty = (job) => {
    // console.log("jobIsEmpty - job:", job);
    if (!job) return true;
    // console.log("jobIsEmpty - job.id:", job.id);
    //if (job.id !== null) return false; 
    // console.log("jobIsEmpty - job.patient:", job.patient);
    if (!isEmptyObject(job.patient)) return false;
    // console.log("jobIsEmpty - job.doctor:", job.doctor);
    if (!isEmptyObject(job.doctor)) return false;
    // console.log("jobIsEmpty - job.isActive:", job.isActive);  
    if (job.isActive !== false) return false;
    // console.log("jobIsEmpty - job.isConfirmed:", job.isConfirmed);
    if (job.isConfirmed !== false) return false;
    // console.log("jobIsEmpty - job.medicines:", job.medicines);
    if (!Array.isArray(job.medicines) || job.medicines.length > 0) return false;
    // console.log("jobIsEmpty - anyStepCompleted():", anyStepCompleted());
    //if (anyStepCompleted()) return false;
    // console.log("jobIsEmpty - job.timestampCreation:", job.timestampCreation);
    if (job.timestampCreation !== 0) return false;
    // console.log("jobIsEmpty - job.timestampLastModification:", job.timestampLastModification);
    if (job.timestampLastModification !== 0) return false;
    return true;
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        getJobById,
        getJobNumberById,
        //normalizeJobs,
        setJobs,
        //currentJobId,
        //setCurrentJobId,
        //job,
        //setJob,
        confirmJob,
        //addJob,
        playPauseJob,
        removeJob,
        resetJobs,
        jobsError,
        confirmJobsOnServer,
        jobsConfirmedCount,
        jobIsCompleted,
        jobIsEmpty,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
