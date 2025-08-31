import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
} from '@mui/material';
import { AuthContext } from "../providers/AuthContext";
import { formatDate } from '../libs/Misc';
import { variablesExpand } from './JobEmailTemplateVariables';
import { StyledPaper, StyledBox, StyledPaperSmall, StyledBoxSmall } from './JobStyles';

const JobConfirmationReview = ({ data/*, onCompleted, hasNavigatedAway*/ }) => {
  const { t } = useTranslation();

  const { auth } = useContext(AuthContext);
  const [bodyExpanded, setBodyExpanded] = useState(null);

  // inform caller a valid medicines list (at least one item is present) is available
  // useEffect(() => {
  //   if (isValid()) {
  //     onCompleted(true);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [data]);

  // on every data change, if necessary, expand emailTemplate variables
  useEffect(() => {
    console.log("******* data.emailTemplate.subject:", data?.emailTemplate?.subject || "undefined");
    console.log("******* data.emailTemplate.body:", data?.emailTemplate?.body || "undefined");
    setBodyExpanded(variablesExpand(data.emailTemplate.body, data, auth.user));
  }, [data, auth]);

  // on every bodyExpanded change, convert it to HTML
  useEffect(() => {
    if (bodyExpanded) {
      let bodyExpandedHtml = bodyExpanded.replace(/(?:\r\n|\r|\n)/g, "<br />");
      setBodyExpanded(bodyExpandedHtml);
    }
  }, [bodyExpanded/*, data.emailTemplate.signature*/]);

  // const isValid = () => {
  //   return (data.emailTemplate.subject && data.emailTemplate.body /* && data.emailTemplate.signature*/); // all 3 emailTemplate items must be present) 
  // };
  
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
                {t('since day')} <b>{formatDate(medicine.fieldSinceDate)}</b>{', '}
                {t('every')} <b>{t('{{count}} days', {count: medicine.fieldFrequency})}</b>
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
              {t("Email subject")}: <b>{data.emailTemplate.subject}</b>
            </Typography>
            <Typography variant="body2" component="li" sx={{ pl: 2 }}
              dangerouslySetInnerHTML={{ __html: `${t("Email message")}:<br /><br />${bodyExpanded}` }}
            />
            {/* <Typography variant="body2" component="li" sx={{ pl: 2 }}
              dangerouslySetInnerHTML={{ __html: `${t("Body")}:<br /><br />${data.emailTemplate.bodyExpanded ? data.emailTemplate.bodyExpanded.replace(/(?:\r\n|\r|\n)/g, "<br />") : ''}<br /><br />${data.emailTemplate.signature ? data.emailTemplate.signature: ''}` }}
            /> */}
            {/* </Typography>
            <Typography variant="body2" sx={{ pl: 2 }}
              dangerouslySetInnerHTML={{ __html: data.emailTemplate.signature }}
            >
            </Typography> */}
          </Box>

        </Box>
      
      </StyledPaper>
    </Container>
  );

};

export default React.memo(JobConfirmationReview);
