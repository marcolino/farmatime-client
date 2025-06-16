import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Slide,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SecurityIcon from '@mui/icons-material/Security';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import heroSmallPortraitJpg from '../assets/images/health/hero-small-portrait.jpg';
import heroSmallPortraitWebp from '../assets/images/health/hero-small-portrait.webp';
import heroSmallJpg from '../assets/images/health/hero-small.jpg';
import heroSmallWebp from '../assets/images/health/hero-small.webp';
import heroMediumJpg from '../assets/images/health/hero-medium.jpg';
import heroMediumWebp from '../assets/images/health/hero-medium.webp';
import heroLargeJpg from '../assets/images/health/hero-large.jpg';
import heroLargeWebp from '../assets/images/health/hero-large.webp';

const faqs = [
  {
    question: 'Who is this app for?',
    answer: 'Patients and caregivers who regularly need to request prescriptions from physicians.',
  },
  {
    question: 'Is it really free?',
    answer: 'Yes! The app is 100% free during our initial beta testing period.',
  },
  {
    question: 'Do I need to install anything?',
    answer: 'No, just access it from any browser. No installation required.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. We use strong encryption and follow modern best practices for data protection.',
  },
];

const features = [
  { icon: <LocalPharmacyIcon color="primary" />, label: 'Pharmacy Ready', desc: 'Send confirmed requests straight to your doctor for approval.' },
  { icon: <ScheduleIcon color="primary" />, label: 'Set Reminders', desc: 'Never miss a refill – set weekly or monthly reminders easily.' },
  { icon: <SecurityIcon color="primary" />, label: 'Secure', desc: 'HIPAA-compliant storage and encrypted communication.' },
  { icon: <PhoneIcon color="primary" />, label: 'Accessible', desc: 'Use it from any device without downloading anything.' },
];

const howItWorks = [
  { icon: <PersonAddIcon />, step: '1. Sign Up', desc: 'Create your free account — no credit card required.' },
  { icon: <CheckCircleIcon />, step: '2. Add Medications', desc: 'List your prescriptions and your doctor’s details.' },
  { icon: <AccessTimeIcon />, step: '3. Request in Seconds', desc: 'Send repeat requests with just one click.' },
];

const Landing = () => {
  const [showHero, setShowHero] = React.useState(false);
  const [faqOpen, setFaqOpen] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowHero(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box component="main" sx={{ overflowX: 'hidden' }}>
      {/* Hero Section */}
      <Slide direction="left" in={showHero} mountOnEnter unmountOnExit>
        <Box sx={{ position: 'relative', width: '100%', height: { xs: '70vh', md: '90vh' }, mb: 6 }}>
          <picture>
            <source media="(orientation: portrait) and (max-width: 600px)" type="image/webp" srcSet={heroSmallPortraitWebp} />
            <source media="(orientation: portrait) and (max-width: 600px)" type="image/jpeg" srcSet={heroSmallPortraitJpg} />

            <source media="(max-width: 600px)" type="image/webp" srcSet={heroSmallWebp} />
            <source media="(max-width: 600px)" type="image/jpeg" srcSet={heroSmallJpg} />

            <source media="(max-width: 960px)" type="image/webp" srcSet={heroMediumWebp} />
            <source media="(max-width: 960px)" type="image/jpeg" srcSet={heroMediumJpg} />

            <source media="(min-width: 961px)" type="image/webp" srcSet={heroLargeWebp} />
            <source media="(min-width: 961px)" type="image/jpeg" srcSet={heroLargeJpg} />

            <img
              src={heroLargeJpg}
              alt="Health and Medicine"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </picture>

          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.4)',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              px: 2,
            }}
          >
            <Typography variant="h3" sx={{ mb: 2 }}>
              Simplify Your Prescription Requests
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 600, mb: 3 }}>
              Whether you're a patient or a caregiver, our tool makes it easy to request recurring medications from your physician — in just a few taps.
            </Typography>
            <Typography variant="subtitle2" sx={{ backgroundColor: 'primary.main', px: 2, py: 1, borderRadius: 2, mb: 2 }}>
              Free to use during beta testing!
            </Typography>
            <Button variant="contained" size="large" color="secondary">
              Start Immediately
            </Button>
          </Box>
        </Box>
      </Slide>

      {/* Features Section */}
      <Container sx={{ my: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Why Choose Our Platform?
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Box textAlign="center">
                {feature.icon}
                <Typography variant="h6" sx={{ mt: 1 }}>{feature.label}</Typography>
                <Typography variant="body2">{feature.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Container sx={{ my: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          How It Works
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {howItWorks.map((step, index) => (
            <Grid size={{ xs: 12, sm: 4 }} key={index}>
              <Box textAlign="center">
                {step.icon}
                <Typography variant="h6" sx={{ mt: 1 }}>{step.step}</Typography>
                <Typography variant="body2">{step.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* FAQ Section */}
      <Container sx={{ my: 6 }}>
        <Accordion expanded={faqOpen} onChange={() => setFaqOpen(!faqOpen)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">Frequently Asked Questions</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {faqs.map((faq, i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{faq.question}</Typography>
                <Typography variant="body2">{faq.answer}</Typography>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      </Container>

      {/* Final CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', color: '#fff', py: 6, px: 2, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Ready to Simplify Your Life?
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Get started now — it's completely free during our beta testing phase.
        </Typography>
        <Button variant="contained" color="secondary" size="large">
          Start Immediately
        </Button>
      </Box>
    </Box>
  );
};

export default Landing;
