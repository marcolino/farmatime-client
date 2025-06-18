import React from "react";
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
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SecurityIcon from "@mui/icons-material/Security";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import heroSmallPortraitJpg from '../assets/images/health/hero-small-portrait.jpg';
import heroSmallPortraitWebp from '../assets/images/health/hero-small-portrait.webp';
import heroSmallJpg from '../assets/images/health/hero-small.jpg';
import heroSmallWebp from '../assets/images/health/hero-small.webp';
import heroMediumJpg from '../assets/images/health/hero-medium.jpg';
import heroMediumWebp from '../assets/images/health/hero-medium.webp';
import heroLargeJpg from '../assets/images/health/hero-large.jpg';
import heroLargeWebp from '../assets/images/health/hero-large.webp';

const features = [
  {
    icon: <LocalPharmacyIcon fontSize="large" color="primary" />, 
    label: "Pharmacy Ready",
    desc: "Send prescriptions directly to your preferred pharmacy."
  },
  {
    icon: <ScheduleIcon fontSize="large" color="primary" />, 
    label: "Set Reminders",
    desc: "Get notified when it’s time to renew medications."
  },
  {
    icon: <CheckCircleIcon fontSize="large" color="primary" />, 
    label: "Never Miss a Refill",
    desc: "Keep your prescriptions up to date, hassle-free."
  },
  {
    icon: <SecurityIcon fontSize="large" color="primary" />, 
    label: "Secure and Private",
    desc: "We prioritize your data privacy and security."
  }
];

export default function Landing() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const sectionSx = {
    py: 8,
    bgcolor: "background.paper",
    color: "text.primary",
    textAlign: "center",
  };

  const titleSx = {
    mb: 3,
    fontWeight: 700,
    color: "text.primary",
  };

  const textSx = {
    maxWidth: 700,
    mx: "auto",
    color: "text.secondary",
    mb: 4,
  };

  return (
    <Box>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
      {/* Hero Section */}
      <Box sx={{ position: "relative", height: isXs ? 500 : 600, overflow: "hidden" }}>
        <Slide in direction="right" timeout={{ enter: 1200 }} easing={{ enter: theme.transitions.easing.easeOut }}>
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
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "20px" }}
            />
          </picture>
        </Slide>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 2,
          }}
        >
          <Box>
            <Typography variant={isXs ? "h5" : "h3"} sx={{ fontWeight: 700, color: "common.white" }}>
              Simplify Your Prescription Requests
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, color: "common.white" }}>
              Whether you're a patient or a caregiver, our tool makes it easy to request recurring medications from your physician — in just a few taps.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 4, px: 4, py: 1.5, fontSize: "1rem" }}
            >
              Start Immediately — It's Free During Beta
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Features Section */}
      <Box component="section" sx={{ py: 8, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700, mb: 6 }}>
            Why Choose Our Platform?
          </Typography>
          <Grid container direction="column" alignItems="center" spacing={5}>
            {features.map((feature, index) => (
              <Grid key={index} sx={{ width: "100%", maxWidth: 600 }}>
                <Box display="flex" alignItems="flex-start" gap={2}>
                  <Box sx={{ mt: "2px" }}>{feature.icon}</Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{feature.label}</Typography>
                    <Typography variant="body2">{feature.desc}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box component="section" sx={sectionSx}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={titleSx}>How It Works</Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body1" sx={textSx}>
                1. Sign up and add your physician's contact
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body1" sx={textSx}>
                2. Choose your recurring medications
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body1" sx={textSx}>
                3. We'll remind you when it’s time and forward your request
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Q&A Section */}
      <Box component="section" sx={sectionSx}>
        <Container maxWidth="lg">
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Questions & Answers</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Is the service really free?</Typography>
                  <Typography variant="body1">Yes! During the beta phase, all features are available at no cost.</Typography>
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Do I need to install an app?</Typography>
                  <Typography variant="body1">No installation needed. Access everything directly from your browser.</Typography>
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Can caregivers manage prescriptions for others?</Typography>
                  <Typography variant="body1">Absolutely. Our system supports profiles for dependents or loved ones.</Typography>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Container>
      </Box>

      {/* Final CTA Section */}
      <Box component="section" sx={{ ...sectionSx, bgcolor: "primary.main", color: "primary.contrastText" }}>
        <Container maxWidth="lg">
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Ready to simplify your medication requests?
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 2, px: 4, py: 1.5, fontSize: "1rem" }}
          >
            Get Started Now — It’s Free
          </Button>
        </Container>
        </Box>
        </Container>
    </Box>
  );
}