import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Container,
  Box,
  Typography,
  TextField,
} from "mui-material-custom";
import { ContextualHelp } from "./ContextualHelp";
import { validateAllFields, mapErrorCodeToMessage } from "../libs/Validation";
import { StyledPaper, StyledBox } from "./JobStyles";

const JobDoctor = ({ data, fields, onChange, onValid, hasNavigatedAway }) => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});

  // set default data object
  if (!data) data = { name: '', email: '' };

  const handleFieldChange = (field, value) => {
    onChange({ ...data, [field]: value });
    setErrors((prev) => ({ ...prev, [field]: "" })); // clear error when editing
  };

  /*
  useEffect(() => {
    if (onValid) {
      const valid = validateAllFields(fields, data);
      onValid(valid);

      const newErrors = {};
      fields.forEach((field) => {
        const result = field.isValid(data[field.key]);
        if (result !== true) {
          newErrors[field.key] = mapErrorCodeToMessage(result);
        }
      });
      setErrors(newErrors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  */
  useEffect(() => {
    if (!onValid) return;

    const handle = setTimeout(() => {
      const valid = validateAllFields(fields, data);
      onValid(valid);

      const newErrors = {};
      fields.forEach((field) => {
        const result = field.isValid(data[field.key]);
        if (result !== true) {
          newErrors[field.key] = mapErrorCodeToMessage(result);
        }
      });

      setErrors(newErrors);
    }, 360); // wait 360ms after typing stops

    return () => clearTimeout(handle); // cleanup on next keystroke
  }, [data, fields, onValid]);

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
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              mb: 2,
              width: "100%",
            }}
          >
            {fields.map(({ label, key, helpKey, type = "text", placeholder }) => (
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
                    value={data[key] || ""}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
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

export default React.memo(JobDoctor);
