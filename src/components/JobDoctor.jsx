import React, { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
  TextField,
} from 'mui-material-custom';
import { ContextualHelp } from './ContextualHelp';
import { validateAllFields } from '../libs/Validation';
import { StyledPaper, StyledBox } from './JobStyles';

const JobDoctor = ({ data, fields, onChange, onValid }) => {
  const { t } = useTranslation();

  const handleFieldChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  useEffect(() => {
    if (onValid) {
      onValid(validateAllFields(fields, data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

/*
  const isValidName = (value) => {
    const validity = validateFirstName(value);
    switch (validity) {
      case "ERROR_PLEASE_SUPPLY_A_FIRSTNAME":
        return t("Please supply a valid name");
      case "ERROR_PLEASE_SUPPLY_A_VALID_FIRSTNAME":
        return t("Please supply a valid name");
      case true:
        return true;
      default:
        console.error("Unforeseen name validation error:", validity)
        return t("Name is wrong");
    }
  }

  const isValidEmail = (value) => {
    const validity = validateEmail(value);
    switch (validity) {
      case "ERROR_PLEASE_SUPPLY_AN_EMAIL":
        return t("Please supply an email");
      case "ERROR_PLEASE_SUPPLY_A_VALID_EMAIL":
        return t("Please supply a valid email");
      case true:
        return true;
      default:
        console.error("Unforeseen email validation error:", validity)
        return t("Email is wrong");
    }
  }
  
  const isValid = () => {
    let valid = true;
    fields.forEach(field => {
      if (field.isValid(data[field.key]) !== true) {
        valid = false;
        return; // break forEach loop
      }
    });
    console.log("JobDoctor - isValid:", valid);
    return valid;
  };
*/

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

export default React.memo(JobDoctor);
