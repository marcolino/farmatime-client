//import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
  Slide,
  Container,
  Stack,
  Grid
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChildFriendly from "@mui/icons-material/ChildFriendly";
// import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
// import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import ScheduleIcon from "@mui/icons-material/Schedule";
// import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { MonetizationOnBarredIcon } from 'mui-material-custom';
import SecurityIcon from "@mui/icons-material/Security";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import heroSmallPortraitJpg from '../assets/images/health/hero-small-portrait.jpg';
import heroSmallPortraitWebp from '../assets/images/health/hero-small-portrait.webp';
import heroSmallJpg from '../assets/images/health/hero-small.jpg';
import heroSmallWebp from '../assets/images/health/hero-small.webp';
import heroMediumJpg from '../assets/images/health/hero-medium.jpg';
import heroMediumWebp from '../assets/images/health/hero-medium.webp';
import heroLargeJpg from '../assets/images/health/hero-large.jpg';
import heroLargeWebp from '../assets/images/health/hero-large.webp';
import SignIn from "./auth/SignIn";


export default function Landing() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const features = [
    {
      //icon: <ChildFriendly fontSize="large" color="primary" />, 
      icon: <TouchAppIcon fontSize="large" color="primary" />, 
      label: t("Super Easy"),
      desc: t("It's a super-easy web app that helps you say goodbye to the hassle of remembering to request doctor prescriptions — for yourself, your loved ones, or your assisted patients.")
    },
    {
      icon: <ScheduleIcon fontSize="large" color="primary" />, 
      label: t("Get Prescriptions in Your Inbox"),
      desc: t("Get your medicine prescriptions from your doctor in your email inbox, just when it's time to get it.")
    },
    // { // NEW-FEATURE
    //   icon: <LocalPharmacyIcon fontSize="large" color="primary" />, 
    //   label: t("Pharmacy Ready"),
    //   desc: t("Send prescriptions directly to your preferred pharmacy.")
    // },
    // { // NEW-FEATURE
    //   icon: <DeliveryDiningIcon fontSize="large" color="primary" />, 
    //   label: t("Get your medicines home"),
    //   desc: t("Get your medicines to your home from your preferred pharmacy.")
    // },
    {
      icon: <CheckCircleIcon fontSize="large" color="primary" />, 
      label: t("Never Miss a Refill"),
      desc: t("Keep your medicine cabinet always up-to-date.")
    },
    {
      //icon: <MonetizationOnBarredIcon fontSize="large" color="primary" />,
      icon: <CardGiftcardIcon fontSize="large" color="primary" />,
      label: t("Free"),
      desc: t("The app is currently in its initial stage and completely free to use — we're covering all provider costs. In the future, we may ask users for a small contribution to help share these costs, but it will always be a very modest amount.")
    },
    {
      icon: <SecurityIcon fontSize="large" color="primary" />, 
      label: t("Secure and Private"),
      desc: t("We prioritize your data privacy and security: any information will stay inside YOUR browser, crypted.")
    }
  ];

  const howItWorksPoints = [
    {
      desc: t("Sign up and add your patient(s) and physician's contacts")
    },
    {
      desc: t("Choose your recurring medicines")
    },
    {
      desc: t("Done! You'll receive the prescriptions in your inbox just in time!")
    },
  ];

  const qaList = [
    {
      q: t("Is the service really free?"),
      a: t("Yes! During the beta phase, all features are available at no cost."),
    },
    {
      q: t("Do I need to install an app?"),
      a: t("No installation needed. Access everything directly from your browser. But if you use it with a smartphone, you can install the app too."),
    },
    {
      q: t("Can caregivers manage prescriptions for others?"),
      a: t("Absolutely they can. Our system supports profiles for many patients or loved ones."),
    },
  ];
  
  const sectionStyle = {
    py: 8,
    //bgcolor: "background.paper",
    color: "text.primary",
    textAlign: "center",
    borderRadius: 2 ,
  };

  const titleStyle = {
    mb: 3,
    fontWeight: 700,
    color: "text.primary",
  };

  const pointstStyle = {
    maxWidth: 700,
    //mx: "auto",
    color: "text.secondary",
    mb: 0,
  };

  return (
    <Box>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>

        {/* Hero section */}
        <Box sx={{ position: "relative", height: isXs ? 500 : 600, overflow: "hidden" }}>
          <Slide in direction="left" timeout={{ enter: 1200 }} easing={{ enter: theme.transitions.easing.easeOut }}>
          <Box>
            <picture>
              <source
                media="(max-width: 599px) and (orientation: portrait)"
                srcSet={`${heroSmallPortraitWebp} 1x, ${heroSmallPortraitJpg} 2x`}
                type="image/webp"
              />
              <source
                media="(max-width: 599px)"
                srcSet={`${heroSmallWebp} 1x, ${heroSmallJpg} 2x`}
                type="image/webp"
              />
              <source
                media="(max-width: 960px)"
                srcSet={`${heroMediumWebp} 1x, ${heroMediumJpg} 2x`}
                type="image/webp"
              />
              <source
                srcSet={`${heroLargeWebp} 1x, ${heroLargeJpg} 2x`}
                type="image/webp"
              />
              <img
                src={heroLargeJpg}
                alt="Healthcare Hero"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "brightness(50%)", // 0% is fully black, 100% is original
                  borderRadius: "20px"
                }}
              />
            </picture>
          </Box>
          </Slide>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "top",
              justifyContent: "center",
              textAlign: "center",
              px: 2,
              mt: { xl: 20, lg: 16, md: 14, sm: 10, xs: 8 },
            }}
          >
            <Box>
              <Typography variant={isXs ? "h3" : "h3"} sx={{ fontWeight: 700, color: "common.white" }}>
                {t("Simplify Your Prescription Requests")}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2, color: "common.white" }}>
                  {t("Whether you're a patient or a caregiver, our tool makes it easy to request recurring medications from your physician — in just a few taps.")}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 4, px: 4, py: 1.5, /*fontSize: "1rem"*/ }}
              >
                {t("Start now — It's free!")}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Features section */}
        <Box component="section" sx={{ ...sectionStyle, py: 16 }}>
          <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, mb: 6 }}>
              {t("Why Choose Our Platform?")}
            </Typography>
            <Grid container direction="column" alignItems="center" spacing={5}>
              {features.map((feature, index) => (
                <Grid key={index} sx={{ width: "100%", maxWidth: 640 }}>
                  <Box
                    display="flex"
                    alignItems="flex-start"
                    sx={{ mx: "auto", width: "100%", maxWidth: 600 }}
                  >
                    {/* Icon column with fixed width */}
                    <Box sx={{ width: 40, display: "flex", justifyContent: "center", mt: "4px" }}>
                      {feature.icon}
                    </Box>

                    {/* Text column takes remaining space */}
                    <Box sx={{ ml: 2, textAlign: "left", flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {feature.label}
                      </Typography>
                      <Typography variant="body2">{feature.desc}</Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* How It Works section */}
        <Box component="section" sx={{ ...sectionStyle, py: 8, bgcolor: "secondary.main" }}>
          <Container maxWidth="lg">
            <Typography variant="h4" align="center" gutterBottom sx={titleStyle}>
              {t("How It Works")}
            </Typography>
            <Box
              sx={{
                maxWidth: 640,
                mx: "auto", // horizontally center the list
              }}
            >
              {howItWorksPoints.map((point, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      minWidth: "2ch",
                      mr: 1,
                      textAlign: "right",
                      fontWeight: "bold",
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}.
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: "left",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      ...pointstStyle,
                    }}
                  >
                    {point.desc}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

        {/* Q&A section */}
        <Box component="section" sx={{ ...sectionStyle, py: 16 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
              {t("Questions & Answers")}
            </Typography>
            <Stack spacing={2}>
              {qaList.map(({ q, a }, index) => (
                <Accordion
                  key={index}
                  disableGutters
                  elevation={0}
                  square
                  sx={{
                    borderBottom: "1px solid #e0e0e0",
                    "&:before": { display: "none" },
                    background: "transparent",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      paddingX: 0,
                      paddingY: 1,
                      minHeight: "auto",
                      "& .MuiAccordionSummary-content": {
                        margin: 0,
                      },
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {q}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ paddingX: 0, pt: 1, pb: 2 }}>
                    <Typography variant="body1">{a}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </Container>
        </Box>
        
        {/* Q&A section */}
        {/* <Box component="section" sx={{ ...sectionStyle, py: 16 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
              {t("Questions & Answers")}
            </Typography>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t("Is the service really free?")}
                </Typography>
                <Typography variant="body1">
                  {t("Yes! During the beta phase, all features are available at no cost.")}
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t("Do I need to install an app?")}
                </Typography>
                <Typography variant="body1">
                  {t("No installation needed. Access everything directly from your browser. But if you use it with a smartphone, you can install the app too.")}
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t("Can caregivers manage prescriptions for others?")}
                </Typography>
                <Typography variant="body1">
                  {t("Absolutely the can. Our system supports profiles for many patients or loved ones.")}
                </Typography>
              </Box>
            </Stack>
          </Container>
        </Box> */}

        {/* Final CTA section */}
        <Box component="section" sx={{ ...sectionStyle, mb: 16, bgcolor: "primary.main", color: "primary.contrastText" }}>
          <Container maxWidth="lg">
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {t("Ready to simplify your medication requests?")}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 2, px: 4, py: 1.5, fontSize: "1rem" }}
              onClick={() => navigate("/signin")}
            >
              {t("Get Started Now!")}
            </Button>
          </Container>
        </Box>
      </Container>
    </Box>
  );
}
