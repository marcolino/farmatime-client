import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useSnackbarContext } from "../hooks/useSnackbarContext";
import { JobContext } from '../providers/JobContext';
import DialogConfirm from './DialogConfirm';
//import config from '../config';


const JobsRemove = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(true);
  const { jobs, resetJobs } = useContext(JobContext);
  const { showSnackbar } = useSnackbarContext();
 
  const handleRemoveJobs = () => {
    resetJobs();
    setShowDialog(false);
    showSnackbar(t('All your jobs data has been removed') + '.', 'info');
    navigate(-1);
  };

  return (
    <DialogConfirm
      open={showDialog}
      onClose={() => { setShowDialog(false); navigate(-1); }}
      onCancel = {() => { setShowDialog(false); navigate(-1); }}
      onConfirm={handleRemoveJobs}
      title={t("Confirm removal of ALL your jobs data")}
      message={t("Are you sure you want to remove all your {{count}} jobs data? This action cannot be undone.", { count: jobs.length })}
      confirmText={t("REMOVE ALL JOBS DATA")}
      confirmColor={"error"}
      cancelText={t("Cancel")}
    />
    // </Container>
  );
};

export default React.memo(JobsRemove);
