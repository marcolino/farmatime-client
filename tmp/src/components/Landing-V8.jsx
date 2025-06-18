import React from 'react';
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

  const [show, setShow] = React.useState(false);
  React.useEffect(() => setShow(true), []);

  return (
    <Box sx={{ overflowY: 'auto', width: '100%' }}>
      <HeroSection>
        <Slide direction="left" in={show} timeout={1200}>
          <div style={{ position: 'relative', width: '100%', height: 400 }}>
            <picture>
              {/* ...sources... */}
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
          </div>
        </Slide>
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
    </Box>
  );
}

export default Landing;
