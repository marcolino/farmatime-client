import { useState, useRef } from "react";
import { useTranslation } from 'react-i18next';
import {
  Box,
  IconButton,
  Modal,
  Typography,
  useTheme,
} from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";


export function ContextualHelpWrapper({
  children,
  helpPagesKey,
  icon = <InfoIcon fontSize="medium" />,
  placement = "top-left",
  fullWidth = false,
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const iconButtonRef = useRef(null);
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  // Help content map
  const HelpPages = {
    MedicineName: {
      title: t("Medicine Name"),
      content: (
        <>
          <p>{t('Enter the name of the medicine, its active ingredient, or its ATC code')}.</p>
          <p>
            {t('You can use the autocomplete feature to help you find the correct medicine:\
 it is sufficent to start typing the medicine name. If you don\'t find your medicine in the list, digit one more letter: all Italian medicines are present.')}.
          </p>
        </>
      ),
    },
    DateSince: {
      title: t("Date of first request"),
      content: (
        <>
          <p>{t('Enter the date when the first request to the doctor should be made')}.</p>
          <p>
            {t('For example, if you have some pills left, and you foresee to finish it\
 in a week, you should enter the day after a week from now')}.
          </p>
        </>
      ),
    },
    Frequency: {
      title: t("Frequency of the requests"),
      content: (
        <>
          <p>{t('Enter the frequency of the requests, in days')}.</p>
          <p>
            {
              t('For example, if you have to take 2 pills a day, and the packaging contains 36 pills,\
 you should enter 18 here, to request the medicine every 18 days')}.
            </p>
        </>
      ),
    },

    _PatientFirstName: { // disabled, too trivial...
      title: t("Patient first name"),
      content: (
        <>
          <p>{t('Enter the name of the patient')}.</p>
          <p>
            {
              t('...')
            }
          </p>
        </>
      ),
    },
    _PatientLastName: { // disabled, too trivial...
      title: t("Patient last name"),
      content: (
        <>
          <p>{t('Enter the last name of the patient')}.</p>
          <p>
            {
              t('...')
            }
          </p>
        </>
      ),
    },
    _PatientEmail: { // disabled, too trivial...
      title: t("Patient email"),
      content: (
        <>
          <p>{t('Enter the email of the patient')}.</p>
          <p>
            {
              t('...')
            }
          </p>
        </>
      ),
    },
    
    _DoctorFirstName: { // disabled, too trivial...
      title: t("Doctor first name"),
      content: (
        <>
          <p>{t('Enter the name of the doctor')}.</p>
          <p>
            {
              t('...')
            }
          </p>
        </>
      ),
    },
    _DoctorLastName: { // disabled, too trivial...
      title: t("Doctor last name"),
      content: (
        <>
          <p>{t('Enter the last name of the doctor')}.</p>
          <p>
            {
              t('...')
            }
          </p>
        </>
      ),
    },
    _DoctorEmail: { // disabled, too trivial...
      title: t("Doctor email"),
      content: (
        <>
          <p>{t('Enter the email of the doctor')}.</p>
          <p>
            {
              t('...')
            }
          </p>
        </>
      ),
    },

    EmailTemplateSubject: {
      title: t("Email subject"),
      content: (
        <>
          <p>{t('Edit the email subject...')}.</p>
        </>
      ),
    },
    EmailTemplateBody: {
      title: t("Email body"),
      content: (
        <>
          <p>{t('Edit the email body...')}.</p>
          <p>
            {
              t('Use variables...')
            }
          </p>
        </>
      ),
    },
    // EmailTemplateSignature: {
    //   title: t("Email signature"),
    //   content: (
    //     <>
    //       <p>{t('Edit the email signature...')}.</p>
    //       <p>
    //         {
    //           t('...')
    //         }
    //       </p>
    //     </>
    //   ),
    // },

  };
  
  const placementOffsets = {
    "top-left": { top: -28, left: -28 },
    "top-right": { top: -28, right: 28 },
    "bottom-left": { bottom: 28, left: -28 },
    "bottom-right": { bottom: 28, right: 28 },
  };

  const help = HelpPages[helpPagesKey];
  if (!help) return children;

  const placementStyle = placementOffsets[placement] || placementOffsets["top-left"];

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{
      position: "relative",
      ...(fullWidth && { width: "100%" }),
    }}>
      <Box>{children}</Box>
      {!isXs && (
        <>
        <Box
          sx={{
            position: "absolute",
            zIndex: 10,
            ...placementStyle,
          }}
          onClick={handleOpen}
        >
          <IconButton
            size="large"
            sx={{ color: theme.palette.primary.main }}
            ref={iconButtonRef}
          >
            {icon}
          </IconButton>
        </Box>
    
          <Modal
            open={open}
            onClose={handleClose}
            disableAutoFocus
            slotProps={{
              backdrop: {
                sx: {
                  bgColor: 'rgba(0, 0, 0, 0.1)', // Semi transparent background
                },
              },
            }}
          >
          <Box
            sx={{
              position: "absolute",
              top: "10%",
              left: "50%",
              transform: "translateX(-50%)",
              maxHeight: "80%",
              width: "90%",
              maxWidth: 600,
              overflowY: "auto",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 0,
              borderRadius: 2,
              outline: "none",
            }}
          >
            <Box
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2,
                py: 1,
                borderTopLeftRadius: 2,
                borderTopRightRadius: 2,
              }}
            >
              <Typography variant="h6">{help.title}</Typography>
              <IconButton onClick={handleClose} size="small" sx={{ color: "inherit" }}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ p: 2 }}>{help.content}</Box>
          </Box>
          </Modal>
          </>
      )}
    </Box>
  );
}

export const ContextualHelp = ContextualHelpWrapper;
