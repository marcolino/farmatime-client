import React, { useState, /*useEffect, */ useContext } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useSnackbarContext } from "../providers/SnackbarProvider";
import { Container, SectionHeader1 } from 'mui-material-custom';
//import { useSecureStorage } from "../hooks/useSecureStorage";
import { JobContext } from '../providers/JobContext';
//import { AuthContext } from "../providers/AuthContext";
import DialogConfirm from './DialogConfirm';
import config from '../config';

const JobsRemove = () => {
  // const {
  //   secureStorageStatus,
  //   secureStorageGet,
  //   secureStorageRemove
  // } = useSecureStorage();
  //const { auth } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  //const [jobsData, setJobsData] = useState({});
  const { jobs, resetJobs } = useContext(JobContext);
  //const [jobsCount, setJobsCount] = useState(0);
  const { showSnackbar } = useSnackbarContext();
 
  // useEffect(() => {
  //   if (secureStorageStatus.status === "ready") {
  //     secureStorageGet(auth?.user?.id ?? "0"/*config.ui.jobs.storageKey*/).then(data => setJobsData(data || null));
  //   }
  // }, [secureStorageStatus, secureStorageGet, auth?.user?.id]);
  
  // useEffect(() => {
  //   if (jobsData && jobsData.jobs && jobsData.jobs.length)
  //     setJobsCount(jobsData.jobs.length);
  //   else
  //     setJobsCount(0);
  // }, [jobsData]);

  const handleRemoveJobs = () => {
    // simulate job data removal logic
    //secureStorageRemove(auth.user?.id); // TODO: add to jobs storageKey the user's id...
    resetJobs();
    setShowDialog(false);
    showSnackbar(t('All your jobs data has been removed') + '.', 'info');
    // Navigate back after snackbar has had time to be seen (add 0.5s buffer to autoHideDuration)
    setTimeout(() => {
      navigate("/", { replace: true }); // navigate back to the previous page
    }, ((config.ui.snacks.autoHideDurationSeconds + 0.5) * 1000));
    //navigate(-1); // navigate back to the previous page
  };

  console.log("JobsRemove - jobs: ", jobs, typeof jobs);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <SectionHeader1>
        {t('Remove all jobs')}
      </SectionHeader1>

      <Typography variant="body1" gutterBottom sx={{ mb: 5 }}>
        {t('{{count}} jobs present.', { count: jobs.length })}
        {(jobs.length <= 0) && ' ' + t('Nothing to remove.')}
      </Typography>

      <Box display="flex" justifyContent="start" gap={2} sx={{ mb: 2 }}>
        {jobs.length > 0 && (
          <Button variant="contained" color="default" gap={1} onClick={() => navigate(-1)}>
            {t('Cancel')}
          </Button>
        )}

        {jobs.length > 0 && (
          <Button variant="contained" color="error" gap={1} onClick={() => setShowDialog(true)}>
            {t('Remove all your jobs data')}
          </Button>
        )}
      </Box>
      
      <DialogConfirm
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onCancel={() => setShowDialog(false)}
        onConfirm={handleRemoveJobs}
        title={t("Confirm removal of ALL your jobs data")}
        message={t("Are you sure you want to remove all your jobs data? This action cannot be undone.")}
        confirmText={t("REMOVE ALL JOBS DATA")}
        confirmColor={"error"}
        cancelText={t("Cancel")}
      />
    </Container>
  );
};

export default React.memo(JobsRemove);
