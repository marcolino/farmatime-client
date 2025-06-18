import React, { useState, useEffect } from 'react';

const Landing = () => {
  const [scrollY, setScrollY] = useState(0);
  const [heroImageVisible, setHeroImageVisible] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

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
      icon: '💊',
      title: 'Easy Prescription Management',
      description: 'Upload and manage all your prescriptions in one secure place. Never lose track of your medications again.'
    },
    {
      icon: '⏰',
      title: 'Automated Reorders',
      description: 'Set up automatic refills and get reminders before you run out. Stay consistent with your treatment plan.'
    },
    {
      icon: '🔒',
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
    <div className="overflow-hidden bg-gray-50">
      {/* Hero Section with Parallax */}
      <div className="relative min-h-screen flex items-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        {/* Parallax Background Elements */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%), 
                        radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`,
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-6">
                🎉 Free Beta Access
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Never Miss Your
                <span className="block text-green-600">Medications Again</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                Streamline your medication management with our intelligent platform. 
                Order refills, set reminders, and stay connected with your healthcare provider - all in one place.
              </p>
              <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 mb-4">
                Start Immediately - It's Free!
              </button>
              <p className="text-sm text-gray-500">
                No credit card required • Free during beta testing
              </p>
            </div>
            <div 
              className={`relative transition-all duration-1000 ease-out ${
                heroImageVisible 
                  ? 'translate-x-0 opacity-100' 
                  : '-translate-x-full opacity-0'
              }`}
              style={{
                transform: `translateY(${scrollY * 0.1}px) translateX(${heroImageVisible ? '0' : '-100%'})`,
                transition: 'transform 0.1s ease-out, opacity 1s ease-out 1.2s, translate 1s ease-out 1.2s'
              }}
            >
              <picture>
                {/* Portrait mobile (vertical orientation) */}
                {isPortrait && (
                  <>
                    <source
                      media="(max-width: 599px) and (orientation: portrait)"
                      srcSet="../assets/images/health/hero-small-portrait.webp"
                      type="image/webp"
                    />
                    <source
                      media="(max-width: 599px) and (orientation: portrait)"
                      srcSet="../assets/images/health/hero-small-portrait.jpg"
                      type="image/jpeg"
                    />
                  </>
                )}
                
                {/* Regular mobile (landscape or when portrait detection fails) */}
                <source
                  media="(max-width: 599px)"
                  srcSet="../assets/images/health/hero-small.webp"
                  type="image/webp"
                />
                <source
                  media="(max-width: 599px)"
                  srcSet="../assets/images/health/hero-small.jpg"
                  type="image/jpeg"
                />
                
                {/* Tablet */}
                <source
                  media="(max-width: 959px)"
                  srcSet="../assets/images/health/hero-medium.webp"
                  type="image/webp"
                />
                <source
                  media="(max-width: 959px)"
                  srcSet="../assets/images/health/hero-medium.jpg"
                  type="image/jpeg"
                />
                
                {/* Desktop */}
                <source
                  srcSet="../assets/images/health/hero-large.webp"
                  type="image/webp"
                />
                <img
                  src="../assets/images/health/hero-large.jpg"
                  alt="Healthcare professional managing medications"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </picture>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience the future of medication management with features designed 
              for patients and caregivers who value convenience and reliability.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                style={{
                  transform: `translateY(${scrollY * 0.03 * (index + 1)}px)`,
                  transition: 'transform 0.1s ease-out, box-shadow 0.3s ease, translate 0.3s ease'
                }}
              >
                <div className="text-5xl mb-6 text-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section with Parallax Background */}
      <div className="py-20 relative bg-gradient-to-br from-gray-50 to-blue-50">
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 10% 10%, rgba(34, 197, 94, 0.2) 0%, transparent 50%), 
                        radial-gradient(circle at 90% 90%, rgba(99, 102, 241, 0.2) 0%, transparent 50%)`,
            transform: `translateY(${scrollY * 0.3}px)`
          }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <picture>
                <source
                  media="(max-width: 599px)"
                  srcSet="../assets/images/health/benefits-small.webp"
                  type="image/webp"
                />
                <source
                  media="(max-width: 599px)"
                  srcSet="../assets/images/health/benefits-small.jpg"
                  type="image/jpeg"
                />
                <source
                  media="(max-width: 959px)"
                  srcSet="../assets/images/health/benefits-medium.webp"
                  type="image/webp"
                />
                <source
                  media="(max-width: 959px)"
                  srcSet="../assets/images/health/benefits-medium.jpg"
                  type="image/jpeg"
                />
                <source
                  srcSet="../assets/images/health/benefits-large.webp"
                  type="image/webp"
                />
                <img
                  src="../assets/images/health/benefits-large.jpg"
                  alt="Patient using medication management app"
                  className="w-full h-auto rounded-2xl shadow-xl"
                  style={{
                    transform: `translateY(${scrollY * 0.08}px)`,
                    transition: 'transform 0.1s ease-out'
                  }}
                />
              </picture>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Everything You Need in One App
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Simplify your healthcare routine with comprehensive medication management 
                that puts you in control of your health journey.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div 
            className="max-w-4xl mx-auto text-center bg-gradient-to-br from-white to-gray-50 rounded-3xl p-12 shadow-xl border border-gray-100"
            style={{
              transform: `translateY(${scrollY * 0.06}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              "This app has transformed how I manage my mother's medications. 
              The automated reminders and easy reordering save us so much time and worry."
            </h3>
            <p className="text-lg text-gray-600">
              Sarah M. - Caregiver
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-br from-green-600 to-blue-600 text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400"><path d="M0,100 Q300,50 600,100 T1200,100 L1200,400 L0,400 Z" fill="rgba(255,255,255,0.1)" /></svg>')`,
            transform: `translateY(${scrollY * 0.2}px)`
          }}
        />
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Join thousands of patients and caregivers who have simplified their medication management. 
            Start your free beta access today - no commitments, no hidden fees.
          </p>
          <button className="bg-white text-green-600 font-semibold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:bg-gray-50 mb-4">
            Start Immediately - Completely Free
          </button>
          <p className="text-sm opacity-80">
            Free during beta testing • No credit card required • HIPAA compliant
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
