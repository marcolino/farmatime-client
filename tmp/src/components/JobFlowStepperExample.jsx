// MainStepper.js - Main component that holds all data
import { useState, useEffect } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Typography
} from '@mui/material';
// import Step1Component from './Step1Component';
// import Step2Component from './Step2Component';
// import Step3Component from './Step3Component';

const steps = ['Medical Info', 'Personal Details', 'Review'];

const JobFlowStepperExample = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  // All step data in one place
  const [allStepData, setAllStepData] = useState({
    step1: {
      medicine: [
        { name: '', frequency: '', dosage: '', notes: '' }
      ],
      allergies: '',
      medicalHistory: ''
    },
    step2: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: ''
    },
    step3: {
      insurance: '',
      emergencyContact: '',
      preferredDate: ''
    }
  });

  // Load data from cookies on mount
  useEffect(() => {
    const loadedData = loadAllDataFromCookies();
    if (loadedData) {
      setAllStepData(loadedData);
    }
  }, []);

  // Generic update function for any step
  const updateStepData = (stepKey, newData) => {
    setAllStepData(prev => {
      const updated = {
        ...prev,
        [stepKey]: { ...prev[stepKey], ...newData }
      };
      
      // Save to encrypted cookie
      saveToCookie(stepKey, updated[stepKey]);
      
      return updated;
    });
  };

  // Specific function for nested medicine updates
  const updateMedicine = (medicineIndex, field, value) => {
    setAllStepData(prev => {
      const updatedMedicine = [...prev.step1.medicine];
      updatedMedicine[medicineIndex] = {
        ...updatedMedicine[medicineIndex],
        [field]: value
      };
      
      const updatedStep1 = {
        ...prev.step1,
        medicine: updatedMedicine
      };
      
      // Save to encrypted cookie
      saveToCookie('step1', updatedStep1);
      
      return {
        ...prev,
        step1: updatedStep1
      };
    });
  };

  // Add new medicine
  const addMedicine = () => {
    updateStepData('step1', {
      medicine: [...allStepData.step1.medicine, { name: '', frequency: '', dosage: '', notes: '' }]
    });
  };

  // Remove medicine
  const removeMedicine = (index) => {
    const filteredMedicine = allStepData.step1.medicine.filter((_, i) => i !== index);
    updateStepData('step1', { medicine: filteredMedicine });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    console.log('Final data:', allStepData);
    // Submit logic here
    clearAllCookies();
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Step1Component 
            data={allStepData.step1}
            onUpdate={(data) => updateStepData('step1', data)}
            onUpdateMedicine={updateMedicine}
            onAddMedicine={addMedicine}
            onRemoveMedicine={removeMedicine}
          />
        );
      case 1:
        return (
          <Step2Component 
            data={allStepData.step2}
            onUpdate={(data) => updateStepData('step2', data)}
          />
        );
      case 2:
        return (
          <Step3Component 
            data={allStepData}
            onUpdate={(stepKey, data) => updateStepData(stepKey, data)}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 3 }}>
        {getStepContent(activeStep)}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}>
          {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
};

// Cookie utility functions
const saveToCookie = (stepKey, data) => {
  try {
    const encryptedData = encryptData(data);
    document.cookie = `step_${stepKey}=${encryptedData}; path=/; secure; sameSite=strict; max-age=86400`;
  } catch (error) {
    console.error('Error saving to cookie:', error);
  }
};

const loadAllDataFromCookies = () => {
  try {
    const cookies = document.cookie.split(';');
    const stepData = {};
    
    cookies.forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name.startsWith('step_')) {
        const stepKey = name.replace('step_', '');
        stepData[stepKey] = decryptData(value);
      }
    });
    
    return Object.keys(stepData).length > 0 ? stepData : null;
  } catch (error) {
    console.error('Error loading from cookies:', error);
    return null;
  }
};

