import React from 'react';
import { Box, Typography, Button, Container, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
//import { Slide } from 'react-motion';
import { Motion, spring } from 'react-motion';
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
    question: "Who is this app for?",
    answer: "Our app is designed for patients and caregivers who need to regularly request prescriptions from their physicians."
  },
  {
    question: "Is it really free?",
    answer: "Yes! During our beta testing phase, all features are completely free of charge."
  },
  {
    question: "Do I need to install anything?",
    answer: "No installation needed. Just open the website and start using it from any device."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We take privacy seriously and use industry-standard encryption to keep your data safe."
  }
];

const Landing = () => {
  const [showHero, setShowHero] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => setShowHero(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowX: 'hidden',
        width: '100%',
        px: 2,
        pb: 4,
      }}
    >
      {/* Hero Section */}
      <Motion
        defaultStyle={{ x: 3200 }}
        style={{ x: spring(showHero ? 0 : 3200) }}
      >
        {({ x }) => (
          <Box
            sx={{
              width: '100%',
              maxHeight: '80vh',
              overflow: 'hidden',
              position: 'relative',
              mb: 4,
              transform: `translateX(${x}px)`,
            }}
          >
            <picture>
              <source
                media="(orientation: portrait) and (max-width: 600px)"
                type="image/webp"
                srcSet={heroSmallPortraitWebp}
              />
              <source
                media="(orientation: portrait) and (max-width: 600px)"
                type="image/jpeg"
                srcSet={heroSmallPortraitJpg}
              />

              <source media="(max-width: 600px)" type="image/webp" srcSet={heroSmallWebp} />
              <source media="(max-width: 600px)" type="image/jpeg" srcSet={heroSmallJpg} />

              <source media="(max-width: 960px)" type="image/webp" srcSet={heroMediumWebp} />
              <source media="(max-width: 960px)" type="image/jpeg" srcSet={heroMediumJpg} />

              <source media="(min-width: 961px)" type="image/webp" srcSet={heroLargeWebp} />
              <source media="(min-width: 961px)" type="image/jpeg" srcSet={heroLargeJpg} />

              <img
                src={heroLargeJpg}
                alt="Health and Medicine"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                }}
              />
            </picture>
          </Box>
        )}
      </Motion>

      {/* Introduction */}
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Simplify Your Prescription Requests
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Whether you're a patient or a caregiver, our tool makes it easy to request recurring medications from your physician — in just a few taps.
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            my: 2,
            background: (theme) => `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: 'white',
            p: 1,
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          Currently free during beta testing — try it today!
        </Typography>
        <Button variant="contained" color="primary" size="large">
          Start immediately
        </Button>
      </Container>

      {/* FAQ Section */}
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Typography variant="h5" component="h2" gutterBottom textAlign="center">
          Frequently Asked Questions
        </Typography>
        {faqs.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
};

export default Landing;
