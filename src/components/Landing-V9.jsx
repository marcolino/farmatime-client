//import React from 'react';
import { Box, Typography, Button, Container, Slide, useTheme } from '@mui/material';
import { styled } from '@mui/system';

import heroMedicineSmallJpg from '../assets/images/health/hero-medicine-small.jpg';
import heroMedicineSmallWebp from '../assets/images/health/hero-medicine-small.webp';
import heroMedicineMediumJpg from '../assets/images/health/hero-medicine-medium.jpg';
import heroMedicineMediumWebp from '../assets/images/health/hero-medicine-medium.webp';
import heroMedicineLargeJpg from '../assets/images/health/hero-medicine-large.jpg';
import heroMedicineLargeWebp from '../assets/images/health/hero-medicine-large.webp';

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '90vh',
  width: '100%',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
  textAlign: 'center',
  backgroundAttachment: 'fixed',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

const Overlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
  //background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.1))',
  background: 'rgba(0,0,0,0.7)',
  zIndex: 1,
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  padding: theme.spacing(4),
  maxWidth: 800,
}));

const Section = styled(Container)(({ theme }) => ({
  padding: theme.spacing(8, 2),
  textAlign: 'center',
}));

const Landing = () => {
  const theme = useTheme();

  return (
    <Box sx={{ overflowY: 'auto', width: '100%' }}>
      <HeroSection>
        {/* <Slide direction="left" in timeout={1}>     */}
        <picture>
          <source
            srcSet={`${heroMedicineLargeWebp}`}
            type="image/webp"
            media="(min-width: 1200px)"
          />
          <source
            srcSet={`${heroMedicineLargeJpg}`}
            type="image/jpeg"
            media="(min-width: 1200px)"
          />
          <source
            srcSet={`${heroMedicineMediumWebp}`}
            type="image/webp"
            media="(min-width: 600px)"
          />
          <source
            srcSet={`${heroMedicineMediumJpg}`}
            type="image/jpeg"
            media="(min-width: 600px)"
          />
          <img
            src={heroMedicineSmallJpg}
            alt="Medicine service"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
            }}
          />
          </picture>
        {/* </Slide> */}
        <Overlay />
        <HeroContent>
          <Typography variant="h3" component="h1" gutterBottom>
            Simplify Your Prescription Requests
          </Typography>
          <Typography variant="h6" component="p">
            Effortlessly reorder medicines for yourself or your loved ones. No more phone calls or missed prescriptions.
          </Typography>
          <Button variant="contained" size="large" color="primary">
            Start immediately
          </Button>
        </HeroContent>
      </HeroSection>

      <Section maxWidth="md">
        <Typography variant="h4" gutterBottom>
          How It Works
        </Typography>
        <Typography variant="body1" paragraph>
          Our app helps patients and caregivers quickly reorder previously prescribed medicines. Just select the needed items, and we'll handle the request with your physician.
        </Typography>
        <Typography variant="body1" paragraph>
          It’s safe, fast, and requires no technical knowledge. Designed with accessibility and clarity in mind.
        </Typography>
      </Section>

      <Section maxWidth="md" sx={{ backgroundColor: theme.palette.background.default }}>
        <Typography variant="h4" gutterBottom>
          Who It's For
        </Typography>
        <Typography variant="body1" paragraph>
          Whether you're managing your own prescriptions or supporting an elderly parent or loved one, this app streamlines communication with doctors.
        </Typography>
        <Typography variant="body1" paragraph>
          Perfect for families, caregivers, and patients with recurring medical needs.
        </Typography>
      </Section>

      <Section maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Free During Beta
        </Typography>
        <Typography variant="body1" paragraph>
          We are currently in a beta testing phase. That means you can use the app for free, with no hidden charges, while we continue to improve the experience based on your feedback.
        </Typography>
        <Typography variant="body1" paragraph>
          Join now and help shape the future of medical convenience.
        </Typography>
      </Section>
    </Box>
  );
};

export default Landing;
