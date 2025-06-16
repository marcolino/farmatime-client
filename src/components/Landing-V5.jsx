import React, { useState, useEffect } from 'react';

const Landing = () => {
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
      icon: "⏰",
      title: 'Automated Refills',
      description: 'Never miss a dose with our intelligent refill scheduling system'
    },
    {
      icon: "🔒",
      title: 'Secure & Private',
      description: 'Your medical information is protected with bank-level encryption'
    },
    {
      icon: "📞",
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
    <div className="overflow-hidden">
      {/* Hero Section */}
      <div
        className="min-h-screen bg-gradient-to-br from-slate-50 to-green-100 relative flex items-center"
        style={{ transform: `translateY(${heroParallax}px)` }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="animate-fade-in">
              <div className="mb-6">
                <span className="inline-block bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold">
                  🎉 Currently FREE during Beta Testing
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-green-600 bg-clip-text text-transparent">
                Simplify Your Medicine Management
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Connect with your physician to seamlessly reorder prescriptions. 
                Perfect for patients and caregivers who value convenience and reliability.
              </p>
              <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl">
                👤 Start Immediately
              </button>
            </div>
            <div className="text-center animate-slide-left">
              <picture>
                <source
                  media="(max-width: 599px)"
                  srcSet="../../assets/images/health/hero-bg-mobile.webp"
                  type="image/webp"
                />
                <source
                  media="(max-width: 599px)"
                  srcSet="../../assets/images/health/hero-bg-mobile.jpg"
                  type="image/jpeg"
                />
                <source
                  media="(max-width: 959px)"
                  srcSet="../../assets/images/health/hero-bg-tablet.webp"
                  type="image/webp"
                />
                <source
                  media="(max-width: 959px)"
                  srcSet="../../assets/images/health/hero-bg-tablet.jpg"
                  type="image/jpeg"
                />
                <source
                  srcSet="../../assets/images/health/hero-bg-desktop.webp"
                  type="image/webp"
                />
                <img
                  src="../../assets/images/health/hero-bg-desktop.jpg"
                  alt="Medicine management dashboard"
                  className="w-full max-w-lg h-auto rounded-2xl shadow-2xl mx-auto"
                />
              </picture>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div
        id="features"
        data-animate
        className="py-20 bg-slate-100"
        style={{ transform: `translateY(${parallaxOffset * 0.3}px)` }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 ${
                  isVisible.features ? 'animate-fade-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div
        id="how-it-works"
        data-animate
        className="py-20 bg-gradient-to-br from-green-50 to-blue-50"
        style={{ transform: `translateY(${parallaxOffset * 0.5}px)` }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            How It Works
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <picture>
                <source
                  media="(max-width: 599px)"
                  srcSet="../../assets/images/health/how-it-works-mobile.webp"
                  type="image/webp"
                />
                <source
                  media="(max-width: 599px)"
                  srcSet="../../assets/images/health/how-it-works-mobile.jpg"
                  type="image/jpeg"
                />
                <source
                  media="(max-width: 959px)"
                  srcSet="../../assets/images/health/how-it-works-tablet.webp"
                  type="image/webp"
                />
                <source
                  media="(max-width: 959px)"
                  srcSet="../../assets/images/health/how-it-works-tablet.jpg"
                  type="image/jpeg"
                />
                <source
                  srcSet="../../assets/images/health/how-it-works-desktop.webp"
                  type="image/webp"
                />
                <img
                  src="../../assets/images/health/how-it-works-desktop.jpg"
                  alt="Step-by-step process illustration"
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
              </picture>
            </div>
            <div className={`space-y-8 ${isVisible['how-it-works'] ? 'animate-fade-in' : 'opacity-0'}`}>
              {howItWorksSteps.map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="text-4xl font-bold text-green-500 opacity-70">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div
        id="testimonials"
        data-animate
        className="py-20 bg-white"
        style={{ transform: `translateY(${parallaxOffset * 0.2}px)` }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 shadow-lg ${
                  isVisible.testimonials ? 'animate-fade-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 300}ms` }}
              >
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div
        className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white text-center"
        style={{ transform: `translateY(${parallaxOffset * 0.1}px)` }}
      >
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Simplify Your Medicine Management?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Join thousands of patients and caregivers who trust our platform
          </p>
          <div className="mb-6">
            <span className="inline-block bg-white bg-opacity-20 text-white px-4 py-2 rounded-full text-lg font-semibold">
              ✨ Free during Beta - No Credit Card Required
            </span>
          </div>
          <button className="bg-white text-green-600 font-semibold py-4 px-8 rounded-xl text-lg transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-gray-50">
            ⏰ Start Immediately
          </button>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-left {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        
        .animate-slide-left {
          animation: slide-left 1.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Landing;