const clearAllCookies = () => {
  ['step1', 'step2', 'step3'].forEach(stepKey => {
    document.cookie = `step_${stepKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  });
};

// Simple encryption functions (replace with your actual encryption)
const encryptData = (data) => {
  return btoa(JSON.stringify(data)); // Simple base64 encoding
};

const decryptData = (encryptedData) => {
  return JSON.parse(atob(encryptedData)); // Simple base64 decoding
};

export default JobFlowStepperExample;

// Step1Component.js - Medical information form
// import React from 'react';
import {
  // Box,
  TextField,
  // Button,
  IconButton,
  // Typography,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

const Step1Component = ({ 
  data, 
  onUpdate, 
  onUpdateMedicine, 
  onAddMedicine, 
  onRemoveMedicine 
}) => {
  const { medicine, allergies, medicalHistory } = data;

  // Handle individual medicine field changes
  const handleMedicineChange = (index, field, value) => {
    onUpdateMedicine(index, field, value);
  };

  // Handle simple field changes
  const handleFieldChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Medical Information
      </Typography>

      {/* Medicine Section */}
      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Current Medications
      </Typography>
      
      {medicine.map((med, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Medicine Name"
                  value={med.name}
                  onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Frequency"
                  value={med.frequency}
                  onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                  placeholder="e.g., 2x daily"
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  label="Dosage"
                  value={med.dosage}
                  onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                  placeholder="e.g., 500mg"
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Notes"
                  value={med.notes}
                  onChange={(e) => handleMedicineChange(index, 'notes', e.target.value)}
                  placeholder="Additional notes"
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <IconButton
                  onClick={() => onRemoveMedicine(index)}
                  color="error"
                  disabled={medicine.length === 1}
                >
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Button
        startIcon={<Add />}
        onClick={onAddMedicine}
        variant="outlined"
        sx={{ mb: 3 }}
      >
        Add Another Medicine
      </Button>

      {/* Allergies Section */}
      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Allergies
      </Typography>
      <TextField
        label="Allergies"
        value={allergies}
        onChange={(e) => handleFieldChange('allergies', e.target.value)}
        placeholder="List any allergies separated by commas"
        fullWidth
        multiline
        rows={2}
        sx={{ mb: 3 }}
      />

      {/* Medical History Section */}
      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Medical History
      </Typography>
      <TextField
        label="Medical History"
        value={medicalHistory}
        onChange={(e) => handleFieldChange('medicalHistory', e.target.value)}
        placeholder="Describe your medical history..."
        fullWidth
        multiline
        rows={4}
      />
    </Box>
  );
};

//export default Step1Component;

// Step2Component.js - Personal information form
// import React from 'react';
// import {
//   // Box,
//   // TextField,
//   // Typography,
//   // Grid
// } from '@mui/material';

const Step2Component = ({ data, onUpdate }) => {
  const { firstName, lastName, email, phone, address } = data;

  const handleFieldChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Personal Information
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => handleFieldChange('firstName', e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => handleFieldChange('lastName', e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Address"
            value={address}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

//export default Step2Component;

// Step3Component.js - Review and additional info
// import React from 'react';
import {
  // Box,
  // TextField,
  // Typography,
  // Grid,
  // Card,
  // CardContent,
  Divider
} from '@mui/material';

const Step3Component = ({ data, onUpdate }) => {
  const { step1, step2, step3 } = data;

  const handleFieldChange = (field, value) => {
    onUpdate('step3', { [field]: value });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Review & Additional Information
      </Typography>

      {/* Review Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Medical Information Summary
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Medications: {step1.medicine.filter(m => m.name).length} items
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Allergies: {step1.allergies || 'None specified'}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Personal Information Summary
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Name: {step2.firstName} {step2.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Email: {step2.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Phone: {step2.phone}
          </Typography>
        </CardContent>
      </Card>

      <Divider sx={{ my: 3 }} />

      {/* Additional Information */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Additional Information
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Insurance Information"
            value={step3.insurance || ''}
            onChange={(e) => handleFieldChange('insurance', e.target.value)}
            placeholder="Insurance provider and policy number"
            fullWidth
            multiline
            rows={2}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Emergency Contact"
            value={step3.emergencyContact || ''}
            onChange={(e) => handleFieldChange('emergencyContact', e.target.value)}
            placeholder="Name and phone number"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Preferred Appointment Date"
            type="date"
            value={step3.preferredDate || ''}
            onChange={(e) => handleFieldChange('preferredDate', e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

//export default Step3Component;