import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
  TextField,
} from 'mui-material-custom';
import { ContextualHelp } from './ContextualHelp';
import { validateAllFields, mapErrorCodeToMessage } from '../libs/Validation';
import { StyledPaper, StyledBox } from './JobStyles';

const JobPatient = ({ jobDraft, data, fields, onChange, onValid, hasNavigatedAway }) => {
  const { t } = useTranslation();

  const [errors, setErrors] = useState({});

  // set default data object
  if (!data) data = { firstName: '', lastName: '', email: '' };
  
  const handleFieldChange = (field, value) => {
    onChange({ ...data, [field]: value.trim() });
    setErrors((prev) => ({ ...prev, [field]: false })); // Clear error on change
  };

  /*
  useEffect(() => {
    if (onValid) {
      const valid = validateAllFields(fields, data);
      onValid(valid);

      // collect errors into state
      const newErrors = {};
      fields.forEach((field) => {
        const result = field.isValid(data[field.key]);
        if (result !== true) {
          // result might be an error code, map it to translated text
          newErrors[field.key] = mapErrorCodeToMessage(result);
        }
      });
      setErrors(newErrors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  */
  
  /*
  useEffect(() => {
    if (onValid) {
      const valid = validateAllFields(fields, data);
      onValid(valid);

      // collect errors into state
      const newErrors = {};
      fields.forEach((field) => {
        const result = field.isValid(data[field.key]);
        if (result !== true) {
          newErrors[field.key] = mapErrorCodeToMessage(result);
        }
      });

      // only update if something actually changed
      setErrors((prevErrors) => {
        const same =
          Object.keys(newErrors).length === Object.keys(prevErrors).length &&
          Object.keys(newErrors).every(
            (key) => newErrors[key] === prevErrors[key]
          );

        return same ? prevErrors : newErrors;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  */

  /*
  useEffect(() => {
    if (onValid) {
      const valid = validateAllFields(fields, data);
      onValid(valid);

      // collect errors into state
      const newErrors = {};
      fields.forEach((field) => {
        const result = field.isValid(data[field.key]);
        if (result !== true) {
          // result might be an error code, map it to translated text
          newErrors[field.key] = mapErrorCodeToMessage(result);
        }
      });
     // setErrors(newErrors);
      setErrors((prevErrors) => {
        const updated = { ...prevErrors };
        let changed = false;

        fields.forEach((field) => {
          const result = field.isValid(data[field.key]);
          const message = result === true ? "" : mapErrorCodeToMessage(result);

          if (message !== prevErrors[field.key]) {
            updated[field.key] = message;
            changed = true;
          }
        });

        return changed ? updated : prevErrors;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  */
  
  useEffect(() => {
    if (!onValid) return;

    const handle = setTimeout(() => {
      const valid = validateAllFields(jobDraft, fields, data);
      onValid(valid);

      const newErrors = {};
      fields.forEach((field) => {
        const result = field.isValid(jobDraft, data[field.key]);
        if (result !== true) {
          newErrors[field.key] = mapErrorCodeToMessage(result);
        }
      });

      setErrors(newErrors);
    }, 360); // wait 360ms after typing stops

    return () => clearTimeout(handle); // cleanup on next keystroke
  }, [jobDraft, data, fields, onValid]);

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
                    error={hasNavigatedAway && !!errors[key]}
                    helperText={hasNavigatedAway ? (errors[key] || "") : ""}
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

export default React.memo(JobPatient);
