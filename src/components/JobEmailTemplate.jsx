//import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  // Button,
  // Container,
  // Grid,
  // Paper,
  // Stepper,
  // Step,
  // StepLabel,
  Typography,
  TextField,
  // useTheme,
  // useMediaQuery,
  // Chip,
} from 'mui-material-custom';
import { ContextualHelp } from './ContextualHelp';
import { StyledPaper, StyledBox } from './JobStyles';

const JobEmailTemplate = ({ data, onChange }) => {
  const { t } = useTranslation();

  const handleFieldChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const fields = [
    {
      label: t("Email subject"),
      key: 'subject',
      helpKey: 'EmailTemplateSubject',
      //placeholder: '',
    },
    {
      label: t("Email body"),
      key: 'body',
      helpKey: 'EmailTemplateBody',
      //placeholder: '',
    },
    {
      label: t("Email signature"),
      key: 'signature',
      helpKey: 'EmailTemplateSignature',
      //placeholder: '',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 0 }}>
      <StyledPaper>
        <StyledBox>
          <Typography variant="h5" fontWeight="bold">
            {t("Email Template")}
          </Typography>
        </StyledBox>

        <Box p={4}>
          <Box
            component="form"
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                sm: 'row',
              },
              gap: 2,
              flexWrap: 'wrap',
              mb: 2,
            }}
          >
            {fields.map(({ label, key, helpKey, placeholder }) => (
              <Box
                key={key}
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    //sm: key === 'email' ? '1 1 100%' : '1 1 50%',
                    //md: '1 1 33%',
                  },
                  mb: 2,
                }}
              >
                <ContextualHelp helpPagesKey={helpKey} fullWidth showOnHover>
                  <TextField
                    fullWidth
                    multiline={key === 'body' ? true : false}
                    rows={key === 'body' ? 6 : 1}
                    label={label}
                    value={data[key] || ''}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    placeholder={placeholder}
                  />
                </ContextualHelp>
              </Box>
            ))}
          </Box>
        </Box>
      </StyledPaper>
    </Container>
  );

};

export default JobEmailTemplate;
