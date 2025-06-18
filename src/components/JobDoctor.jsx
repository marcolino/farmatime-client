import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
  TextField,
} from 'mui-material-custom';
import { ContextualHelp } from './ContextualHelp';
import { StyledPaper, StyledBox } from './JobStyles';

const JobDoctor = ({ data, onChange }) => {
  const { t } = useTranslation();

  const handleFieldChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const fields = [
    {
      label: t("Doctor name"),
      key: 'name',
      helpKey: 'DoctorName',
      placeholder: t("Dr. ..."),
    },
    {
      label: t("Doctor email"),
      key: 'email',
      helpKey: 'DoctorEmail',
      placeholder: t("doc@studio-medico.it"),
      type: 'email',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 0 }}>
      <StyledPaper>
        <StyledBox>
          <Typography variant="h5" fontWeight="bold">
            {t("Doctor Info")}
          </Typography>
        </StyledBox>

        <Box p={4}>
          <Box
            component="form"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              mb: 2,
              width: '100%',
            }}
          >
            {fields.map(({ label, key, helpKey, type = 'text', placeholder }) => (
              <Box
                key={key}
                sx={{
                  flex: 1, // Equal width for both inputs on md+
                }}
              >
                <ContextualHelp helpPagesKey={helpKey} fullWidth showOnHover>
                  <TextField
                    fullWidth
                    label={label}
                    type={type}
                    variant="outlined"
                    placeholder={placeholder}
                    value={data[key] || ''}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
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

export default JobDoctor;
