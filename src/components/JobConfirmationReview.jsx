import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Button,
  Typography,
  Tooltip,
} from '@mui/material';
import { AuthContext } from "../providers/AuthContext";
import { formatDateDDMMMYYYY } from '../libs/Misc';
import { variablesExpand } from './JobEmailTemplateVariables';
import { useMediaQueryContext } from "../providers/MediaQueryContext";
import { useDialog } from "../providers/DialogContext";
import { Edit } from "@mui/icons-material";
import { StyledPaper, StyledBox, StyledPaperSmall, StyledBoxSmall } from './JobStyles';
//import { emailTemplate } from '../providers/JobContext';
import { JobContext } from '../providers/JobContext';

const JobConfirmationReview = ({ data/*, onCompleted, hasNavigatedAway*/ }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showDialog } = useDialog();
  const { auth } = useContext(AuthContext);
  const { emailTemplate } = useContext(JobContext) || {};
  const { jobDraftIsDirty, setJobDraftDirty } = useContext(JobContext);
  const [bodyExpanded, setBodyExpanded] = useState(null);
  const { isMobile } = useMediaQueryContext();

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

  const checkJobDraftIsDirty = (title, proceed) => {
    if (!jobDraftIsDirty) {
      proceed();
    } else {
      showDialog({
        title,
        message: t("Are you sure you want to cancel the job edits you have just done? All changes will be lost."),
        confirmText: t("Yes, cancel changes"),
        cancelText: t("No, continue"),
        onConfirm: () => {
          setJobDraftDirty(false);
          proceed();
        },
        onCancel: () => {
          setTimeout(() => { // we need a timeout to allow closing current dialog and open the next one...
            showDialog({
              title,
              message: t("To edit email template, please click on the menu icon on the top, then \"Advanced Options\" and \"Edit Email Template\"") + ".",
              confirmText: t("Ok"),
            });
          }, 1);
        },
      });

    }
  };

  const handleChangeTemplate = () => {
    const proceed = () => navigate("/job-email-template-edit", { replace: true });
    checkJobDraftIsDirty(t("Edit Email Template"), proceed);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 0 }}>
      <StyledPaper sx={{ mt: isMobile ? 1 : 2 }}>
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
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <Tooltip title={t('Edit Email Template')} arrow>
              <Button
                variant="contained"
                size="small" color="secondary"
                onClick={handleChangeTemplate}
              >
                <Edit fontSize="small" sx={{ mr: 1 }} /> {t("Change the email template")}
              </Button>
            </Tooltip>
          </Box>

        </Box>
      
      </StyledPaper>
    </Container>
  );

};

export default React.memo(JobConfirmationReview);
