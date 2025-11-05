import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Divider,
  Tooltip,
} from "@mui/material";
//import { formatDateDDMMMYYYY } from '../../libs/Misc';
import { useMediaQueryContext } from "../../providers/MediaQueryContext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const RequestScheduledDetails = ({items = [], period, allUsersRequests = false }) => { // mode is "month" or "year"
  const { t } = useTranslation();
  const { isMobile } = useMediaQueryContext();
  
  if (!items.length) {
    return (
      <Typography color="text.secondary" align="center" sx={{ mt: 1, fontStyle: "italic" }}>
        {t("No requests for this") + " " + (period === "monthly" ? t("month") : t("day"))}.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.4 }}>
      {items.map((item, i) => {
        item.day = item.dateKey.split("-")[2];
        item.month = item.dateKey.split("-")[1];
        item.year = item.dateKey.split("-")[0];
        const fieldsCount = (period === "monthly" ? 1 : 0) + (allUsersRequests ? 1 : 0) + 2 + (!isMobile ? 2 : 0);
        const maxWidths = {
          date:     ((100 / fieldsCount) * 1.0) + "%",
          user:     ((100 / fieldsCount) * 1.0) + "%",
          patient:  ((100 / fieldsCount) * 1.0) + "%",
          doctor:   ((100 / fieldsCount) * 1.0) + "%",
          medicine: ((100 / fieldsCount) * 2.0) + "%",
        };
        return (
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
                //minHeight: 12,
                "& .MuiAccordionSummary-content": {
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? 0.5 : 1,
                  overflow: "hidden",
                  flexWrap: "nowrap",
                },
              }}
            >
              {/* Date */}
              {period === "monthly" && (
                <Tooltip title={t("Day of the month")} arrow>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      minWidth: 24,
                      maxWidth: maxWidths["date"], // limit user field width
                    }}
                  >
                    {String(item.day).padStart(2, "0")}
                  </Typography>
                </Tooltip>
              )}

              {/* User */}
              {allUsersRequests && (
                <Tooltip title={t("User name")} arrow>
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{
                      flexShrink: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: maxWidths["user"], // limit user field width
                    }}
                  >
                    {item.user}
                  </Typography>
                </Tooltip>
              )}
              {/* Patient */}
              <Tooltip title={t("Patient name")} arrow>
                <Typography
                  variant="caption"
                  noWrap
                  sx={{
                    flexGrow: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: maxWidths["patient"], // limit patient field width
                  }}
                >
                  {item.patient}
                </Typography>
              </Tooltip>

              {/* Doctor & Medicine appear only if there's room */}
              <>
                {!isMobile && (
                  <Tooltip title={t("Doctor name")} arrow>
                    <Typography
                      variant="caption"
                      noWrap
                      sx={{
                        flexGrow: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: maxWidths["doctor"], // limit doctor field width
                      }}
                    >
                      {item.doctor}
                    </Typography>
                  </Tooltip>
                )}
                    
                <Tooltip title={t("Medicine")} arrow>
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{
                      flexGrow: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontStyle: "italic",
                      maxWidth: maxWidths["medicine"], // limit medicine field width
                    }}
                  >
                    {item.medicine?.name}
                  </Typography>
                </Tooltip>
              </>
            </AccordionSummary>

            <AccordionDetails sx={{ pt: 0.5, pb: 0.8, px: 2 }}>
              <Divider sx={{ mb: 0.5 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.1 }}>
                <Typography variant="caption">
                  <strong>{t("Date")}:</strong> {item.month/*formatDateDDMMMYYYY(`${item.year}-${1 + item.month}-${item.day}`)*/}
                </Typography>
                {allUsersRequests && (
                  <Typography variant="caption">
                    <strong>{t("User")}:</strong> {item.user}
                  </Typography>
                )}
                <Typography variant="caption">
                  <strong>{t("Patient")}:</strong> {item.patient}
                </Typography>
                <Typography variant="caption">
                  <strong>{t("Doctor")}:</strong> {item.doctor}
                </Typography>
                <Typography variant="caption">
                  <strong>{t("Medicine")}:</strong> {item.medicine?.name}
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default RequestScheduledDetails;
