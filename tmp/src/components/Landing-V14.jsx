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
  { icon: <PhoneIcon color="primary" />, label: 'Accessible Anywhere', desc: 'Use it from any device without downloading anything.' },
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
    <Container maxWidth="lg">
    <Box component="main" sx={{ overflowX: 'hidden', bgcolor: '#fff' }}>
      {/* Hero Section */}
      <Box sx={{ position: 'relative', height: { xs: '50vh', md: '70vh' }, width: '100%' }}>
        <Slide direction="left" in={showHero} timeout={1200}>
          <Box sx={{ height: '100%', width: '100%' }}>
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
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10/*theme.shape.borderRadius*/ }}
              />
            </picture>
          </Box>
        </Slide>

        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 2,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.0)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            px: 2,
            textAlign: 'center',
            color: 'white', 
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
              Simplify Your Prescription Requests
            </Typography>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Whether you're a patient or a caregiver, our tool makes it easy to request recurring medications from your physician — in just a few taps.
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2, backgroundColor: 'primary.main', px: 2, py: 1, borderRadius: 2, display: 'inline-block' }}>
              Free to use during beta testing!
            </Typography>
            <Box mt={2}>
              <Button variant="contained" size="large" color="secondary">
                Start Immediately
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>

     {/* Features Section */}
<Box component="section" sx={{ py: 8, bgcolor: "background.paper" }}>
  <Container maxWidth="lg" sx={{ py: 8 }}>
    <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700, mb: 6 }}>
      Why Choose Our Platform?
    </Typography>
    <Grid
      container
      direction="column"
      alignItems="center"
      spacing={5}
    >
      {features.map((feature, index) => (
        <Grid key={index} sx={{ width: '100%', maxWidth: 600 }}>
          <Box display="flex" alignItems="flex-start" gap={2}>
            <Box sx={{ mt: "2px" }}>{feature.icon}</Box>
            <Box>
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

      {/* How It Works Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700, mb: 6 }}>
          How It Works
        </Typography>
        <Grid container spacing={4}>
          {howItWorks.map((step, index) => (
            <Grid size={{ xs: 12, sm: 4 }} key={index}>
              <Box textAlign="center">
                {step.icon}
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>{step.step}</Typography>
                <Typography variant="body2">{step.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* FAQ Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Accordion expanded={faqOpen} onChange={() => setFaqOpen(!faqOpen)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Frequently Asked Questions</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {faqs.map((faq, i) => (
              <Box key={i} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{faq.question}</Typography>
                <Typography variant="body2">{faq.answer}</Typography>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      </Container>

      {/* Final CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', color: '#fff', py: 8 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Ready to Simplify Your Life?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Get started now — it's completely free during our beta testing phase.
          </Typography>
          <Button variant="contained" color="secondary" size="large">
            Start Immediately
          </Button>
        </Container>
      </Box>
    </Box>
    </Container>
  );
};

export default Landing;
