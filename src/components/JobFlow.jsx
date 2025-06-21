import { useState, useContext } from 'react';
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
import JobPatient from './JobPatient';
import JobDoctor from './JobDoctor';
import JobMedicines from './JobMedicines';
import JobEmailTemplate from './JobEmailTemplate';
import JobConfirmationReview from './JobConfirmationReview';

const JobFlow = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { job, setJob } = useContext(JobContext);

  // Navigation state
  const currentStep = job.currentStep;
  //const [currentStep, setCurrentStep] = useState(0);

  // Define steps based on screen size
  const steps = [
    { id: 0, label: t('Patient & Doctor Info') },
    { id: 1, label: t('Medicines') },
    { id: 2, label: t('Email Template') },
    { id: 3, label: t('Confirmation') }
  ];

  const maxSteps = steps.length;

  const [isMedicinesEditing, setIsMedicinesEditing] = useState(false);

  // Navigation handlers
  const handleNext = () => {
    // TODO: if jobMedicines is editing, spit a warning and return immediately
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
    // TODO: if jobMedicines is editing, spit a warning and return immediately
    setJob(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0)
    }));
  };

  const handleGoto = (index) => {
    // TODO: if jobMedicines is editing, spit a warning and return immediately
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
    setJob(prev => ({ ...prev, [key]: value }));
  };

  const handleConfirm = () => {
    handleUpdate('isConfirmed', true);
    alert(t('Service activated successfully!'));
    // TODO: Redirect logic here
  };

  // const handleConfirm = () => {
  //   setIsConfirmed(true);
  //   alert(t('Service activated successfully!'));
  //   // TODO: Redirect logic here
  // };

  //const isLastStep = currentStep === maxSteps - 1;
  const isLastStep = job.currentStep === maxSteps - 1;

  // Render layout
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <JobPatient data={job.patient} onChange={(val) => handleUpdate('patient', val)} />
            <JobDoctor data={job.doctor} onChange={(val) => handleUpdate('doctor', val)} />
          </>
        );
      case 1:
        return (
          <JobMedicines data={job.medicines} onChange={(val) => handleUpdate('medicines', val)} onEditingChange={setIsMedicinesEditing} />
        );
      case 2:
        return (
          <JobEmailTemplate data={job.emailTemplate} job={job} onChange={(val) => handleUpdate('emailTemplate', val)} />
        );
      case 3:
         return (
         <JobConfirmationReview data={job} />
        );
      default:
        console.error(`Invalid step in renderStep: ${currentStep}, valid steps are [0-${maxSteps-1}]`);
        return null;
    }
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
          {t('MediCare Service Setup')}
        </Typography>
      </Paper>

      {/* Stepper */}
      <Stepper 
        //activeStep={isConfirmed ? maxSteps : currentStep}
        activeStep={job.isConfirmed ? maxSteps : job.currentStep}
        sx={{ mb: 4 }} 
        alternativeLabel={isMobile}
      >
        {steps.map((step, index) => (
          <Step
            key={step.id}
            //completed={isConfirmed ? true : index < currentStep}
            completed={job.isConfirmed ? true : index < job.currentStep}
            onClick={() => handleGoto(index) }
          >
            <StepLabel 
              slotProps={{
                stepIcon: {
                  //completed: isConfirmed || index < currentStep
                  completed: job.isConfirmed || index < currentStep
                }
              }}
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

export default JobFlow;
