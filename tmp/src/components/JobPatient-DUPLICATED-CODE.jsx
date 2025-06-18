//import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
  TextField,
  //useTheme,
  //useMediaQuery,
} from 'mui-material-custom';
import { ContextualHelp } from './ContextualHelp';
import { StyledPaper, StyledBox } from './JobStyles';

const JobPatient = ({ data, onChange }) => {
  const { t } = useTranslation();
  //const theme = useTheme();
  //const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleFieldChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 0 }}>
      <StyledPaper>
        <StyledBox>
          <Typography variant="h5" fontWeight="bold">
            {t("Patient Info")}
          </Typography>
        </StyledBox>

        <Box p={4}>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
            {/* xs + sm: Two rows (name + email) */}
            <Box
              sx={{
                display: { xs: 'flex', md: 'none' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <ContextualHelp helpPagesKey="PatientFirstName" fullWidth showOnHover>
                  <TextField
                    fullWidth
                    label={t("Patient first name")}
                    variant="outlined"
                    value={data.firstName || ''}
                    //onChange={(e) => onChange({ ...data, firstName: e.target.value })}
                    onChange={(e) => handleFieldChange('firstName', e.target.value)}
                  />
                </ContextualHelp>
              </Box>
              <Box sx={{ flex: 1 }}>
                <ContextualHelp helpPagesKey="PatientLastName" fullWidth showOnHover>
                  <TextField
                    fullWidth
                    label={t("Patient last name")}
                    variant="outlined"
                    value={data.lastName || ''}
                    //onChange={(e) => onChange({ ...data, lastName: e.target.value })}
                    onChange={(e) => handleFieldChange('lastName', e.target.value)}
                  />
                </ContextualHelp>
              </Box>
            </Box>

            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <ContextualHelp helpPagesKey="PatientEmail">
                <TextField
                  fullWidth
                  label={t("Patient email")}
                  type="email"
                  variant="outlined"
                  value={data.email || ''}
                  //onChange={(e) => onChange({ ...data, email: e.target.value })}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                />
              </ContextualHelp>
            </Box>

            {/* md+: All fields in one row */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <ContextualHelp helpPagesKey="PatientFirstName" fullWidth showOnHover>
                  <TextField
                    fullWidth
                    label={t("Patient first name")}
                    variant="outlined"
                    value={data.firstName || ''}
                    //onChange={(e) => onChange({ ...data, firstName: e.target.value })}
                    onChange={(e) => handleFieldChange('firstName', e.target.value)}
                  />
                </ContextualHelp>
              </Box>
              <Box sx={{ flex: 1 }}>
                <ContextualHelp helpPagesKey="PatientLastName" fullWidth showOnHover>
                  <TextField
                    fullWidth
                    label={t("Patient last name")}
                    variant="outlined"
                    value={data.lastName || ''}
                    //onChange={(e) => onChange({ ...data, lastName: e.target.value })}
                    onChange={(e) => handleFieldChange('lastName', e.target.value)}
                  />
                </ContextualHelp>
              </Box>
              <Box sx={{ flex: 1 }}>
                <ContextualHelp helpPagesKey="PatientEmail">
                  <TextField
                    fullWidth
                    label={t("Patient Email")}
                    type="email"
                    variant="outlined"
                    value={data.email || ''}
                    //onChange={(e) => onChange({ ...data, email: e.target.value })}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                  />
                </ContextualHelp>
              </Box>
            </Box>
          </Box>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default JobPatient;
