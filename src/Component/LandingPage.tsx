

import { useNavigate } from "react-router-dom";
import { useState } from "react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-black text-white font-sans m-0 p-0">
      {/* Navigation Bar */}
      <nav className="bg-black text-white p-4 relative">
        <div className="w-full flex items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-orange-500 font-bold text-xl">OBT</span>
            <span className="ml-1 text-white text-xl">.Clinic</span>
          </div>

          {/* Navigation Links and Button - inline for large, hidden for small */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors">Docs</a>
            <a href="#" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors">Pricing</a>
            <button onClick={() => navigate("/about-us")} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors">About Us</button>
            <button onClick={() => navigate("/learn-more")} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors">Learn More</button>
            <button onClick={() => navigate("/contact-us")} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors">Contact Us</button>
            <button onClick={() => navigate("/login")} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors" aria-label="Login to your account">LOGIN TO ACCOUNT</button>
            <button onClick={() => navigate("/start")} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-sm" aria-label="Go to start page">
              START CONSULTING
            </button>
          </div>

          {/* Hamburger button for small screens */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Dropdown for small screens */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} absolute top-full left-0 right-0 bg-black p-4 z-10`}>
          <div className="flex flex-col space-y-4">
            <a href="#" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors" onClick={() => setIsMenuOpen(false)}>Docs</a>
            <a href="#" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors" onClick={() => setIsMenuOpen(false)}>Pricing</a>
            <button onClick={() => { navigate("/about-us"); setIsMenuOpen(false); }} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors">About Us</button>
            <button onClick={() => { navigate("/learn-more"); setIsMenuOpen(false); }} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors">Learn More</button>
            <button onClick={() => { navigate("/contact-us"); setIsMenuOpen(false); }} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors">Contact Us</button>
            <button onClick={() => { navigate("/login"); setIsMenuOpen(false); }} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors" aria-label="Login to your account">LOGIN TO ACCOUNT</button>
            <button onClick={() => { navigate("/start"); setIsMenuOpen(false); }} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-sm" aria-label="Go to start page">
              START CONSULTING
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="w-full bg-gray-900 pt-8 pb-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section - Hero Content */}
          <div className="flex flex-col justify-center h-full">
            {/* Professional Medical Consultation Banner */}
            <div className="bg-orange-800 text-white py-1 px-3 inline-flex items-center rounded-md text-xs font-semibold mb-4 w-fit">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Professional medical consultation at your fingertips
            </div>

            <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Your trusted partner in digital healthcare solutions
            </h1>

            <p className="text-white/90 text-lg mb-6">
              Comprehensive EMR with multi-role access, appointments, diagnostics, EHR, analytics, workflows, and 24/7 support—built for providers, patients, and administrators.
            </p>

            <p className="text-white/90 text-lg mb-8">
              OBT.Clinic brings care delivery, records, and insights together. Experience seamless patient management with integrated lab results, prescription tracking, and real-time collaboration tools.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <button onClick={() => navigate("/start")} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-md text-base" aria-label="Go to start page">
                START CONSULTING
              </button>
              <button onClick={() => navigate("/login")} className="border border-orange-600 text-orange-600 hover:bg-orange-900 hover:text-white font-bold py-3 px-6 rounded-md text-base flex items-center justify-center" aria-label="Login to existing account">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                LOGIN TO ACCOUNT
              </button>
            </div>

            {/* Verification Icons */}
            <div className="flex flex-wrap gap-4 text-orange-300 text-sm">
              <div className="flex items-center bg-orange-900 py-2 px-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verified Providers
              </div>
              <div className="flex items-center bg-orange-900 py-2 px-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Secure by design
              </div>
              <div className="flex items-center bg-orange-900 py-2 px-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                24/7 Support
              </div>
            </div>
          </div>

          {/* Right Section - EMR Dashboard Preview and Stats */}
          <div className="flex flex-col h-full">
            <div className="bg-gray-800 flex-1 flex items-center justify-center rounded-lg mb-8">
              <div className="text-center mb-6">
                <h3 className="text-white text-xl font-semibold mb-2">EMR Dashboard Preview</h3>
                <p className="text-white/80 text-sm">Experience our intuitive interface designed for healthcare professionals</p>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="bg-gray-700 p-3 rounded-lg text-center">
                  <div className="w-8 h-8 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-300">Patient Records</p>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg text-center">
                  <div className="w-8 h-8 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-300">Appointments</p>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg text-center">
                  <div className="w-8 h-8 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-300">Analytics</p>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg text-center">
                  <div className="w-8 h-8 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-300">Messages</p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="flex flex-col sm:flex-row justify-around text-center space-y-4 sm:space-y-0">
              <div>
                <p className="text-3xl font-bold text-white">1.2M</p>
                <p className="text-white/70 text-sm">Patients managed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">99.99%</p>
                <p className="text-white/70 text-sm">Uptime</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">120+</p>
                <p className="text-white/70 text-sm">Clinics onboarded</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Everything you need to run modern care section */}
      <div className="w-full px-4 py-16 text-center">
        <h2 className="text-white text-3xl font-bold mb-4">Everything you need to run modern care</h2>
        <p className="text-white/80 text-lg mb-12">Built for providers, patients, institutions, and administrators.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: Multi-role access */}
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292V15a1 1 0 01-1 1H8a1 1 0 01-1-1v-4.354a4 4 0 112 0V15h2V9.646a4.002 4.002 0 01-2.001-2.001z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Multi-role access</h3>
            <p className="text-gray-400 text-sm">Providers, patients, admins, and staff with granular permissions.</p>
          </div>

          {/* Card 2: Appointments */}
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Appointments</h3>
            <p className="text-gray-400 text-sm">Smart scheduling, reminders, and waitlist management.</p>
          </div>

          {/* Card 3: Diagnostics */}
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M18 14H6M2 5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Diagnostics</h3>
            <p className="text-gray-400 text-sm">Orders, results, and imaging in one place.</p>
          </div>

          {/* Card 4: EHR */}
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">EHR</h3>
            <p className="text-gray-400 text-sm">Structured notes, templates, and medication lists.</p>
          </div>

          {/* Card 5: Analytics */}
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
            <p className="text-gray-400 text-sm">Operational insights and clinical quality metrics.</p>
          </div>

          {/* Card 6: Workflow */}
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Workflow</h3>
            <p className="text-gray-400 text-sm">Triage, tasks, and automations to keep care moving.</p>
          </div>

          {/* Card 7: Health promotion */}
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Health promotion</h3>
            <p className="text-gray-400 text-sm">Programs, education, and preventive care nudges.</p>
          </div>

          {/* Card 8: Communication */}
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Communication</h3>
            <p className="text-gray-400 text-sm">Secure messaging, telehealth, and broadcast updates.</p>
          </div>

          {/* Card 9: Lab Integration */}
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <h3 className="text-white text-xl font-semibold mb-2">Lab Integration</h3>
            <p className="text-white/80 text-sm">Seamless lab result management and automated follow-ups.</p>
          </div>
        </div>
      </div>

      {/* Designed for every role section */}
      <div className="w-full px-4 py-16">
        <h2 className="text-white text-3xl font-bold mb-8 text-center">Designed for every role</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Providers & Institutions */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h-4a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v11a2 2 0 01-2 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m-6-4h6" />
              </svg>
              Providers & Institutions
            </h3>
            <ul className="space-y-3 text-white/90">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Unified EHR with templates and order sets
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Queue, triage, and task management
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Integrated diagnostics and e-prescribing
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Billing exports and utilization analytics
              </li>
            </ul>
          </div>

          {/* Patients */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292V15a1 1 0 01-1 1H8a1 1 0 01-1-1v-4.354a4 4 0 112 0V15h2V9.646a4.002 4.002 0 01-2.001-2.001z" />
              </svg>
              Patients
            </h3>
            <ul className="space-y-3 text-white/90">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Book, reschedule, and track appointments
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Access health records and results securely
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Message care teams and join telehealth
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Reminders and health program enrollment
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Security & Compliance section */}
      <div className="w-full px-4 py-16">
        <h2 className="text-white text-3xl font-bold mb-8 text-center">Security & compliance</h2>
        <p className="text-white/80 text-lg mb-12 text-center">We use industry best practices to protect your data end-to-end.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Security Features */}
          <div className="flex flex-col items-center text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2zm0-12h.01M17 12H7a1 1 0 01-1-1V6a1 1 0 011-1h10a1 1 0 011 1v5a1 1 0 01-1 1z" />
            </svg>
            <p className="font-semibold text-lg">Encryption at rest & in transit</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p className="font-semibold text-lg">Role-based access control</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold text-lg">MFA & audit logs</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9A1.998 1.998 0 0110 20.9l-4.243-4.243m4.243 0L10 16.03l-4.243-4.243m4.243 0l-.001-.001M12 12v.01M12 12h.01M12 12l.001-.001M17 12h.01M12 12v.01M17 12v.01M17 12l.001-.001M12 17h.01" />
            </svg>
            <p className="font-semibold text-lg">Data residency options</p>
          </div>
        </div>

        {/* Compliance */}
        <div className="text-center">
          <h3 className="text-white text-xl font-semibold mb-4">Compliance</h3>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <span className="bg-gray-800 text-green-400 py-2 px-4 rounded-full text-sm font-medium">HIPAA-ready</span>
            <span className="bg-gray-800 text-green-400 py-2 px-4 rounded-full text-sm font-medium">GDPR</span>
            <span className="bg-gray-800 text-green-400 py-2 px-4 rounded-full text-sm font-medium">ISO 27001</span>
            <span className="bg-gray-800 text-green-400 py-2 px-4 rounded-full text-sm font-medium">SOC 2</span>
          </div>
          <p className="text-gray-400 text-sm">Independent assessments available on request.</p>
        </div>
      </div>

      {/* Testimonials section */}
      <div className="w-full px-4 py-16">
        <h2 className="text-white text-3xl font-bold mb-8 text-center">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                D
              </div>
              <div className="ml-4">
                <h4 className="font-semibold">Dr. Sarah Johnson</h4>
                <p className="text-gray-400 text-sm">Cardiologist</p>
              </div>
            </div>
            <p className="text-gray-300 italic">"OBT.Clinic has transformed our practice. The EMR system is intuitive and comprehensive, making patient care more efficient than ever."</p>
            <div className="flex text-orange-400 mt-4">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                N
              </div>
              <div className="ml-4">
                <h4 className="font-semibold">Nurse Emily Chen</h4>
                <p className="text-gray-400 text-sm">Emergency Department</p>
              </div>
            </div>
            <p className="text-gray-300 italic">"The workflow automation has saved us hours each day. Patient records are always up-to-date and easily accessible."</p>
            <div className="flex text-orange-400 mt-4">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                P
              </div>
              <div className="ml-4">
                <h4 className="font-semibold">Patient Michael Rodriguez</h4>
                <p className="text-gray-400 text-sm">Regular Patient</p>
              </div>
            </div>
            <p className="text-gray-300 italic">"Booking appointments and accessing my records has never been easier. The telehealth feature is a game-changer."</p>
            <div className="flex text-orange-400 mt-4">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="w-full px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center mb-4">
              <span className="text-orange-500 font-bold text-xl">OBT</span>
              <span className="ml-1 text-white text-xl">.Clinic</span>
            </div>
            <p className="text-white/70 text-sm mb-4">Digital healthcare platform to power modern clinics and patient care.</p>
            <div className="flex space-x-4">
              <span className="flex items-center text-green-400 text-sm bg-white/20 py-1 px-3 rounded-full border border-white/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Secure
              </span>
              <span className="flex items-center text-green-400 text-sm bg-white/20 py-1 px-3 rounded-full border border-white/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verified
              </span>
              <span className="flex items-center text-green-400 text-sm bg-white/20 py-1 px-3 rounded-full border border-white/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                24/7
              </span>
            </div>
          </div>
        </div>
      </footer>
                      </div>
                    );
                  };
                  
                  export default LandingPage;