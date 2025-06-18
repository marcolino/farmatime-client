import { useEffect, useState } from 'react';
import { ArrowRight, Shield, Clock, Users, Star, Check } from 'lucide-react';

const Landing = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <div 
          className="absolute inset-0 z-0"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
          <picture className="absolute inset-0 w-full h-full">
            <source 
              media="(max-width: 640px)" 
              srcSet="../assets/images/health/hero-bg-small.webp 640w, ../assets/images/health/hero-bg-small.jpg 640w" 
              type="image/webp" 
            />
            <source 
              media="(max-width: 1024px)" 
              srcSet="../assets/images/health/hero-bg-medium.webp 1024w, ../assets/images/health/hero-bg-medium.jpg 1024w" 
              type="image/webp" 
            />
            <source 
              srcSet="../assets/images/health/hero-bg-large.webp 1920w, ../assets/images/health/hero-bg-large.jpg 1920w" 
              type="image/webp" 
            />
            <img 
              src="../assets/images/health/hero-bg-large.jpg" 
              alt="Medical background" 
              className="w-full h-full object-cover opacity-30"
            />
          </picture>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div 
            className="space-y-8"
            style={{ transform: `translateY(${scrollY * 0.2}px)` }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Simplify Your
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
                Medicine Orders
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Connect patients and caregivers with physicians for seamless, recurring medicine prescriptions. 
              Healthcare made simple, secure, and accessible.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <span className="relative z-10 flex items-center gap-2">
                  Start Immediately
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <Shield className="w-5 h-5" />
                <span>Free during Beta • No charges</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-16 h-16 bg-indigo-200 rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute top-1/2 right-10 w-12 h-12 bg-purple-200 rounded-full opacity-50"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50/50"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        ></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Designed with patients, caregivers, and physicians in mind
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Clock className="w-8 h-8 text-blue-600" />,
                title: "Save Time",
                description: "Automate recurring prescriptions and reduce waiting times for essential medications."
              },
              {
                icon: <Shield className="w-8 h-8 text-indigo-600" />,
                title: "Secure & Safe",
                description: "HIPAA-compliant platform ensuring your medical information stays protected."
              },
              {
                icon: <Users className="w-8 h-8 text-purple-600" />,
                title: "Connected Care",
                description: "Seamless communication between patients, caregivers, and healthcare providers."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
                style={{ transform: `translateY(${scrollY * 0.05}px)` }}
              >
                <div className="mb-4 p-3 bg-gray-50 rounded-full w-fit group-hover:bg-blue-50 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50 relative overflow-hidden">
        <div 
          className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full opacity-20 -translate-y-48 translate-x-48"
          style={{ transform: `translate(${48 - scrollY * 0.1}px, ${-48 + scrollY * 0.1}px)` }}
        ></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">Simple steps to get your medications</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                { step: "01", title: "Create Account", desc: "Sign up as a patient or caregiver" },
                { step: "02", title: "Connect Physician", desc: "Link with your healthcare provider" },
                { step: "03", title: "Set Prescriptions", desc: "Configure recurring medication orders" },
                { step: "04", title: "Automatic Refills", desc: "Receive medications when needed" }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <picture>
                <source 
                  media="(max-width: 640px)" 
                  srcSet="../assets/images/health/process-illustration-small.webp 320w, ../assets/images/health/process-illustration-small.jpg 320w" 
                  type="image/webp" 
                />
                <source 
                  media="(max-width: 1024px)" 
                  srcSet="../assets/images/health/process-illustration-medium.webp 512w, ../assets/images/health/process-illustration-medium.jpg 512w" 
                  type="image/webp" 
                />
                <source 
                  srcSet="../assets/images/health/process-illustration-large.webp 768w, ../assets/images/health/process-illustration-large.jpg 768w" 
                  type="image/webp" 
                />
                <img 
                  src="../assets/images/health/process-illustration-large.jpg" 
                  alt="How our platform works" 
                  className="w-full h-auto rounded-2xl shadow-2xl"
                  style={{ transform: `translateY(${scrollY * 0.03}px)` }}
                />
              </picture>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
            <div className="flex justify-center items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
              <span className="ml-2 text-lg text-gray-600">4.9/5 from 2,847 reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Caregiver",
                content: "This platform has been a lifesaver for managing my mother's medications. No more missed refills!"
              },
              {
                name: "Dr. Michael Chen",
                role: "Primary Care Physician",
                content: "The seamless integration with my practice has improved patient care and reduced administrative burden."
              },
              {
                name: "Robert Martinez",
                role: "Patient",
                content: "Finally, a system that actually works. My chronic condition management has never been easier."
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                style={{ transform: `translateY(${scrollY * 0.02}px)` }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-black opacity-20"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        ></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Simplify Your Healthcare?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of patients and caregivers who trust our platform
          </p>
          
          <div className="space-y-4">
            <button className="bg-white text-blue-600 px-10 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 hover:bg-gray-50">
              Start Your Free Beta Access
            </button>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Free during beta period</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
