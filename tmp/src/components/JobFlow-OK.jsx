import { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
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
} from '@mui/material';
import { ArrowBack, ArrowForward, Check } from '@mui/icons-material';
import { JobContext } from '../providers/JobContext';
import { useSnackbarContext } from "../providers/SnackbarProvider";
import JobPatient from './JobPatient';
import JobDoctor from './JobDoctor';
import JobMedicines from './JobMedicines';
import JobEmailTemplate from './JobEmailTemplate';
import JobConfirmationReview from './JobConfirmationReview';

const JobFlow = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { showSnackbar } = useSnackbarContext();
  const { job, setJob, jobError } = useContext(JobContext);
  const [patientValid, setPatientValid] = useState(false); // we need this because both patient and doctor are in step 0
  const [doctorValid, setDoctorValid] = useState(false); // we need this because both patient and doctor are in step 0

  // Navigation state
  const currentStep = job.currentStep; // TODO: always use job.currentStep ?
  //const [currentStep, setCurrentStep] = useState(0);

  // Define the steps
  // const steps = [
  //   { id: 0, label: t('Patient & Doctor Info'), isCompleted: false },
  //   { id: 1, label: t('Medicines'), isCompleted: false },
  //   { id: 2, label: t('Email Template'), isCompleted: false },
  //   { id: 3, label: t('Confirmation'), isCompleted: false }
  // ];
  const [steps, setSteps] = useState([
    { id: 0, label: t('Patient & Doctor Info') },
    { id: 1, label: t('Medicines') },
    { id: 2, label: t('Email Template') },
    { id: 3, label: t('Confirmation') }
  ]);
  const maxSteps = steps.length;

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
    //steps[step].isCompleted = result;
    // setSteps(prevSteps => {
    //   const newSteps = prevSteps.map((step, index) => {
    //     if (index === stepIndex) {
    //       return { ...step, isCompleted: result };
    //     }
    //     return step;
    //   });
    //   return newSteps;
    // });
    setJob(prev => ({
      ...prev,
      stepsCompleted: prev.stepsCompleted.map((val, idx) =>
        idx === stepIndex ? result : val
      )
    }));
  };

  // const isAllCompleted = () => {
  //   let completed = true;
  //   steps.forEach(step => {
  //     if (!step.isCompleted) {
  //       completed = false;
  //       return; // break forEach loop
  //     }
  //   });
  //   console.log("JobFlow - isAllCompleted:", completed, "(",
  //     steps[0].isCompleted,
  //     steps[1].isCompleted,
  //     steps[2].isCompleted,
  //     steps[3].isCompleted,
  //     ")"
  //   );
  //   return completed;
  // };
  const isAllCompleted = () => {
    console.log("JobFlow - isAllCompleted:", job.stepsCompleted);
    return job.stepsCompleted.every(Boolean);
  }

  const handleConfirm = () => {
    handleUpdate('isConfirmed', true); // TODO: ditch isConfirmed...
    handleStepCompleted(3, true);
    alert(t('Service activated successfully!'));
    // TODO: Redirect logic here
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
            onChange={(val) => handleUpdate('patient', val)}
            onValid={setPatientValid}
          />
          <JobDoctor
            data={job.doctor}
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
          onCompleted={(res) => handleStepCompleted(1, res)}
        />
      );
    case 2:
      return (
        <JobEmailTemplate
          data={job.emailTemplate}
          job={job}
          onChange={(val) => handleUpdate('emailTemplate', val)}
          onCompleted={(res) => handleStepCompleted(2, res)}
        />
      );
    case 3:
      return (
        <JobConfirmationReview
          data={job}
          onCompleted={(res) => handleStepCompleted(3, res)}
        />
      );
    default:
      return null;
  }
    // switch (currentStep) {
    //   case 0:
    //     return (
    //       <>
    //         <JobPatient
    //           data={job.patient}
    //           onChange={(val) => handleUpdate('patient', val)}
    //           onValid={setPatientValid}
    //         />
    //         <JobDoctor
    //           data={job.doctor}
    //           onChange={(val) => handleUpdate('doctor', val)}
    //           onValid={setDoctorValid}
    //         />
    //       </>
    //     );
    //   case 1:
    //     return (
    //       <JobMedicines data={job.medicines} onChange={(val) => handleUpdate('medicines', val)} onEditingChange={setIsMedicinesEditing} onCompleted={(res) => handleStepCompleted(1, res)} />
    //     );
    //   case 2:
    //     return (
    //       <JobEmailTemplate data={job.emailTemplate} job={job} onChange={(val) => handleUpdate('emailTemplate', val)} onCompleted={(res) => handleStepCompleted(2, res)} />
    //     );
    //   case 3:
    //      return (
    //      <JobConfirmationReview data={job} onCompleted={(res) => handleStepCompleted(3, res)}/>
    //     );
    //   default:
    //     console.error(`Invalid step in renderStep: ${currentStep}, valid steps are [0-${maxSteps - 1}]`);
    //     return null;
    // }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4, 
          bgcolor: 'primary.main',
          color: 'info.contrastText',
        }}
      >
        <Typography variant="h4" align="center" sx={{ fontWeight: 'bold' }}>
          {t('Configure Farmaperte Activity')}
          - All completed: {isAllCompleted() ? "SI" : "NO"}
        </Typography>
      </Paper>

      <Stepper
        activeStep={job.isConfirmed ? maxSteps : job.currentStep}
        sx={{ mb: 4 }} 
        alternativeLabel={isMobile}
      >
        {steps.map((step, index) => (
          <Step
            key={step.id}
            //completed={isConfirmed ? true : index < currentStep}
            completed={ job.stepsCompleted[index] /*job.isConfirmed ? true : index < job.currentStep*/ }
            onClick={() => handleGoto(index) }
          >
            <StepLabel 
              // slotProps={{
              //   stepIcon: {
              //     //completed: isConfirmed || index < currentStep
              //     completed: job.stepsCompleted[index] /*job.isConfirmed || index < currentStep*/
              //   }
              // }}
              StepIconComponent={CustomStepIcon}
              onClick={() => {
                handleGoto(index);
              }}
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
            size="small"
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
  const { active, completed, icon } = props;

  // Colors: green if completed, yellow if not completed
  const backgroundColor = completed ? '#4caf50' : '#ffeb3b'; // green or yellow
  const textColor = completed ? '#fff' : '#000'; // white text on green, black on yellow

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
        border: active ? '2px solid #1976d2' : 'none', // optional: highlight active step
        cursor: 'pointer',
      }}
    >
      <Typography variant="caption" component="span">
        {icon}
      </Typography>
    </Box>
  );
};

export default JobFlow;
