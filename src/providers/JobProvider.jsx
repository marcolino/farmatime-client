import { useState, useEffect, useCallback, useContext } from "react";
import { JobContext/*, initialJob, initialJobsState*/ } from "./JobContext";
import { useTranslation } from "react-i18next";
import { apiCall } from "../libs/Network";
import { AuthContext } from "../providers/AuthContext";
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
    jobs.find(j => j.id === id);
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
    []
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
  const confirmJobsOnServer = async () => {
    if (!auth?.user?.id) {
      setJobsError({ type: "auth", message: "User not logged in" });
      return false;
    }

    try {
      // POST job data to server API - server encrypts & stores
      const response = await apiCall("post", "/user/updateUserJobs", {
        //userId: auth.user.id, // not needed, it is in auth token
        jobs,
      });
      if (response.err) {
        // Mark job as unconfirmed
        //setJob({ ...job, isActive: false, isConfirmed: false }, job.id);
        setJobsError({ type: "auth", message: response.message || t("Error saving jobs on server") });
        return false;
      }

      // Update user's local state
      const updatedUser = { ...auth.user, jobs };
      updateSignedInUserLocally(updatedUser);
      
      setJobsError(null);
      return true;
    } catch (err) {
      setJobsError({ type: "server", message: err.message || t("Failed to save jobs on server") });
      return false;
    }
  };

  const playPauseJob = (id) => { // Switch active status for job id
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

      // // if no job left, set at least initialJob
      // if (filteredJobs.length === 0) {
      //   return initialJobsState.jobs;
      // }

      // // Reassign IDs to avoid holes: create new jobs array with sequential IDs starting from 0
      // const reindexedJobs = filteredJobs.map((job, index) => ({
      //   ...job,
      //   id: index,
      // }));

      // // Update currentJobId accordingly
      // setCurrentJobId((prevCurrentJobId) => {
      //   if (prevCurrentJobId === idToRemove) {
      //     // If the removed job was the current one, set to first job's id or 0 if none left
      //     return reindexedJobs.length > 0 ? 0 : 0;
      //   } else {
      //     // If currentJobId was after the removed id, shift it down by 1
      //     if (prevCurrentJobId > idToRemove) {
      //       return prevCurrentJobId - 1;
      //     }
      //     // Otherwise, keep it unchanged
      //     return prevCurrentJobId;
      //   }
      // });

      //return reindexedJobs;

      return filteredJobs;
    });
  };
  
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

  return (
    <JobContext.Provider
      value={{
        jobs,
        getJobById,
        getJobNumberById,
        //setJobs,
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
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
