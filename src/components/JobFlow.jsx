import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  useTheme,
  useMediaQuery,
} from 'mui-material-custom';
import { ArrowBack, ArrowForward, Check } from '@mui/icons-material';
import { SectionHeader1 } from 'mui-material-custom';
import { JobContext } from '../providers/JobContext';
import { useDialog } from "../providers/DialogContext";
import {
  validateJobPatientFirstName, validateJobPatientLastName, validateJobPatientEmail,
  validateJobDoctorName, validateJobDoctorEmail,
  validateAllFields,
} from '../libs/Validation';
import { useSnackbarContext } from "../providers/SnackbarProvider";
import JobPatient from './JobPatient';
import JobDoctor from './JobDoctor';
import JobMedicines from './JobMedicines';
//import JobEmailTemplate from './JobEmailTemplate';
import JobConfirmationReview from './JobConfirmationReview';

const JobFlow = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { showSnackbar } = useSnackbarContext();
  const { showDialog } = useDialog();
  const { job, setJob, jobError } = useContext(JobContext);

  // Navigation state
  const currentStep = job.currentStep; // TODO: always use job.currentStep ?
 
  const steps = [
    { id: 0, label: isMobile ? t('Patient & Doctor') : t('Patient & Doctor Info') },
    { id: 1, label: t('Medicines') },
    //{ id: 2, label: t('Email Template') }, // TODO: remove this step from main steps, it is moved to advanced tools
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

  // we need these because both patient and doctor are in step 0
  const [patientValid, setPatientValid] = useState(() => validateAllFields(fieldsPatient, job.patient));
  const [doctorValid, setDoctorValid] = useState(() => validateAllFields(fieldsDoctor, job.doctor));

  const [isMedicinesEditing, setIsMedicinesEditing] = useState(false);

  // Watch both validation states and update step completion accordingly
  useEffect(() => {
    handleStepCompleted(0, patientValid && doctorValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientValid, doctorValid]);
  
  // Show job errors to the user
  useEffect(() => {
   if (jobError) {
      let message = "An unexpected error occurred.";
      if (jobError.type === "load") {
        message = "Failed to load job data. Please try again.";
      } else if (jobError.type === "store") {
        message = "Failed to save job data. Please try again.";
      }
      showSnackbar(message, "error");
    }
  }, [jobError, showSnackbar]);

  // If not all previous are completed, set last step completion to false
  useEffect(() => {
    if (!job.stepsCompleted) return; // safety check

    const lastIndex = job.stepsCompleted.length - 1;
    const allPreviousCompleted = job.stepsCompleted
      .slice(0, lastIndex)
      .every(Boolean)
    ;
    if (!allPreviousCompleted && job.stepsCompleted[lastIndex]) {
      // Reset last step completion to false
      setJob(prev => ({
        ...prev,
        stepsCompleted: prev.stepsCompleted.map((val, idx) =>
          idx === lastIndex ? false : val
        ),
      }));
    }
  }, [job.stepsCompleted, setJob]);

  // Navigation handlers
  const handleNext = () => {
    // If jobMedicines is editing, spit a warning and return immediately
    if (isMedicinesEditing) {
      alert(t('Please finish editing medicines before proceeding...')); //TODO: use Snackbar
      return;
    }
    setJob(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, maxSteps - 1)
    }));
  };

  const handleBack = () => {
    // If jobMedicines is editing, spit a warning and return immediately
    if (isMedicinesEditing) {
      alert(t('Please finish editing medicines before proceeding...')); //TODO: use Snackbar
      return;
    }
    setJob(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0)
    }));
  };

  const handleGoto = (index) => {
    // If jobMedicines is editing, spit a warning and return immediately
    if (isMedicinesEditing) {
      alert(t('Please finish editing medicines before proceeding...')); //TODO: use Snackbar
      return;
    }
    if (index < 0 || index > maxSteps - 1) {
      console.error(`Cannot goto index ${index}, it's out of range [0-${maxSteps - 1}]`);
      return;
    }
    setJob(prev => ({
    ...prev,
    currentStep: index
  }));
  };

  const handleUpdate = (key, value) => {
    const updatedJob = { // Create updated job object by spreading current job and updating key
      ...job,
      [key]: value,
    };
    setJob(updatedJob); // Pass updated job object directly to setJob
  };

  const handleStepCompleted = (stepIndex, result) => {
    console.log("JobFlow - handleStepCompleted - step index:", stepIndex, "result:", result);
    setJob(prev => ({
      ...prev,
      stepsCompleted: prev.stepsCompleted.map((val, idx) =>
        idx === stepIndex ? result : val
      )
    }));
  };

  // const isAllCompleted = () => {
  //   console.log("JobFlow - isAllCompleted:", job.stepsCompleted);
  //   return job.stepsCompleted.every(Boolean);
  // }

  const handleConfirm = () => {
    // if not all previous steps are completed, show a warning and return...
    const lastIndex = job.stepsCompleted.length - 1;
    const allPreviousCompleted = job.stepsCompleted
      .slice(0, lastIndex)
      .every(Boolean)
    ;
    if (!allPreviousCompleted) {
      showSnackbar("Please complete all steps", "warning");
      return;
    }

    handleUpdate('isConfirmed', true); // TODO: ditch isConfirmed...
    handleStepCompleted(lastIndex, true); // mark this last step as completed
    const forTheMedicine = t("for the medicine");
    const forTheMedicines = t("for each of the {{num}} medicines", { num: job.medicines.length });
    showDialog({
      title:
        <Box>
          <Typography variant="h4" align="center" color="primary" sx={{ fontWeight: "bold", mt: 2 }}>
            {t("Well done!")}
          </Typography>
          <Typography variant="h2" align="center" sx={{ mt: 3 }}>
            🏁
          </Typography>
        </Box>,
      message:
        <Box>
          <Typography variant="body2" sx={{ mt: 3}}>
            {t("\
You have completed the setup for this activity: {{oneOrMany}} you configured, \
a request will be sent via email to the doctor \
just in time when the medicine is needed.",
              { oneOrMany: job.medicines.length === 1 ? forTheMedicine : forTheMedicines })
            }
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            {t("\
Now, you will be able to see the activity in your activity list, where you can manage it by suspending, editing, or deleting it.")}
          </Typography>
        </Box>,
      confirmText: t("Ok"),
      onConfirm: () => {
        navigate('/jobs-handle');
      }
    });
  };

  const isLastStep = job.currentStep === maxSteps - 1;

  // Render layout
  const renderStep = () => {
    switch (job.currentStep) {
      case 0:
        return (
          <>
            <JobPatient
              data={job.patient}
              fields={fieldsPatient}
              onChange={(val) => handleUpdate('patient', val)}
              onValid={setPatientValid}
            />
            <JobDoctor
              data={job.doctor}
              fields={fieldsDoctor}
              onChange={(val) => handleUpdate('doctor', val)}
              onValid={setDoctorValid}
            />
          </>
        );
      case 1:
        return (
          <JobMedicines
            data={job.medicines}
            onChange={(val) => handleUpdate('medicines', val)}
            onEditingChange={setIsMedicinesEditing}
            onCompleted={(res) => handleStepCompleted(job.currentStep, res)}
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
            data={job}
            onCompleted={(res) => handleStepCompleted(job.currentStep, res)}
          />
        );
      default:
        return null;
    }
  };

  console.log("JOB:", job);
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <SectionHeader1>
        {t('Configure Activity')}
      </SectionHeader1>
      <Stepper
        activeStep={job.isConfirmed ? maxSteps : job.currentStep}
        sx={{ mb: 4 }} 
        alternativeLabel={isMobile}
      >
        {/*
          <Step
            key={step.id}
            completed={job.stepsCompleted[index]}
            onClick={() => handleGoto(index)}
          >
            <StepLabel 
              StepIconComponent={(iconProps) => (
                <CustomStepIcon
                  {...iconProps}
                  current={index === job.currentStep}
                />
              )}
              onClick={() => {
                handleGoto(index);
              }}
            >
              {step.label}
            </StepLabel>
          </Step>
        */}
        {steps.map((step, index) => (
          <Step
            key={step.id}
            completed={job.stepsCompleted[index]}
            onClick={() => handleGoto(index)}
          >
            <StepLabel
              icon={
                <CustomStepIcon
                  stepIndex={index+1}
                  completed={job.stepsCompleted[index]}
                  //active={index === job.currentStep}
                  current={index === job.currentStep}
                />
              }
              onClick={() => handleGoto(index)}
            >
              {step.label}
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
            disabled={currentStep === 0}
            startIcon={<ArrowBack />}
            variant="contained"//"outlined"
            //size="small"
            size="medium"
            sx={{ 
              opacity: currentStep === 0 ? 0 : 0.75,
              '&:hover': {
                opacity: currentStep === 0 ? 0 : 0.90,
              }
            }}
          >
            {t("Previous")}
          </Button>

          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" color="text.secondary">
              {t("Step")} {currentStep + 1} {t("of")} {maxSteps}
            </Typography>
          </Box>

          <Button
            onClick={isLastStep ? handleConfirm : handleNext}
            endIcon={isLastStep ? <Check /> : <ArrowForward />}
            variant="contained"
            //disabled={isConfirmed}
            size={isLastStep ? "large" : "medium" }
          >
            {isLastStep ? (isMobile ? t('Activate!') : t('Confirm and activate!')) : t('Next')} {/* TODO... */}
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
