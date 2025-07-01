import { useEffect } from "react";
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

const JobPatient = ({ data, fields, onChange, onValid }) => {
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
  const isValidFirstName = (value) => {
    const validity = validateFirstName(value);
    switch (validity) {
      case "ERROR_PLEASE_SUPPLY_A_FIRSTNAME":
        return t("Please supply a valid first name");
      case "ERROR_PLEASE_SUPPLY_A_VALID_FIRSTNAME":
        return t("Please supply a valid first name");
      case true:
        return true;
      default:
        console.error("Unforeseen first name validation error:", validity)
        return t("First name is wrong");
    }
  }

  const isValidLastName = (value) => {
    const validity = validateLastName(value);
    switch (validity) {
      case "ERROR_PLEASE_SUPPLY_A_LASTNAME":
        return t("Please supply a valid last name");
      case "ERROR_PLEASE_SUPPLY_A_VALID_LASTNAME":
        return t("Please supply a valid last name");
      case true:
        return true;
      default:
        console.error("Unforeseen last name validation error:", validity)
        return t("Last name is wrong");
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

  const validateAllFields = (fields) => {
    let valid = true;
    fields.forEach(field => {
      if (field.isValid(data[field.key]) !== true) {
        valid = false;
        return; // break forEach loop
      }
    });
    console.log("JobPatient - isValid:", valid);
    return valid;
  };
  */
  
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
