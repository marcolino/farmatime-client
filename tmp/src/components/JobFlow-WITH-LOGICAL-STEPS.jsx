import { useState } from 'react';
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
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Chip,
} from '@mui/material';
import { ArrowBack, ArrowForward, Check } from '@mui/icons-material';
import JobPatient from './JobPatient';
import JobDoctor from './JobDoctor';
import JobMedicines from './JobMedicines';
import JobEmailTemplate from './JobEmailTemplate';


const JobFlow = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Form data state (TODO: use JobContext ...)
  const [patient, setPatient] = useState({});
  const [doctor, setDoctor] = useState({});
  const [medicines, setMedicines] = useState([]);
  const [jobEmailTemplate, setJobEmailTemplate] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  // Navigation state
  const logicalStepsNames = ['patient', 'doctor', 'medicines', 'template', 'confirm'];

  const [currentStepId, setCurrentStepId] = useState(logicalStepsNames[0]);

  // Define steps based on screen size
  const mobileSteps = [
    { code: 'patient', label: t('Patient Info') },
    { code: 'doctor', label: t('Doctor Info') },
    { code: 'medicines', label: t('Medicines') },
    { code: 'template', label: t('Email Template') },
    { code: 'confirm', label: t('Confirmation') }
  ];

  const desktopSteps = [
    { code: 'patient-doctor', label: t('Patient & Doctor Info') },
    { code: 'medicines', label: t('Medicines') },
    { code: 'template', label: t('Email Template') },
    { code: 'confirm', label: t('Review & Confirmation') }
  ];

  const steps = isMobile ? mobileSteps : desktopSteps;
  const currentStepIndex = steps.findIndex(s => s.code === currentStepId);
  const maxSteps = steps.length;
  
  const getUiStepIndex = (currentId) => {
    if (isMobile) {
      return steps.findIndex(s => s.code === currentId);
    } else {
      if (['patient', 'doctor'].includes(currentId)) return 0;
      return steps.findIndex(s => s.code === currentId);
    }
  };

  const currentUiStepIndex = getUiStepIndex(currentStepId);
  
  // Navigation handlers
  const handleNext = () => {
    const currentIndex = logicalStepsNames.indexOf(currentStepId);
    const nextStep = logicalStepsNames[Math.min(currentIndex + 1, logicalStepsNames.length - 1)];
    setCurrentStepId(nextStep);
  };

  const handleBack = () => {
    const currentIndex = logicalStepsNames.indexOf(currentStepId);
    const prevStep = logicalStepsNames[Math.max(currentIndex - 1, 0)];
    setCurrentStepId(prevStep);
  };

  const handleGoto = (index) => {
    const stepId = steps[index]?.code;
      if (stepId === 'patient-doctor') {
      setCurrentStepId('patient'); // Default to the first logical step of the group
    } else {
      setCurrentStepId(stepId);
    }
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    alert(t('Service activated successfully!'));
    // TODO: Redirect logic here
  };

  const isLastStep = currentStepId === steps[maxSteps - 1].code;

  // Render mobile layout
  const renderMobileStep = () => {
    switch (currentStepId) {
      case 'patient':
        return <JobPatient data={patient} onChange={setPatient} />;
      case 'doctor':
        return <JobDoctor data={doctor} onChange={setDoctor} />;
      case 'medicines':
        return <JobMedicines medicines={medicines} onChange={setMedicines} />;
      case 'template':
        return <JobEmailTemplate template={jobEmailTemplate} onChange={setJobEmailTemplate} />;
      case 'confirm':
        return <ConfirmationReview 
          patient={patient} 
          doctor={doctor} 
          medicines={medicines} 
          jobEmailTemplate={jobEmailTemplate} 
        />;
      default:
        console.error(`Invalid step in renderMobileStep: ${currentStepId}, valid steps are [${logicalStepsNames}]`);
        return null;
    }
  };

  // Render desktop layout
  const renderDesktopStep = () => {
    switch (currentStepId) {
      case 'patient':
        // eslint: no-fallthrough
      case 'doctor':
        return (
          <>
            <JobPatient data={patient} onChange={setPatient} />
            <JobDoctor data={doctor} onChange={setDoctor} />
          </>
        );
      case 'medicines':
        return (
          <JobMedicines medicines={medicines} onChange={setMedicines} />
        );
      case 'template':
        return (
          <JobEmailTemplate template={jobEmailTemplate} onChange={setJobEmailTemplate} />
        );
      case 'confirm':
        return (
          <ConfirmationReview 
            patient={patient} 
            doctor={doctor} 
            medicines={medicines} 
            jobEmailTemplate={jobEmailTemplate} 
          />
        );
      default:
        console.error(`Invalid step in renderDesktopStep: ${currentStepId}, valid steps are [${logicalStepsNames}]`);
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
        activeStep={isConfirmed ? steps.length : currentUiStepIndex}
        sx={{ mb: 4 }} 
        alternativeLabel={isMobile}
      >
        {steps.map((step, index) => (
          <Step
            key={step.code}
            completed={isConfirmed ? true : getUiStepIndex(currentStepId) > index}
            onClick={() => handleGoto(index)}
          >
            <StepLabel 
              slotProps={{
                stepIcon: {
                  completed: isConfirmed || getUiStepIndex(currentStepId) > index
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
        {isMobile ? renderMobileStep() : renderDesktopStep()}
      </Box>

      {/* Navigation Buttons */}
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            onClick={handleBack}
            disabled={currentStepId === 0} // TODO
            startIcon={<ArrowBack />}
            variant="contained"//"outlined"
            size="small"
            sx={{ 
              opacity: currentStepId === 0 ? 0 : 0.75, // TODO
              '&:hover': {
                opacity: currentStepId === 0 ? 0 : 0.90, // TODO
              }
            }}
          >
            {t("Previous")}
          </Button>

          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" color="text.secondary">
              {t("Step")} {currentStepIndex + 1} {t("of")} {maxSteps} {/* TODO */}
            </Typography>
          </Box>

          <Button
            onClick={isLastStep ? handleConfirm : handleNext}
            endIcon={isLastStep ? <Check /> : <ArrowForward />}
            variant="contained"
            //disabled={isConfirmed}
          >
            {isLastStep ? t('Confirm and activate service') : t('Next')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

const ConfirmationReview = ({ patient, doctor, medicines, jobEmailTemplate }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>{t('Review & Confirmation')}</Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>{t("Patient")}:</Typography>
          <Typography variant="body2">
            {patient.firstName} {patient.lastName} ({patient.email})
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>{t("Doctor")}:</Typography>
          <Typography variant="body2">
            {doctor.firstName} {doctor.lastName} ({doctor.email})
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>{t("Medicines")} ({medicines.length}):</Typography>
          {medicines.map((med, index) => (
            <Chip
              key={med.id}
              label={`${med.name} - ${med.frequency}`}
              sx={{ mr: 1, mb: 1 }}
              size="small"
            />
          ))}
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>{t("Email Template")}:</Typography>
          <Typography variant="body2" sx={{
            bgcolor: 'grey.50',
            p: 2,
            borderRadius: 1,
            maxHeight: 100,
            overflow: 'auto'
          }}>
            {jobEmailTemplate || 'No template provided'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobFlow;
