import React from 'react';
import { useNavigate } from 'react-router-dom';

const LearnMore: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Learn More Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Learn More About OBT.Clinic</h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Discover how our comprehensive EMR platform can transform your healthcare practice with advanced features and seamless integration.
          </p>
        </div>

        {/* Features Deep Dive */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-orange-400">Platform Features</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-gray-900 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292V15a1 1 0 01-1 1H8a1 1 0 01-1-1v-4.354a4 4 0 112 0V15h2V9.646a4.002 4.002 0 01-2.001-2.001z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Multi-Role Access Control</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Granular permissions system supporting administrators, doctors, nurses, pharmacists, and patients with role-specific access levels.
                </p>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li>• Customizable user roles and permissions</li>
                  <li>• HIPAA-compliant access logging</li>
                  <li>• Single sign-on integration</li>
                  <li>• Automated permission management</li>
                </ul>
              </div>

              <div className="bg-gray-900 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Smart Appointment System</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Intelligent scheduling with automated reminders, waitlist management, and conflict resolution.
                </p>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li>• Automated appointment reminders</li>
                  <li>• Waitlist and rescheduling features</li>
                  <li>• Calendar integration</li>
                  <li>• Patient no-show tracking</li>
                </ul>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gray-900 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Advanced Analytics</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Comprehensive reporting and analytics to track performance, patient outcomes, and operational efficiency.
                </p>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li>• Real-time performance dashboards</li>
                  <li>• Patient outcome tracking</li>
                  <li>• Revenue cycle analytics</li>
                  <li>• Custom report generation</li>
                </ul>
              </div>

              <div className="bg-gray-900 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Secure Communication</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  HIPAA-compliant messaging system for secure communication between healthcare providers and patients.
                </p>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li>• End-to-end encrypted messaging</li>
                  <li>• Telehealth integration</li>
                  <li>• Automated notifications</li>
                  <li>• Multi-channel communication</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="bg-gray-900 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-orange-400">Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-orange-400">Security</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• AES-256 encryption</li>
                <li>• Multi-factor authentication</li>
                <li>• SOC 2 Type II compliance</li>
                <li>• Regular security audits</li>
              </ul>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-orange-400">Performance</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• 99.99% uptime SLA</li>
                <li>• Global CDN</li>
                <li>• Auto-scaling infrastructure</li>
                <li>• Real-time data sync</li>
              </ul>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-orange-400">Integration</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• RESTful APIs</li>
                <li>• HL7 FHIR support</li>
                <li>• Third-party integrations</li>
                <li>• Custom webhooks</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-orange-400">Ready to Get Started?</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare providers who trust OBT.Clinic to power their digital transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/start")} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg text-lg">
              Start Your Free Trial
            </button>
            <button onClick={() => navigate("/login")} className="border border-orange-600 text-orange-600 hover:bg-orange-900 hover:text-white font-bold py-3 px-8 rounded-lg text-lg">
              Login to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
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

export default LearnMore;