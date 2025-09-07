import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  useTheme,
  useMediaQuery,
  SectionHeader1
} from 'mui-material-custom';
import { ArrowBack, ArrowForward, Check, Menu, Clear } from '@mui/icons-material';
import { JobContext/*, initialJob*/ } from '../providers/JobContext';
import { useDialog } from "../providers/DialogContext";
import {
  validateJobPatientFirstName, validateJobPatientLastName, validateJobPatientEmail,
  validateJobDoctorName, validateJobDoctorEmail,
  validateAllFields,
} from '../libs/Validation';
import { AuthContext } from '../providers/AuthContext';
import { useSnackbarContext } from "../providers/SnackbarProvider";
import JobPatient from './JobPatient';
import JobDoctor from './JobDoctor';
import JobMedicines from './JobMedicines';
//import JobEmailTemplate from './JobEmailTemplate';
import JobConfirmationReview from './JobConfirmationReview';

const JobFlow = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isLoggedIn } = useContext(AuthContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbarContext();
  const { showDialog } = useDialog();
  const { jobId } = useParams();
  console.log("JobFlow - jobId param:", jobId);
  const { /*jobs,*/ /*currentJobId,*/ /*setJob,*/ getJobById, getJobNumberById, confirmJob, confirmJobsOnServer, jobsError } = useContext(JobContext);
  
  //const job = jobs.find(j => j.id === currentJobId);

  const [jobDraft, setJobDraft] = useState(jobId === 'new' ? { id: jobId } : getJobById(jobId));

  const [shouldConfirm, setShouldConfirm] = useState(false);
  const [hasNavigatedAway, setHasNavigatedAway] = useState(false);

  const steps = [
    { id: 0, label: isMobile ? t('Patient & Doctor') : t('Patient & Doctor Info') },
    { id: 1, label: t('Medicines') },
    //{ id: 2, label: t('Email Template') }, // removing this step from main steps, it is moved to advanced tools
    { id: 2, label: t('Confirmation') }
  ];
  const maxSteps = steps.length;

  const fieldsPatient = [
    {
      label: t("Patient first name"),
      key: 'firstName',
      helpKey: 'PatientFirstName',
      placeholder: '',
      //isValid: isValidFirstName,
      isValid: validateJobPatientFirstName,
    },
    {
      label: t("Patient last name"),
      key: 'lastName',
      helpKey: 'PatientLastName',
      placeholder: '',
      //isValid: isValidLastName,
      isValid: validateJobPatientLastName,
    },
    {
      label: t("Patient email"),
      key: 'email',
      helpKey: 'PatientEmail',
      type: 'email',
      placeholder: 'info@mail.it',
      //isValid: isValidEmail,
      isValid: validateJobPatientEmail,
    },
  ];

  const fieldsDoctor = [
    {
      label: t("Doctor name"),
      key: 'name',
      helpKey: 'DoctorName',
      placeholder: t("Dr. ..."),
      //isValid: isValidName,
      isValid: validateJobDoctorName,
    },
    {
      label: t("Doctor email"),
      key: 'email',
      helpKey: 'DoctorEmail',
      placeholder: t("doc@studio-medico.it"),
      type: 'email',
      //isValid: isValidEmail,
      isValid: validateJobDoctorEmail,
    },
  ];

  // We need these because both patient and doctor are in step 0
  const [patientValid, setPatientValid] = useState(() => validateAllFields(fieldsPatient, jobDraft.patient));
  const [doctorValid, setDoctorValid] = useState(() => validateAllFields(fieldsDoctor, jobDraft.doctor));

  // State to track if medicines are being edited
  const [isMedicinesEditing, setIsMedicinesEditing] = useState(false);

  // Check user is logged in (TODO: implement for all authenticated routes, possibly using a higher-order component)
  useEffect(() => {
    if (!isLoggedIn) {
      console.warn('User must be logged in');
      navigate("/", {replace: true})
    }
  }, [isLoggedIn, navigate]);
  
  // Watch both validation states and update step completion accordingly
  useEffect(() => {
    handleStepCompleted(0, patientValid && doctorValid);
  }, [patientValid, doctorValid]);
  
  // Show job errors to the user
  useEffect(() => {
   if (jobsError) {
      let message = jobsError.message ?? "An unexpected error occurred.";
      if (jobsError.type === "load") {
        message = `${t("Failed to load jobs data")}. ${t("Please try again")}.`;
      } else if (jobsError.type === "store") {
        message = `${t("Failed to store jobs data")}. ${t("Please try again")}.`;
      }
      showSnackbar(message, "error");
    }
  }, [jobsError, showSnackbar, t]);

  // If not all previous are completed, set last step completion to false
  useEffect(() => {
    if (!jobDraft.stepsCompleted) { // safety check, should not happen (TODO)
      jobDraft.stepsCompleted = [];
      // alert("jobDraft.stepsCompleted is undefined!");
      return;
    }

    const lastIndex = jobDraft.stepsCompleted.length - 1;
    const allPreviousCompleted = jobDraft.stepsCompleted
      .slice(0, lastIndex)
      .every(Boolean)
    ;
    if (!allPreviousCompleted && jobDraft.stepsCompleted[lastIndex]) {
      // Set last step completion to false
      setJobDraft(prev => ({
        ...prev,
        stepsCompleted: prev.stepsCompleted.map((val, idx) =>
          idx === lastIndex ? false : val
        ),
      }));
    }
  }, [jobDraft]);

  // Confirm job changes
  useEffect(() => {
    if (shouldConfirm) {
      (async () => {
        await confirmJobsOnServer(); // errors are handled with jobsError
      })();
      setShouldConfirm(false);
    }
  }, [shouldConfirm]); // eslint-disable-line react-hooks/exhaustive-deps

  const isLastStep = () => {
    return jobDraft.currentStep === maxSteps - 1;
  };


  // Navigation handlers
  const goToJobsList = () => {
    setHasNavigatedAway(true); // To force validation errors to be shown
    if (!allStepsCompleted()) {
      return showSnackbar(t("Please complete all steps before proceeding"), "warning");
    }
    // if (isMedicinesEditing) {
    //   return showSnackbar(t("Please finish editing medicines before proceeding"), "warning");
    // }
    navigate('/jobs-handle', { replace: false });
  };

  const handleNext = () => {
    // If jobMedicines is editing, spit a warning and return immediately
    if (isMedicinesEditing) {
      return showSnackbar(t("Please finish editing medicines before proceeding"), "warning");
    }
    setJobDraft(prev => ({
      ...prev,
      currentStep: Math.min((prev.currentStep ?? 0) + 1, maxSteps - 1)
    }));
    setHasNavigatedAway(true);
  };

  const handleBack = () => {
    // If jobMedicines is editing, spit a warning and return immediately
    if (isMedicinesEditing) {
      return showSnackbar(t("Please finish editing medicines before proceeding"), "warning");
    }
    setJobDraft(prev => ({
      ...prev,
      currentStep: Math.max((prev.currentStep ?? 0) - 1, 0)
    }));
    setHasNavigatedAway(true);
  };

  const handleGoto = (index) => {
    // If jobMedicines is editing, spit a warning and return immediately
    if (isMedicinesEditing) {
      return showSnackbar(t("Please finish editing medicines before proceeding"), "warning");
    }
    if (index < 0 || index > maxSteps - 1) { // should not happen 
      console.error(`Cannot goto index ${index}, it's out of range [0-${maxSteps - 1}]`);
      return;
    }
    setJobDraft(prev => ({
      ...prev,
      currentStep: index
    }));
    setHasNavigatedAway(true);
  };

  const handleUpdate = (keyOrObject, value) => {
    setJobDraft(prevJob => {
      if (typeof keyOrObject === "string") {
        // Single key/value
        return {
          ...prevJob,
          [keyOrObject]: value,
        };
      } else if (typeof keyOrObject === "object" && keyOrObject !== null) {
        // Multiple updates at once
        return {
          ...prevJob,
          ...keyOrObject,
        };
      }
      return prevJob; // Fallback (no change)
    });
  };

  const handleStepCompleted = (stepIndex, result) => {
    console.log("JobFlow - handleStepCompleted - step index:", stepIndex, "result:", result);
    setJobDraft(prev => ({
      ...prev,
      stepsCompleted:
        prev.stepsCompleted ?
          (prev.stepsCompleted.map((val, idx) => idx === stepIndex ? result : val)) :
          []
    }));
  };

  const anyStepCompleted = () => { // Check if any previous step is completed
    const lastIndex = jobDraft.stepsCompleted.length - 1;
    return jobDraft.stepsCompleted
      .slice(0, lastIndex)
      .some(Boolean)
      ;
  };

  const allStepsCompleted = () => { // Check if all previous steps are completed
    const lastIndex = jobDraft.stepsCompleted.length - 1;
    return jobDraft.stepsCompleted
      .slice(0, lastIndex)
      .every(Boolean)
      ;
  };

  const handleConfirm = async () => {
    // if not all previous steps are completed, show a warning and return...
    if (!allStepsCompleted()) {
      return showSnackbar(t("Please complete all steps"), "warning");
    }

    handleUpdate({
      isActive: jobDraft.isActive || !jobDraft.isConfirmed, // Mark job as active if job was active or unconfirmed
      isConfirmed: true, // Mark job as confirmed
    });
    handleStepCompleted(jobDraft.stepsCompleted.length - 1, true); // Mark this last step as completed

    confirmJob(jobDraft);

    setShouldConfirm(true); // Trigger confirmation on server

    if (!jobDraft.isConfirmed) {
      const forTheMedicine = t("the medicine");
      const forTheMedicines = t("each of the {{num}} medicines", { num: jobDraft.medicines.length });
      showDialog({
        title:
          <Box>
            <Typography variant="h4" align="center" color="primary" sx={{ fontWeight: "bold", mt: 2 }}>
              {t("Well done!")}
            </Typography>
            <Typography variant="h3" align="center" sx={{ mt: 3 }}>
              🏁
            </Typography>
          </Box>,
        message:
          <Box>
            <Typography variant="body2" sx={{ mt: 3 }}>
              {t("\
You have completed the configration of this job: for {{oneOrManyMedicines}} you configured, \
a request will be sent via email to the doctor \
just in time when the medicine is needed.",
                { oneOrManyMedicines: jobDraft.medicines.length === 1 ? forTheMedicine : forTheMedicines })
              }
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              {t("\
Now, you will be able to see the job in your jobs list, where you can manage it by suspending, editing, or deleting it.")}
            </Typography>
          </Box>,
        confirmText: t("Ok"),
        onConfirm: () => {
          setHasNavigatedAway(true);
          navigate('/jobs-handle', { replace: true });
        }
      });
    } else {
      showDialog({
        title: t("Job confirmed"),
        message: t("You can now see this job in your jobs list."),
        confirmText: t("Ok"),
        onConfirm: () => {
          setHasNavigatedAway(true);
          navigate('/jobs-handle', { replace: true });
        }
      });
    }
  };

  const objectIsEmpty = (obj) => { // TODO: move to libs/misc.js
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }
    return true;
  }

  const jobIsEmpty = () => {
    console.log("jobIsEmpty - jobDraft:", jobDraft);
    if (!jobDraft) return true;
    console.log("jobIsEmpty - jobDraft.id:", jobDraft.id);
    if (jobDraft.id !== null) return false; 
    console.log("jobIsEmpty - jobDraft.patient:", jobDraft.patient);
    if (!objectIsEmpty(jobDraft.patient)) return false;
    console.log("jobIsEmpty - jobDraft.doctor:", jobDraft.doctor);
    if (!objectIsEmpty(jobDraft.doctor)) return false;
    console.log("jobIsEmpty - jobDraft.isActive:", jobDraft.isActive);  
    if (jobDraft.isActive !== false) return false;
    console.log("jobIsEmpty - jobDraft.isConfirmed:", jobDraft.isConfirmed);  
    if (jobDraft.isConfirmed !== false) return false;
    console.log("jobIsEmpty - jobDraft.medicines:", jobDraft.medicines);
    if (!Array.isArray(jobDraft.medicines) || jobDraft.medicines.length > 0) return false;
    console.log("jobIsEmpty - anyStepCompleted():", anyStepCompleted());
    if (anyStepCompleted()) return false;
    console.log("jobIsEmpty - jobDraft.timestampCreation:", jobDraft.timestampCreation);
    if (jobDraft.timestampCreation !== 0) return false;
    console.log("jobIsEmpty - jobDraft.timestampLastModification:", jobDraft.timestampLastModification);
    if (jobDraft.timestampLastModification !== 0) return false;
    return true;
  };

  const cancelJobDraft = () => {
    if (isMedicinesEditing) {
      // TODO: test this use case... canceling when editing medicines...
    }

    const confirm = () => {
      setHasNavigatedAway(true);
      navigate('/jobs-handle', { replace: true });
    };

    if (jobIsEmpty()) {
      return confirm(); // do not ask for confirmation if job is empty
    }

    showDialog({
      title: t("Job canceled"),
      message: t("Are you sure you want to cancel this job? All unconfirmed changes will be lost."),
      confirmText: t("Yes, cancel job"),
      cancelText: t("No, continue"),
      onConfirm: () => confirm()
    });
      
  };

  // Render layout
  const renderStep = () => {
    
    console.log("ìììììììììì renderStep jobDraft:", jobDraft, jobDraft.currentStep);

    switch (jobDraft.currentStep ?? 0) {
      case 0:
        return (
          <>
            <JobPatient
              data={jobDraft.patient}
              fields={fieldsPatient}
              onChange={(val) => handleUpdate('patient', val)}
              onValid={setPatientValid}
              hasNavigatedAway={hasNavigatedAway} 
            />
            <JobDoctor
              data={jobDraft.doctor}
              fields={fieldsDoctor}
              onChange={(val) => handleUpdate('doctor', val)}
              onValid={setDoctorValid}
              hasNavigatedAway={hasNavigatedAway} 
            />
          </>
        );
      case 1:
        return (
          <JobMedicines
            data={jobDraft.medicines}
            onChange={(val) => handleUpdate('medicines', val)}
            onEditingChange={setIsMedicinesEditing}
            onCompleted={(res) => handleStepCompleted(jobDraft.currentStep, res)}
            hasNavigatedAway={hasNavigatedAway} 
          />
        );
      // case 2:
      //   return (
      //     <JobEmailTemplate
      //       data={job.emailTemplate}
      //       job={job}
      //       onChange={(val) => handleUpdate('emailTemplate', val)}
      //       onCompleted={(res) => handleStepCompleted(job.currentStep, res)}
      //     />
      //   );
      case 2:
        return (
          <JobConfirmationReview
            data={jobDraft}
            onCompleted={(res) => handleStepCompleted(jobDraft.currentStep, res)}
            hasNavigatedAway={hasNavigatedAway} 
          />
        );
      default:
        return null;
    }
  };

  console.log("JOB DRAFT:", jobDraft);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>

      <SectionHeader1>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            width: '100%',
          }}
        >
          {/* Menu icon, anchored left */}
          <Box sx={{ position: 'absolute', left: 0, display: 'flex', alignItems: 'center' }}>
            <Tooltip title={t('Go to jobs list')} arrow>
              <IconButton
                onClick={goToJobsList}
                sx={{ color: 'background.default' }}
              >
                <Menu />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Centered header text */}
          <Box sx={{ ml: 4 }}>
            {
              (isMobile ?
                t('Config. Job') :
                t('Configure Job')
              //) + ' ' + (id ? 1 + id : 1) // TODO: use job index, not ID ...
              ) + ` ${1 + getJobNumberById(jobId)}`
            }
          </Box>
        </Box>
      </SectionHeader1>

      <Stepper
        activeStep={jobDraft.isConfirmed ? maxSteps : jobDraft.currentStep} // if job is confirmed, set last step as active
        sx={{ mb: 4 }} 
        alternativeLabel={isMobile}
      >
        {steps.map((step, index) => (
          <Step
            key={step.id}
            completed={jobDraft.stepsCompleted ? jobDraft.stepsCompleted[index] : false}
            onClick={() => handleGoto(index)}
          >
            <StepLabel
              icon={
                <CustomStepIcon
                  stepIndex={index+1}
                  completed={jobDraft.stepsCompleted ? jobDraft.stepsCompleted[index] : false}
                  //active={index === job.currentStep}
                  current={index === jobDraft.currentStep}
                />
              }
              onClick={() => handleGoto(index)}
            >
              <Typography variant="body2" sx={{ fontWeight: index === jobDraft.currentStep ? 'bold' : 'normal' }}>
                {step.label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Content */}
      <Box sx={{ mb: 4 }}>
        {renderStep()}
      </Box>

      {/* Navigation Buttons */}
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            onClick={handleBack}
            startIcon={<ArrowBack />}
            variant="contained"//"outlined"
            disabled={(jobDraft.currentStep === 0) || isMedicinesEditing}
            //size="small"
            size="medium"
            sx={{ 
              opacity: jobDraft.currentStep === 0 ? 0 : 0.75,
              '&:hover': {
                opacity: jobDraft.currentStep === 0 ? 0 : 0.90,
              }
            }}
          >
            {t("Previous")}
          </Button>

          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" color="text.secondary">
              {t("Step")} {(jobDraft.currentStep ?? 0)+ 1} {t("of")} {maxSteps}
            </Typography>
          </Box>

          <Button
            onClick={isLastStep() ? handleConfirm : handleNext}
            endIcon={isLastStep() ? <Check /> : <ArrowForward />}
            variant="contained"
            disabled={isMedicinesEditing}
            size={isLastStep ? "large" : "medium" }
          >
            {
              isLastStep() ?
                (
                  jobDraft.isActive ?
                    t('Confirm!')
                  :
                    (isMobile ? t('Confirm!') : t('Confirm and activate!'))
                )
              :
                t('Next')}
          </Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            onClick={cancelJobDraft}
            endIcon={<Clear />}
            variant="outlined"
            size={"medium"}
          >
            {t('Cancel')}
          </Button>

        </Box>
      </Paper>
    </Container>
  );
};

const CustomStepIcon = (props) => {
  const { stepIndex, completed, current, } = props;

  // Colors: green if completed, yellow if not completed
  const backgroundColor = completed ? '#739a4d' : '#eeee44'; // green or yellow
  const textColor       = completed ? '#ffffff' : '#000000'; // white text on green, black on yellow

  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        color: textColor,
        border: current ? '4px solid #555' : 'none', // optional: highlight active step
        cursor: 'pointer',
      }}
    >
      <Typography variant="caption" component="span">
        {stepIndex}
      </Typography>
    </Box>
  );
};

export default React.memo(JobFlow);
