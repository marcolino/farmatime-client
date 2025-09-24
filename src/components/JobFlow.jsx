import React, { useState, useEffect, useContext, useRef } from 'react';
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
import { JobContext, steps, fieldsPatient, fieldsDoctor } from '../providers/JobContext';
import { useDialog } from "../providers/DialogContext";
import {
  // validateJobPatientFirstName, validateJobPatientLastName, validateJobPatientEmail,
  // validateJobDoctorName, validateJobDoctorEmail,
  validateAllFields,
} from '../libs/Validation';
import { objectsAreDeepEqual } from '../libs/Misc';
//import { AuthContext } from '../providers/AuthContext';
import { useSnackbarContext } from "../providers/SnackbarProvider";
import JobPatient from './JobPatient';
import JobDoctor from './JobDoctor';
import JobMedicines from './JobMedicines';
//import JobEmailTemplate from './JobEmailTemplate';
import JobConfirmationReview from './JobConfirmationReview';

const JobFlow = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbarContext();
  const { showDialog } = useDialog();
  const {
    getJobById, getJobNumberById, confirmJob, setJobs, confirmJobsOnServer, jobIsEmpty, jobsError, clearJobsError,
    jobDraftIsDirty, setJobDraftDirty, emailTemplate, setEmailTemplate, confirmEmailTemplateOnServer,
  } = useContext(JobContext);

  // The job draft we edit in this component
  const [jobDraft, setJobDraft] = useState(getJobById(jobId));

  // Keep an immutable reference to the original job draft
  //const jobDraftOriginalRef = useRef(structuredClone(jobDraft));
  const jobDraftOriginalRef = useRef(null);


  // Avoid showing field consistency errors before user has navigated away from a step (the first one only, currently)
  const [hasNavigatedAway, setHasNavigatedAway] = useState(false);

  // We need these because both patient and doctor are in step 0
  const [patientValid, setPatientValid] = useState(() => validateAllFields(jobDraft, fieldsPatient, jobDraft.patient));
  const [doctorValid, setDoctorValid] = useState(() => validateAllFields(jobDraft, fieldsDoctor, jobDraft.doctor));

  // State to track if medicines are being edited
  const [isMedicinesEditing, setIsMedicinesEditing] = useState(false);
  
  // Watch both validation states for first step and update step completion accordingly
  useEffect(() => {
    handleStepCompleted(0, patientValid && doctorValid);
  }, [patientValid, doctorValid]);
  
  // When entering component, if editing a new job set date of creation to now, otherwise set currentStep to 0
  useEffect(() => {
    setJobDraft(prev => {
      let updated;
      if (prev.id !== 'new') {
        updated = { ...prev, currentStep: 0 };
      } else {
        updated = { ...prev, timestampCreation: Date.now() };
      }

      if (!jobDraftOriginalRef.current) {
        jobDraftOriginalRef.current = structuredClone(updated);
      }

      return updated;
    });
  }, []);

  // When a change is made to jobDraft, call setJobDraftDirty in context, so anyone will be able to detect unsaved job changes
  useEffect(() => {
    const changed = jobDraftOriginalRef.current && !objectsAreDeepEqual(jobDraft, jobDraftOriginalRef.current, { exclude: ['currentStep'] });
    //if (changed) console.warn("DIRTY");
    setJobDraftDirty(!!changed);
  }, [jobDraft, setJobDraftDirty]);

  // Show job errors to the user
  useEffect(() => {
    if (jobsError) {
      let message;
      if (jobsError.type === "load") {
        message = `${t("Failed to load jobs")}. ${t("Please try again")}.`;
      } else if (jobsError.type === "store") {
        message = `${t("Failed to store jobs")}. ${t("Please try again")}.`;
      } else {
        message = jobsError.message ?? "An unexpected error occurred.";
      }
      showSnackbar(message, "error");
      clearJobsError(); // Reset error so it doesn't retrigger
    }
  }, [jobsError, showSnackbar, t]);

  // Warn user before closing this page/tab if job draft was changed and not saved (confirmed)
  // useEffect(() => {
  //   if (jobDraftWasChanged) {

  //   }
  // }, [jobDraftWasChanged]);

  // useEffect(() => {
  //   console.log("Current path:", location.pathname);
  //   return () => {
  //     console.log("Leaving path:", location.pathname);
  //     if (jobDraftWasChanged) {
  //       alert("confirm before going");
  //     }
  //   };
  // }, [jobDraftWasChanged]);

  // Warn user before unloading this page/tab if job draft was changed and not saved (confirmed)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (jobDraftIsDirty) {
        alert(jobDraftIsDirty);
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [jobDraftIsDirty, jobId]);
  
  // If not all previous steps are completed, then set last step completion to false
  useEffect(() => {
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

    
  // If any change when editing job, then set last step completion to false
  useEffect(() => {
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
  
  // Check if current step is the final one
  const isLastStep = () => {
    return jobDraft.currentStep === steps().length - 1;
  };

  // Navigation handlers
  const goToJobsList = () => {
    cancelJobDraft();
  };

  const handleNext = () => {
    // If jobMedicines is editing, spit a warning and return immediately
    if (isMedicinesEditing) {
      return showSnackbar(t("Please finish editing medicines before proceeding"), "warning");
    }
    setJobDraft(prev => ({
      ...prev,
      currentStep: Math.min((prev.currentStep ?? 0) + 1, steps().length - 1)
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
    if (index < 0 || index > steps().length - 1) { // should not happen 
      console.error(`Cannot goto index ${index}, it's out of range [0-${steps().length - 1}]`);
      return;
    }
    setJobDraft(prev => ({
      ...prev,
      currentStep: index
    }));
    setHasNavigatedAway(true);
  };

  const setJobDraftByKey = (keyOrObject, value) => {
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

  // const setJobDraftByObject = (obj) => {
  //   setJobDraft(prevJob => {
  //     if (typeof obj !== "object") { // obj must be an object
  //       console.warn("setJobDraftByObject: Invalid object:", obj);
  //       return prevJob;
  //     }
  //     if (obj === null) {
  //       return prevJob; // no change
  //     }
  //     return {
  //       ...prevJob,
  //       ...obj,
  //     };
  //   });
  // };

  const handleStepCompleted = (stepIndex, result) => {
    console.log("++x JobFlow - handleStepCompleted - step index:", stepIndex, "result:", result);
    setJobDraft(prev => ({
      ...prev,
      stepsCompleted:
        prev.stepsCompleted ?
          (prev.stepsCompleted.map((val, idx) => idx === stepIndex ? result : val)) :
          []
    }));
  };

  // const anyStepCompleted = () => { // Check if any previous step is completed
  //   const lastIndex = jobDraft.stepsCompleted.length - 1;
  //   return jobDraft.stepsCompleted
  //     .slice(0, lastIndex)
  //     .some(Boolean)
  //   ;
  // };

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

    const wasNew = jobDraft.id === 'new';

    const jobDraftConfirmed = {
      ...jobDraft,
      stepsCompleted: (jobDraft.stepsCompleted.map((val, idx) => idx === steps().length - 1 ? true : val)),
      isActive: jobDraft.isActive || wasNew/*!jobDraft.isConfirmed*/, // Mark job as active if job was active or unconfirmed
      //isConfirmed: true, // Mark job as confirmed
      timestampLastModification: Date.now(), // Set timestamp of last modification to now
    };

    const jobsConfirmed = confirmJob(jobDraftConfirmed);
    if (await confirmJobsOnServer(jobsConfirmed)) {
      setJobDraft(jobDraftConfirmed);
      setJobs(jobsConfirmed);
    } else { // errors are handled with jobsError
      return;
    }
    
    if (await confirmEmailTemplateOnServer(emailTemplate)) {
      setEmailTemplate(emailTemplate);
    } else { // errors are handled with jobsError
      return;
    }

    // jobs are confirmed on server: show dialog to the user
    if (wasNew) {
      const forTheMedicine = t("the medicine");
      const forTheMedicines = t("each of the {{num}} medicines", { num: jobDraft.medicines.length });
      showDialog({
        title:
          <Box>
            <Typography variant="h4" align="center" color="info.contrastText" sx={{ fontWeight: "bold", mt: 2 }}>
              {t("Well done!")}
            </Typography>
            <Typography variant="h3" align="center" sx={{ my: 2 }}>
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
          setJobDraftDirty(false);
          navigate('/jobs-handle', { replace: true });
        }
      });
    } else {
      showSnackbar(t("Job confirmed"), 'info');
      setHasNavigatedAway(true);
      setJobDraftDirty(false);
      navigate('/jobs-handle', { replace: true });
      // showDialog({
      //   title: t("Job confirmed"),
      //   message: t("You can now see this job in your jobs list."),
      //   confirmText: t("Ok"),
      //   onConfirm: () => {
      //     setHasNavigatedAway(true);
      //     navigate('/jobs-handle', { replace: true });
      //   }
      // });
    }
  };

  const cancelJobDraft = () => {
    const proceed = () => {
      setHasNavigatedAway(true);
      setJobDraftDirty(false);
      navigate('/jobs-handle', { replace: true });
    };

    //if (jobIsEmpty(jobDraft) || !jobDraftWasChanged) {
    if (jobIsEmpty(jobDraft) || !jobDraftIsDirty) {
      return proceed(); // do not ask for confirmation if job is empty or not changed
    }

    showDialog({
      title: t("Job canceled"),
      message: t("Are you sure you want to cancel the job edits you have just done? All changes will be lost."),
      confirmText: t("Yes, cancel changes"),
      cancelText: t("No, continue"),
      onConfirm: () => proceed(),
    });
      
  };

  // Render layout
  const renderStep = () => {
    
    console.log("renderStep jobDraft:", jobDraft, jobDraft.currentStep);

    switch (jobDraft.currentStep ?? 0) {
      case 0:
        return (
          <>
            <JobPatient
              jobDraft={jobDraft}
              data={jobDraft.patient}
              fields={fieldsPatient}
              onChange={(val) => setJobDraftByKey('patient', val)}
              onValid={setPatientValid}
              hasNavigatedAway={hasNavigatedAway} 
            />
            <JobDoctor
              jobDraft={jobDraft}
              data={jobDraft.doctor}
              fields={fieldsDoctor}
              onChange={(val) => setJobDraftByKey('doctor', val)}
              onValid={setDoctorValid}
              hasNavigatedAway={hasNavigatedAway} 
            />
          </>
        );
      case 1:
        return (
          <JobMedicines
            //jobDraft={jobDraft}
            data={jobDraft.medicines}
            onChange={(val) => setJobDraftByKey('medicines', val)}
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
      //       onChange={(val) => setJobDraftByKey('emailTemplate', val)}
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

  console.log("JOB DRAFT:", jobDraft, jobId);
  console.log("JOB DRAFT stepsCompleted:", jobDraft.stepsCompleted);
  
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
              ) + ` ${getJobNumberById(jobId)}`
            }
          </Box>
        </Box>
      </SectionHeader1>

      <Stepper
        activeStep={/*jobDraft.isConfirmed ? steps().length : */jobDraft.currentStep} // if job is confirmed, set last step as active
        sx={{ mb: 4 }} 
        alternativeLabel={isMobile}
      >
        {steps(isMobile).map((step, index) => (
          <Step
            key={step.id}
            completed={jobDraft.stepsCompleted ? jobDraft.stepsCompleted[index] : false}
            onClick={() => handleGoto(index)}
          >
            <StepLabel
              icon={
                <CustomStepIcon
                  stepIndex={index}
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
      <Container maxWidth="lg" sx={{ py: 0 }}>
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
              {isMobile ?
                t('Prev.') :
                t('Previous')
              }
            </Button>
            

            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" color="text.secondary">
                {t("Step")} {(jobDraft.currentStep ?? 0)+ 1} {t("of")} {steps().length}
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
      
    </Container>
  );
};

// TODO: move to mui-material-custom
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
        {1 + stepIndex}
      </Typography>
    </Box>
  );
};

export default React.memo(JobFlow);
