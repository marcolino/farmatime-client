import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery
} from '@mui/material';
import {
  LocalPharmacy,
  Schedule,
  Security,
  CheckCircle,
  Star
} from '@mui/icons-material';

import heroSmallPortraitJpg from '../assets/images/health/hero-small-portrait.jpg';
import heroSmallPortraitWebp from '../assets/images/health/hero-small-portrait.webp';
import heroSmallJpg from '../assets/images/health/hero-small.jpg';
import heroSmallWebp from '../assets/images/health/hero-small.webp';
import heroMediumJpg from '../assets/images/health/hero-medium.jpg';
import heroMediumWebp from '../assets/images/health/hero-medium.webp';
import heroLargeJpg from '../assets/images/health/hero-large.jpg';
import heroLargeWebp from '../assets/images/health/hero-large.webp';

// Custom Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    secondary: {
      main: '#1976D2',
      light: '#42A5F5',
      dark: '#0D47A1',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      '@media (max-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.5rem',
      lineHeight: 1.3,
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1.1rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 32px',
          fontSize: '1.1rem',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '0.9rem',
          fontWeight: 600,
          padding: '8px 16px',
          height: 'auto',
        },
      },
    },
  },
});

const Landing = () => {
  const [scrollY, setScrollY] = useState(0);
  const [heroImageVisible, setHeroImageVisible] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Slide-in effect for hero image
    const timer = setTimeout(() => {
      setHeroImageVisible(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Detect orientation
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  const features = [
    {
      icon: <LocalPharmacy sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Easy Prescription Management',
      description: 'Upload and manage all your prescriptions in one secure place. Never lose track of your medications again.'
    },
    {
      icon: <Schedule sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Automated Reorders',
      description: 'Set up automatic refills and get reminders before you run out. Stay consistent with your treatment plan.'
    },
    {
      icon: <Security sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Secure & Private',
      description: 'Your health data is protected with bank-level encryption. Complete privacy and HIPAA compliance guaranteed.'
    }
  ];

  const benefits = [
    'Skip pharmacy queues and waiting times',
    'Get medications delivered to your door',
    'Set up automatic refills for chronic conditions',
    'Receive medication reminders and alerts',
    'Access your prescription history anytime',
    'Connect with your healthcare provider seamlessly'
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ overflow: 'hidden' }}>
        {/* Hero Section with Parallax */}
        <Box
          sx={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #E8F5E8 0%, #E3F2FD 50%, #F3E5F5 100%)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%), 
                          radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`,
              transform: `translateY(${scrollY * 0.5}px)`,
              opacity: 0.6,
            }
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Chip
                    label="🎉 Free Beta Access"
                    color="secondary"
                    sx={{ mb: 3 }}
                  />
                  <Typography variant="h1" color="text.primary" gutterBottom>
                    Never Miss Your
                    <Box component="span" sx={{ color: 'primary.main', display: 'block' }}>
                      Medications Again
                    </Box>
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>
                    Streamline your medication management with our intelligent platform. 
                    Order refills, set reminders, and stay connected with your healthcare provider - all in one place.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      background: 'linear-gradient(45deg, #2E7D32 30%, #4CAF50 90%)',
                      boxShadow: '0 6px 20px rgba(46, 125, 50, 0.3)',
                      mb: 2,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1B5E20 30%, #2E7D32 90%)',
                        boxShadow: '0 8px 25px rgba(46, 125, 50, 0.4)',
                      }
                    }}
                  >
                    Start Immediately - It's Free!
                  </Button>
                  <Typography variant="body2" color="text.secondary">
                    No credit card required • Free during beta testing
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    position: 'relative',
                    transform: `translateY(${scrollY * 0.1}px) translateX(${heroImageVisible ? '0' : '-100%'})`,
                    opacity: heroImageVisible ? 1 : 0,
                    transition: 'all 1s ease-out',
                    transitionDelay: heroImageVisible ? '0s' : '1.2s'
                  }}
                >
                  <Box
                    component="picture"
                    sx={{
                      display: 'block',
                      '& img': {
                        width: '100%',
                        height: 'auto',
                        borderRadius: 2,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    {/* Portrait mobile (vertical orientation) */}
                    {isPortrait && (
                      <>
                        <Box
                          component="source"
                          media="(max-width: 599px) and (orientation: portrait)"
                          srcSet={heroSmallPortraitWebp}
                          type="image/webp"
                        />
                        <Box
                          component="source"
                          media="(max-width: 599px) and (orientation: portrait)"
                          srcSet={heroSmallPortraitJpg}
                          type="image/jpeg"
                        />
                      </>
                    )}
                    
                    {/* Regular mobile */}
                    <Box
                      component="source"
                      media="(max-width: 599px)"
                      srcSet={heroSmallWebp}
                      type="image/webp"
                    />
                    <Box
                      component="source"
                      media="(max-width: 599px)"
                      srcSet={heroSmallJpg}
                      type="image/jpeg"
                    />
                    
                    {/* Tablet */}
                    <Box
                      component="source"
                      media="(max-width: 959px)"
                      srcSet={heroMediumWebp}
                      type="image/webp"
                    />
                    <Box
                      component="source"
                      media="(max-width: 959px)"
                      srcSet={heroMediumJpg}
                      type="image/jpeg"
                    />
                    
                    {/* Desktop */}
                    <Box
                      component="source"
                      srcSet={heroLargeWebp}
                      type="image/webp"
                    />
                    <Box
                      component="img"
                      srcSet={heroLargeJpg}
                      alt="Healthcare professional managing medications"
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: 12, backgroundColor: 'background.paper' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="h2" color="text.primary" gutterBottom>
                Why Choose Our Platform?
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
                Experience the future of medication management with features designed 
                for patients and caregivers who value convenience and reliability.
              </Typography>
            </Box>
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: 4,
                      transform: `translateY(${scrollY * 0.03 * (index + 1)}px)`,
                      transition: 'transform 0.1s ease-out'
                    }}
                  >
                    <CardContent>
                      <Box sx={{ mb: 3 }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h3" gutterBottom color="text.primary">
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Benefits Section with Parallax Background */}
        <Box
          sx={{
            py: 12,
            position: 'relative',
            background: 'linear-gradient(135deg, #F8F9FA 0%, #E3F2FD 100%)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at 10% 10%, rgba(34, 197, 94, 0.2) 0%, transparent 50%), 
                          radial-gradient(circle at 90% 90%, rgba(99, 102, 241, 0.2) 0%, transparent 50%)`,
              transform: `translateY(${scrollY * 0.3}px)`,
              opacity: 0.6,
            }
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    transform: `translateY(${scrollY * 0.08}px)`,
                    transition: 'transform 0.1s ease-out'
                  }}
                >
                  <Box
                    component="picture"
                    sx={{
                      display: 'block',
                      '& img': {
                        width: '100%',
                        height: 'auto',
                        borderRadius: 2,
                        boxShadow: '0 16px 32px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Box
                      component="source"
                      media="(max-width: 599px)"
                      srcSet="../assets/images/health/benefits-small.webp"
                      type="image/webp"
                    />
                    <Box
                      component="source"
                      media="(max-width: 599px)"
                      srcSet="../assets/images/health/benefits-small.jpg"
                      type="image/jpeg"
                    />
                    <Box
                      component="source"
                      media="(max-width: 959px)"
                      srcSet="../assets/images/health/benefits-medium.webp"
                      type="image/webp"
                    />
                    <Box
                      component="source"
                      media="(max-width: 959px)"
                      srcSet="../assets/images/health/benefits-medium.jpg"
                      type="image/jpeg"
                    />
                    <Box
                      component="source"
                      srcSet="../assets/images/health/benefits-large.webp"
                      type="image/webp"
                    />
                    <Box
                      component="img"
                      src="../assets/images/health/benefits-large.jpg"
                      alt="Patient using medication management app"
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h2" color="text.primary" gutterBottom>
                  Everything You Need in One App
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Simplify your healthcare routine with comprehensive medication management 
                  that puts you in control of your health journey.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {benefits.map((benefit, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <CheckCircle sx={{ color: 'primary.main', fontSize: 24, mt: 0.25 }} />
                      <Typography variant="body1" color="text.primary">
                        {benefit}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Testimonial Section */}
        <Box sx={{ py: 12, backgroundColor: 'background.paper' }}>
          <Container maxWidth="md">
            <Card
              sx={{
                p: 6,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
                transform: `translateY(${scrollY * 0.06}px)`,
                transition: 'transform 0.1s ease-out',
                border: '1px solid rgba(0,0,0,0.05)'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} sx={{ color: '#FFD700', fontSize: 28 }} />
                ))}
              </Box>
              <Typography variant="h3" color="text.primary" gutterBottom sx={{ fontStyle: 'italic' }}>
                "This app has transformed how I manage my mother's medications. 
                The automated reminders and easy reordering save us so much time and worry."
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 3, fontWeight: 500 }}>
                Sarah M. - Caregiver
              </Typography>
            </Card>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            py: 12,
            background: 'linear-gradient(135deg, #2E7D32 0%, #1976D2 100%)',
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400"><path d="M0,100 Q300,50 600,100 T1200,100 L1200,400 L0,400 Z" fill="rgba(255,255,255,0.1)" /></svg>')`,
              transform: `translateY(${scrollY * 0.2}px)`,
              opacity: 0.8,
            }
          }}
        >
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h2" gutterBottom sx={{ color: 'white' }}>
              Ready to Get Started?
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, opacity: 0.9, fontSize: '1.2rem', maxWidth: 600, mx: 'auto' }}>
              Join thousands of patients and caregivers who have simplified their medication management. 
              Start your free beta access today - no commitments, no hidden fees.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                mb: 3,
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                }
              }}
            >
              Start Immediately - Completely Free
            </Button>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Free during beta testing • No credit card required • HIPAA compliant
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Landing;
