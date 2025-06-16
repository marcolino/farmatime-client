import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Paper
} from '@mui/material';
import {
  LocalPharmacy,
  Schedule,
  Security,
  Phone,
  CheckCircle,
  Star,
  AccessTime,
  PersonAdd
} from '@mui/icons-material';

import heroMedicineSmallJpg from '../assets/images/health/hero-medicine-small.jpg';
import heroMedicineSmallWebp from '../assets/images/health/hero-medicine-small.webp';
import heroMedicineMediumJpg from '../assets/images/health/hero-medicine-medium.jpg';
import heroMedicineMediumWebp from '../assets/images/health/hero-medicine-medium.webp';
import heroMedicineLargeJpg from '../assets/images/health/hero-medicine-large.jpg';
import heroMedicineLargeWebp from '../assets/images/health/hero-medicine-large.webp';

const Landing = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const parallaxOffset = scrollY * 0.5;
  const heroParallax = scrollY * 0.3;

  const features = [
    {
      icon: <Schedule sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Automated Refills',
      description: 'Never miss a dose with our intelligent refill scheduling system'
    },
    {
      icon: <Security sx={{ fontSize: 48, color: theme.palette.nature?.main || theme.palette.secondary.main }} />,
      title: 'Secure & Private',
      description: 'Your medical information is protected with bank-level encryption'
    },
    {
      icon: <Phone sx={{ fontSize: 48, color: theme.palette.marine?.main || theme.palette.primary.dark }} />,
      title: '24/7 Support',
      description: 'Our healthcare professionals are available around the clock'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Caregiver',
      text: 'This app has been a lifesaver for managing my mother\'s medications. So convenient!',
      rating: 5
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Family Physician',
      text: 'My patients love the convenience, and I appreciate the detailed medication tracking.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Patient',
      text: 'Finally, a simple way to get my prescriptions refilled without the hassle.',
      rating: 5
    }
  ];

  const howItWorksSteps = [
    { step: '01', title: 'Connect with Your Physician', desc: 'Securely link your account with your healthcare provider' },
    { step: '02', title: 'Set Up Your Medications', desc: 'Add your prescriptions and set refill preferences' },
    { step: '03', title: 'Automatic Reordering', desc: 'We handle the rest - timely refills delivered to you' }
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          //minHeight: '100vh',
          //background: `linear-gradient(360deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.light} 100%)`,
          background: `${theme.palette.background.default}`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          transform: `translateY(${heroParallax}px)`,
          //border: "1px solid blue"
        }}
      >
        <Container maxWidth="lg"> {/* sx={{ border: "1px solid red" }} */}
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Chip
                    label="🎉 Currently FREE during Beta Testing"
                    sx={{
                      mb: 3,
                      backgroundColor: theme.palette.ochre?.main || theme.palette.warning.light,
                      color: theme.palette.ochre?.contrastText || theme.palette.warning.contrastText,
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      px: 2,
                      py: 1,
                    }}
                  />
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                      fontWeight: 'bold',
                      mb: 3,
                      //background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
                      background: `${theme.palette.text.primary}`,
                      backgroundClip: 'text',
                      textFillColor: 'transparent',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Simplify Your Medicine Management
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 4,
                      color: theme.palette.text.secondary,
                      lineHeight: 1.6,
                      fontSize: { xs: '1.1rem', md: '1.3rem' }
                    }}
                  >
                    Connect with your physician to seamlessly reorder prescriptions. 
                    Perfect for patients and caregivers who value convenience and reliability.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PersonAdd />}
                    sx={{
                      fontSize: '1.2rem',
                      py: 2,
                      px: 4,
                      borderRadius: 3,
                      //background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      background: `${theme.palette.primary.main})`,
                      boxShadow: `0 8px 32px ${theme.palette.primary.main}40`,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 12px 40px ${theme.palette.primary.main}60`,
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Start Immediately
                  </Button>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Slide direction="left" in timeout={1200}>
                <Box sx={{ textAlign: 'center' }}>
                  <picture>
                    <source
                      media="(max-width: 599px)"
                      srcSet={heroMedicineSmallJpg}
                      type="image/webp"
                    />
                    <source
                      media="(max-width: 599px)"
                      srcSet={heroMedicineSmallJpg}
                      type="image/jpeg"
                    />
                    <source
                      media="(max-width: 959px)"
                      srcSet={heroMedicineMediumWebp}
                      type="image/webp"
                    />
                    <source
                      media="(max-width: 959px)"
                      srcSet={heroMedicineMediumJpg}
                      type="image/jpeg"
                    />
                    <source
                      srcSet={heroMedicineLargeWebp}
                      type="image/webp"
                    />
                    <img
                      src={heroMedicineLargeJpg}
                      alt="Medicine management dashboard"
                      style={{
                        width: '100%',
                        maxWidth: 500,
                        height: 'auto',
                        borderRadius: 16,
                        boxShadow: `0 20px 60px ${theme.palette.primary.main}30`
                      }}
                    />
                  </picture>
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        id="features"
        data-animate
        sx={{
          py: 10,
          backgroundColor: theme.palette.background.paper,
          transform: `translateY(${parallaxOffset * 0.3}px)`,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 6,
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 'bold',
              color: theme.palette.text.primary
            }}
          >
            Why Choose Our Platform?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Fade
                  in={isVisible.features}
                  timeout={1000 + index * 200}
                >
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 3,
                      //background: `linear-gradient(135deg, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
                      background: `${theme.palette.background.default}`,
                      boxShadow: `0 8px 32px ${theme.palette.primary.main}15`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 16px 48px ${theme.palette.primary.main}25`,
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ mb: 3 }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box
        id="how-it-works"
        data-animate
        sx={{
          py: 10,
          background: `linear-gradient(45deg, ${theme.palette.nature?.light || theme.palette.secondary.light}20, ${theme.palette.marine?.light || theme.palette.primary.light}20)`,
          transform: `translateY(${parallaxOffset * 0.5}px)`,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 8,
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 'bold'
            }}
          >
            How It Works
          </Typography>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <picture>
                <source
                  media="(max-width: 599px)"
                  srcSet="/assets/images/health/how-it-works-small.webp"
                  type="image/webp"
                />
                <source
                  media="(max-width: 599px)"
                  srcSet="/assets/images/health/how-it-works-small.jpg"
                  type="image/jpeg"
                />
                <source
                  media="(max-width: 959px)"
                  srcSet="/assets/images/health/how-it-works-medium.webp"
                  type="image/webp"
                />
                <source
                  media="(max-width: 959px)"
                  srcSet="/assets/images/health/how-it-works-medium.jpg"
                  type="image/jpeg"
                />
                <source
                  srcSet="/assets/images/health/how-it-works-large.webp"
                  type="image/webp"
                />
                <img
                  src="/assets/images/health/how-it-works-large.jpg"
                  alt="Step-by-step process illustration"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 16
                  }}
                />
              </picture>
            </Grid>
            <Grid item xs={12} md={6}>
              <Fade in={isVisible['how-it-works']} timeout={1000}>
                <Box>
                  {howItWorksSteps.map((item, index) => (
                    <Box key={index} sx={{ mb: 4, display: 'flex', alignItems: 'flex-start' }}>
                      <Typography
                        variant="h3"
                        sx={{
                          fontSize: '3rem',
                          fontWeight: 'bold',
                          color: theme.palette.primary.main,
                          mr: 3,
                          opacity: 0.7
                        }}
                      >
                        {item.step}
                      </Typography>
                      <Box>
                        <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {item.desc}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box
        id="testimonials"
        data-animate
        sx={{
          py: 10,
          backgroundColor: theme.palette.background.default,
          transform: `translateY(${parallaxOffset * 0.2}px)`,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 8,
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 'bold'
            }}
          >
            What Our Users Say
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Fade
                  in={isVisible.testimonials}
                  timeout={1000 + index * 300}
                >
                  <Card
                    sx={{
                      height: '100%',
                      p: 3,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.secondary.light}20)`,
                      boxShadow: `0 8px 32px ${theme.palette.primary.main}10`,
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', mb: 2 }}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} sx={{ color: theme.palette.ochre?.dark || theme.palette.warning.main, fontSize: 20 }} />
                        ))}
                      </Box>
                      <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                        "{testimonial.text}"
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Final CTA Section */}
      <Box
        sx={{
          py: 10,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: 'white',
          textAlign: 'center',
          transform: `translateY(${parallaxOffset * 0.1}px)`,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              mb: 3,
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 'bold'
            }}
          >
            Ready to Simplify Your Medicine Management?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of patients and caregivers who trust our platform
          </Typography>
          <Chip
            label="✨ Free during Beta - No Credit Card Required"
            sx={{
              mb: 4,
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '1rem',
              py: 2,
              px: 3
            }}
          />
          <br />
          <Button
            variant="contained"
            size="large"
            startIcon={<AccessTime />}
            sx={{
              fontSize: '1.2rem',
              py: 2,
              px: 4,
              borderRadius: 3,
              backgroundColor: 'white',
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            Start Immediately
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
