import React, { useState, useEffect, useContext } from 'react';
//import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  //Button,
  Typography,
  //Tooltip,
} from '@mui/material';
import { AuthContext } from "../providers/AuthContext";
import { formatDateDDMMMYYYY } from '../libs/Misc';
import { variablesExpand } from './JobEmailTemplateVariables';
//import { Edit } from "@mui/icons-material";
import { StyledPaper, StyledBox, StyledPaperSmall, StyledBoxSmall } from './JobStyles';
//import { emailTemplate } from '../providers/JobContext';
import { JobContext } from '../providers/JobContext';

const JobConfirmationReview = ({ data/*, onCompleted, hasNavigatedAway*/ }) => {
  const { t } = useTranslation();
  //const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { emailTemplate } = useContext(JobContext) || {};
  const [bodyExpanded, setBodyExpanded] = useState(null);

  // if (!data.emailTemplate) {
  //   data.emailTemplate = emailTemplate;
  // }

  // on every data change, if necessary, expand emailTemplate variables
  useEffect(() => {
    setBodyExpanded(variablesExpand(emailTemplate.body, data, auth.user));
  }, [emailTemplate, data, auth]);

  // on every bodyExpanded change, convert it to HTML
  useEffect(() => {
    if (bodyExpanded) {
      let bodyExpandedHtml = bodyExpanded.replace(/(?:\r\n|\r|\n)/g, "<br />");
      setBodyExpanded(bodyExpandedHtml);
    }
  }, [bodyExpanded/*, data.emailTemplate.signature*/]);

  return (
    <Container maxWidth="lg" sx={{ py: 0 }}>
      <StyledPaper>
        <StyledBox>
          <Typography variant="h5" fontWeight="bold">
            {t("Confirmation of the job")}
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
                {t('since day')} <b>{formatDateDDMMMYYYY(medicine.fieldSinceDate)}</b>{', '}
                {t('every')} <b>{t('day', {count: parseInt(medicine.fieldFrequency)})}</b>
              </Typography>
            ))}
          </Box>

          <Box sx={{ mb: 3 }}>
            <StyledPaperSmall>
              <StyledBoxSmall>
                <Typography variant="body2">{t("Email Template") + ' ' + '(' + t("example of the first request") + ')'}</Typography>
              </StyledBoxSmall>
            </StyledPaperSmall>
            <Typography variant="body2" component="li" sx={{ pl: 2 }}>
              {t("Email subject")}: <b>{emailTemplate.subject}</b>
            </Typography>
            <Typography variant="body2" component="li" sx={{ pl: 2 }}
              dangerouslySetInnerHTML={{ __html: `${t("Email message")}:<br /><br />${bodyExpanded}` }}
            />
          </Box>

          {/* Edit email template button */}
          {/* <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <Tooltip title={t('Edit Email Template')} arrow>
              <Button
                variant="contained"
                size="small" color="primary"
                onClick={() => navigate(`/job-email-template-edit/${data.id}`, { replace: true })}
              >
                <Edit fontSize="small" sx={{ mr: 1 }} /> {t("Change the model")}
              </Button>
            </Tooltip>
          </Box> */}

        </Box>
      
      </StyledPaper>
    </Container>
  );

};

export default React.memo(JobConfirmationReview);
