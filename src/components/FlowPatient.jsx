import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Chip,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { ArrowBack, ArrowForward, Check } from '@mui/icons-material';
import { MedicinesList } from './MedicinesList';

// Mock Medicine List Component (replace with your existing component)
const _MedicinesList = ({ medicines, onChange }) => {
  const { t } = useTranslation();
  const [newMedicine, setNewMedicine] = useState({ name: '', date: '', frequency: '' });

  const addMedicine = () => {
    if (newMedicine.name && newMedicine.date && newMedicine.frequency) {
      onChange([...medicines, { ...newMedicine, id: Date.now() }]);
      setNewMedicine({ name: '', date: '', frequency: '' });
    }
  };

  const removeMedicine = (id) => {
    onChange(medicines.filter(med => med.id !== id));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Medicines</Typography>
      
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="Medicine Name"
            value={newMedicine.name}
            onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4 }}>
          <TextField
            fullWidth
            type="date"
            label="Start Date"
            InputLabelProps={{ shrink: true }}
            value={newMedicine.date}
            onChange={(e) => setNewMedicine({ ...newMedicine, date: e.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4 }}>
          <TextField
            fullWidth
            label="Frequency"
            placeholder="e.g., 2x daily"
            value={newMedicine.frequency}
            onChange={(e) => setNewMedicine({ ...newMedicine, frequency: e.target.value })}
          />
        </Grid>
      </Grid>
      
      <Button variant="outlined" onClick={addMedicine} sx={{ mb: 2 }}>
        Add Medicine
      </Button>

      {medicines.length > 0 && (
        <List>
          {medicines.map((med) => (
            <ListItem
              key={med.id}
              sx={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: 1, 
                mb: 1,
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <ListItemText
                primary={med.name}
                secondary={`Start: ${med.date} | Frequency: ${med.frequency}`}
              />
              <Button 
                size="small" 
                color="error"
                onClick={() => removeMedicine(med.id)}
              >
                Remove
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

// Individual Form Components
const PatientForm = ({ data, onChange }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Patient Information</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label={t("First Name")}
              value={data.firstName || ''}
              onChange={(e) => onChange({ ...data, firstName: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Last Name"
              value={data.lastName || ''}
              onChange={(e) => onChange({ ...data, lastName: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={data.email || ''}
              onChange={(e) => onChange({ ...data, email: e.target.value })}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const DoctorForm = ({ data, onChange }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>{t('Doctor Information')}</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="First Name"
              value={data.firstName || ''}
              onChange={(e) => onChange({ ...data, firstName: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Last Name"
              value={data.lastName || ''}
              onChange={(e) => onChange({ ...data, lastName: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={data.email || ''}
              onChange={(e) => onChange({ ...data, email: e.target.value })}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

const EmailTemplate = ({ template, onChange }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>{t('Email Template')}</Typography>
        <TextField
          fullWidth
          multiline
          rows={6}
          label="Email Content"
          placeholder="Enter your email template here..."
          value={template || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      </CardContent>
    </Card>
  );
};

const ConfirmationReview = ({ patient, doctor, medicines, emailTemplate }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>{t('Review & Confirmation')}</Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>Patient:</Typography>
          <Typography variant="body2">
            {patient.firstName} {patient.lastName} ({patient.email})
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>Doctor:</Typography>
          <Typography variant="body2">
            {doctor.firstName} {doctor.lastName} ({doctor.email})
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>Medicines ({medicines.length}):</Typography>
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
          <Typography variant="subtitle1" gutterBottom>Email Template:</Typography>
          <Typography variant="body2" sx={{
            bgcolor: 'grey.50',
            p: 2,
            borderRadius: 1,
            maxHeight: 100,
            overflow: 'auto'
          }}>
            {emailTemplate || 'No template provided'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Main App Component
const FlowPatient = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Form data state
  const [patient, setPatient] = useState({});
  const [doctor, setDoctor] = useState({});
  const [medicines, setMedicines] = useState([]);
  const [emailTemplate, setEmailTemplate] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  // Navigation state
  const [currentStep, setCurrentStep] = useState(0);

  // Define steps based on screen size
  const mobileSteps = [
    { id: 'patient', label: t('Patient Info') },
    { id: 'doctor', label: 'Doctor Info' },
    { id: 'medicines', label: 'Medicines' },
    { id: 'template', label: 'Email Template' },
    { id: 'confirm', label: 'Confirmation' }
  ];

  const desktopSteps = [
    { id: 'patient-doctor', label: t('Patient & Doctor Info') },
    { id: 'medicines', label: 'Medicines' },
    { id: 'template', label: 'Email Template' },
    { id: 'confirm', label: 'Review & Confirmation' }
  ];

  const steps = isMobile ? mobileSteps : desktopSteps;
  const maxSteps = steps.length;

  // Navigation handlers
  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, maxSteps - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleGoto = (index) => {
    setCurrentStep(index);
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    alert('Service activated successfully!');
    // Reset or redirect logic here
  };

  const isLastStep = currentStep === maxSteps - 1;

  // Render mobile layout
  const renderMobileStep = () => {
    switch (currentStep) {
      case 0:
        return <PatientForm data={patient} onChange={setPatient} />;
      case 1:
        return <DoctorForm data={doctor} onChange={setDoctor} />;
      case 2:
        return (
          <Card>
            <CardContent>
              <MedicinesList medicines={medicines} onChange={setMedicines} />
            </CardContent>
          </Card>
        );
      case 3:
        return <EmailTemplate template={emailTemplate} onChange={setEmailTemplate} />;
      case 4:
        return <ConfirmationReview 
          patient={patient} 
          doctor={doctor} 
          medicines={medicines} 
          emailTemplate={emailTemplate} 
        />;
      default:
        return null;
    }
  };

  // Render desktop layout
  const renderDesktopStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <PatientForm data={patient} onChange={setPatient} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <DoctorForm data={doctor} onChange={setDoctor} />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardContent>
                  <MedicinesList medicines={medicines} onChange={setMedicines} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <EmailTemplate template={emailTemplate} onChange={setEmailTemplate} />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <ConfirmationReview 
                patient={patient} 
                doctor={doctor} 
                medicines={medicines} 
                emailTemplate={emailTemplate} 
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Title with contrasting bgcolor */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4, 
          bgcolor: 'primary.main', //'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'info.contrastText',
        }}
      >
        <Typography variant="h4" align="center" sx={{ fontWeight: 'bold' }}>
          {t('Patient Care Service Setup')}
        </Typography>
      </Paper>

      {/* Stepper */}
      <Stepper 
        activeStep={isConfirmed ? maxSteps : currentStep} 
        sx={{ mb: 4 }} 
        alternativeLabel={isMobile}
      >
        {steps.map((step, index) => (
          <Step
            key={step.id}
            completed={isConfirmed ? true : index < currentStep}
            onClick={() => {
              console.log("STEP ICON:", step);
              handleGoto(index);
            }}
          >
            <StepLabel 
              // StepIconProps={{
              //   completed: isConfirmed || index < currentStep
              // }}
              slotProps={{
                stepIcon: {
                  completed: isConfirmed || index < currentStep
                }
              }}
              onClick={() => {
              console.log("STEP LABEL:", step);
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
            disabled={currentStep === 0}
            startIcon={<ArrowBack />}
            variant="contained"//"outlined"
            sx={{ 
              opacity: currentStep === 0 ? 0 : 0.5,
              '&:hover': {
                opacity: currentStep === 0 ? 0 : 0.75,
              }
            }}
          >
            Previous
          </Button>

          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" color="text.secondary">
              Step {currentStep + 1} of {maxSteps}
            </Typography>
          </Box>

          <Button
            onClick={isLastStep ? handleConfirm : handleNext}
            endIcon={isLastStep ? <Check /> : <ArrowForward />}
            variant="contained"
            disabled={isConfirmed}
          >
            {isConfirmed ? 'Confirmed' : (isLastStep ? 'Confirm and activate requests' : 'Proceed')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default FlowPatient;
