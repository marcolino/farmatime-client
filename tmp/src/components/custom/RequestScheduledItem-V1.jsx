//import React from "react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const RequestScheduledDetails = ({ items = [] }) => {
  const { t } = useTranslation();
  
  if (!items.length) {
    return (
      <Typography color="text.secondary" align="center" sx={{ mt: 1 }}>
        {t("No requests for this month")}.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
      {items.map((item, i) => (
        <Accordion
          key={i}
          disableGutters
          sx={{
            "&::before": { display: "none" },
            boxShadow: "none",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "divider",
            "&:not(:last-child)": { mb: 0.4 },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ fontSize: "1rem" }} />}
            sx={{
              minHeight: 28,
              "& .MuiAccordionSummary-content": {
                display: "flex",
                alignItems: "center",
                gap: 0.8,
                flexWrap: "nowrap",
                overflow: "hidden",
              },
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, maxWidth: "20%" }}>
              {item.day}/{item.month}/{item.year} {/* TODO: format date */}
            </Typography>
            <Typography
              variant="caption"
              noWrap
              sx={{ flexGrow: 1, maxWidth: "25%" }}
            >
              {item.patient}
            </Typography>
            <Typography
              variant="caption"
              noWrap
              sx={{ flexGrow: 1, maxWidth: "25%" }}
            >
              {item.doctor}
            </Typography>
            <Typography
              variant="caption"
              noWrap
              sx={{ fontStyle: "italic", maxWidth: "30%" }}
            >
              {item.medicine.name}
            </Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ pt: 0.5, pb: 0.8, px: 2 }}>
            <Divider sx={{ mb: 0.5 }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.1 }}>
              <Typography variant="caption">
                <strong>Day:</strong> {item.day}
              </Typography>
              <Typography variant="caption">
                <strong>Patient:</strong> {item.patient}
              </Typography>
              <Typography variant="caption">
                <strong>Doctor:</strong> {item.doctor}
              </Typography>
              <Typography variant="caption">
                <strong>Medicine:</strong> {item.medicine.name}
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

export default RequestScheduledDetails;
