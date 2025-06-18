import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
} from '@mui/material';
import { formatDate } from '../libs/Misc';
import { StyledPaper, StyledBox, StyledPaperSmall, StyledBoxSmall } from './JobStyles';

const JobConfirmationReview = ({ data }) => {
  const { t } = useTranslation();
  
  console.log("JOB DATA:", data);

  return (
    <Container maxWidth="lg" sx={{ py: 0 }}>
      <StyledPaper>
        <StyledBox>
          <Typography variant="h5" fontWeight="bold">
            {t("Confirmation of the request")}
          </Typography>
        </StyledBox>

        <Box px={4}>

          <Box sx={{ mb: 3 }}>
            <StyledPaperSmall>
              <StyledBoxSmall>
                <Typography variant="body2">{t("Patient")}</Typography>
              </StyledBoxSmall>
            </StyledPaperSmall>
            <Typography variant="body2" component="li" sx={{pl: 2}}>
              {t('First name')}: <b>{data.patient.firstName}</b>
            </Typography>
            <Typography variant="body2" component="li" sx={{pl: 2}}>
              {t('Last name')}: <b>{data.patient.lastName}</b>
            </Typography>
            <Typography variant="body2" component="li" sx={{pl: 2}}>
              {t('Email')}: <b>{data.patient.email}</b>
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <StyledPaperSmall>
              <StyledBoxSmall>
                <Typography variant="body2">{t("Doctor")}</Typography>
              </StyledBoxSmall>
            </StyledPaperSmall>
            <Typography variant="body2" component="li" sx={{pl: 2}}>
              {t('Name')}: <b>{data.doctor.name}</b>
            </Typography>
            <Typography variant="body2" component="li" sx={{pl: 2}}>
              {t('Email')}: <b>{data.doctor.email}</b>
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <StyledPaperSmall>
              <StyledBoxSmall>
                <Typography variant="body2">{t("Medicines")}</Typography>
              </StyledBoxSmall>
            </StyledPaperSmall>
            {data.medicines.map((medicine, index) => (
              <Typography key={index} variant="body2" component="li" sx={{ pl: 2 }}>
                {t('Medicine')}: <b>{medicine.name}</b>{', '}
                {t('since day')}: <b>{formatDate(medicine.fieldDate)}</b>{', '}
                {t('every')}: <b>{t('{{count}} days', {count: medicine.fieldFrequency})}</b>
              </Typography>
            ))}
          </Box>

          <Box sx={{ mb: 3 }}>
            <StyledPaperSmall>
              <StyledBoxSmall>
                <Typography variant="body2">{t("Email Template")}</Typography>
              </StyledBoxSmall>
            </StyledPaperSmall>
            <Typography variant="body2" component="li" sx={{ pl: 2 }}>
              {t('Subject')}: <b>{data.emailTemplate.subject}</b>
            </Typography>
            <Typography variant="body2" component="li" sx={{ pl: 2 }}>
              {t('Body')}: <b>{data.emailTemplate.body}</b>
            </Typography>
            <Typography variant="body2" component="li" sx={{ pl: 2 }}>
              {t('Signature')}: <b>{data.emailTemplate.signature}</b>
            </Typography>
          </Box>

        </Box>
      
      </StyledPaper>
    </Container>
  );

/*
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>{t('Review & Confirmation')}</Typography>
        
        {/ * <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>{t("Patient")}:</Typography>
          <Typography variant="body2">
            {data.patient.firstName} {data.patient.lastName} ({data.patient.email})
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>{t("Doctor")}:</Typography>
          <Typography variant="body2">
            {data.doctor.firstName} {data.doctor.lastName} ({data.doctor.email})
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>{t("Medicines")} ({data.medicines.length}):</Typography>
          {data.medicines.map((medicine) => (
            <Chip
              key={medicine.id}
              label={`${medicine.name} - ${medicine.frequency}`}
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
            {data.emailTemplate || 'No email template provided'}
          </Typography>
        </Box> * /}
      </CardContent>
    </Card>
  );
  */
};

export default JobConfirmationReview;
