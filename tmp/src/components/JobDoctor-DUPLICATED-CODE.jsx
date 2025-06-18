//import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  // Grid,
  // Card,
  // CardContent,
  Typography,
  TextField,
  useTheme,
  useMediaQuery,
} from 'mui-material-custom';
import { ContextualHelp } from './ContextualHelp';
import { StyledPaper, StyledBox } from './JobStyles';

const JobDoctor = ({ data, onChange }) => {
  const { t } = useTranslation();
  //const theme = useTheme();
  //const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container maxWidth="lg" sx={{ py: 0 }}>
      <StyledPaper>
        <StyledBox>
          <Typography variant="h5" fontWeight="bold">
            {t("Doctor Info")}
          </Typography>
          {/* <Typography variant="subtitle2" fontWeight="light">
            {t('doctor info subtitle')}
          </Typography> */}
        </StyledBox>

        <Box p={4}>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
            {/* xs: stacked layout */}
            <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', gap: 2 }}>
              <Box>
                <ContextualHelp helpPagesKey="DoctorName" fullWidth showOnHover>
                  <TextField
                    fullWidth
                    label={t("Doctor name")}
                    variant="outlined"
                    value={data.firstName || ''}
                    onChange={(e) => onChange({ ...data, firstName: e.target.value })}
                    placeholder={t("Dott.ssa Alice")}
                  />
                </ContextualHelp>
              </Box>
              <Box>
                <ContextualHelp helpPagesKey="DoctorEmail">
                  <TextField
                    fullWidth
                    label={t("Email")}
                    type="email"
                    value={data.email || ''}
                    onChange={(e) => onChange({ ...data, email: e.target.value })}
                    placeholder={t("doc@studio-medico.it")}
                  />
                </ContextualHelp>
              </Box>
            </Box>

            {/* sm and up: single row layout */}
            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                flexDirection: 'row',
                gap: 2,
                alignItems: 'flex-end',
              }}
            >
              <Box sx={{ flex: 1 }}>
                <ContextualHelp helpPagesKey="DoctorName" fullWidth showOnHover>
                  <TextField
                    fullWidth
                    label={t("Doctor name")}
                    variant="outlined"
                    value={data.firstName || ''}
                    onChange={(e) => onChange({ ...data, firstName: e.target.value })}
                    placeholder={t("Dott.ssa Alice")}
                  />
                </ContextualHelp>
              </Box>
              <Box sx={{ flex: 1 }}>
                <ContextualHelp helpPagesKey="DoctorEmail">
                  <TextField
                    fullWidth
                    label={t("Doctor email")}
                    type="email"
                    value={data.email || ''}
                    onChange={(e) => onChange({ ...data, email: e.target.value })}
                    placeholder={t("doc@studio-medico.it")}
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

export default JobDoctor;
