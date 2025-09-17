import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutUs: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Back Button */}
      <div className="w-full px-4 md:px-8 pt-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>
      </div>

      {/* About Us Content */}
      <div className="w-full px-4 md:px-8 py-16">
        <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">About OBT.Clinic</h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Revolutionizing healthcare through innovative digital solutions that empower providers, patients, and institutions to deliver exceptional care.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-orange-400">Our Mission</h2>
            <p className="text-gray-300 text-lg mb-6">
              To transform healthcare delivery by providing comprehensive, secure, and user-friendly EMR solutions that enhance patient outcomes and streamline clinical workflows.
            </p>
            <p className="text-gray-300 text-lg">
              We believe that every healthcare provider deserves access to powerful tools that make their work more efficient and effective, ultimately leading to better patient care.
            </p>
          </div>
          <div className="bg-gray-900 p-8 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-orange-400">Key Values</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Patient-Centered Care
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Data Security & Privacy
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Innovation & Excellence
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Collaboration & Support
              </li>
            </ul>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8 text-orange-400">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                D
              </div>
              <h3 className="text-xl font-semibold mb-2">Dr. Sarah Johnson</h3>
              <p className="text-gray-400 mb-3">Chief Medical Officer</p>
              <p className="text-gray-300 text-sm">Board-certified cardiologist with 15+ years of clinical experience and expertise in healthcare technology.</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                M
              </div>
              <h3 className="text-xl font-semibold mb-2">Michael Chen</h3>
              <p className="text-gray-400 mb-3">Chief Technology Officer</p>
              <p className="text-gray-300 text-sm">Former Google engineer with expertise in healthcare data systems and secure cloud infrastructure.</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
              <h3 className="text-xl font-semibold mb-2">Dr. Amanda Rodriguez</h3>
              <p className="text-gray-400 mb-3">Head of Product</p>
              <p className="text-gray-300 text-sm">Healthcare administrator and product strategist focused on improving clinical workflows and patient experience.</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-900 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-orange-400">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-orange-400 mb-2">1.2M+</p>
              <p className="text-gray-300">Patients Served</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-orange-400 mb-2">500+</p>
              <p className="text-gray-300">Healthcare Facilities</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-orange-400 mb-2">99.99%</p>
              <p className="text-gray-300">Uptime</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-orange-400 mb-2">24/7</p>
              <p className="text-gray-300">Support Available</p>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-12 w-full">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center mb-4">
              <span className="text-orange-500 font-bold text-xl">OBT</span>
              <span className="ml-1 text-white text-xl">.Clinic</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">Digital healthcare platform to power modern clinics and patient care.</p>
            <div className="flex space-x-4">
              <span className="flex items-center text-green-400 text-sm bg-orange-900 py-1 px-3 rounded-full">
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Secure
              </span>
              <span className="flex items-center text-green-400 text-sm bg-orange-900 py-1 px-3 rounded-full">
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verified
              </span>
              <span className="flex items-center text-green-400 text-sm bg-orange-900 py-1 px-3 rounded-full">
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default AboutUs;