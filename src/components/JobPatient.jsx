import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
  TextField,
} from 'mui-material-custom';
import { ContextualHelp } from './ContextualHelp';
import { StyledPaper, StyledBox } from './JobStyles';

const JobPatient = ({ data, onChange }) => {
  const { t } = useTranslation();

  const handleFieldChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const fields = [
    {
      label: t("Patient first name"),
      key: 'firstName',
      helpKey: 'PatientFirstName',
      placeholder: '',
    },
    {
      label: t("Patient last name"),
      key: 'lastName',
      helpKey: 'PatientLastName',
      placeholder: '',
    },
    {
      label: t("Patient email"),
      key: 'email',
      helpKey: 'PatientEmail',
      type: 'email',
      placeholder: 'info@mail.it',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 0 }}>
      <StyledPaper>
        <StyledBox>
          <Typography variant="h5" fontWeight="bold">
            {t("Patient Info")}
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
                //md: 'row',
              },
              gap: 2,
              flexWrap: 'wrap',
              mb: 2,
            }}
          >
            {fields.map(({ label, key, helpKey, type = 'text', placeholder }) => (
              <Box
                key={key}
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: key === 'email' ? '1 1 100%' : '1 1 50%',
                    md: '1 1 33%',
                  },
                }}
              >
                <ContextualHelp helpPagesKey={helpKey} fullWidth showOnHover>
                  <TextField
                    fullWidth
                    label={label}
                    variant="outlined"
                    type={type}
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

export default JobPatient;
