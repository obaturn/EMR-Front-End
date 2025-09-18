import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ContactUs: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

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

      {/* Contact Us Content */}
      <div className="w-full px-4 md:px-8 py-16">
        <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Have questions about OBT.Clinic? We're here to help. Reach out to our team for support, demos, or partnership opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div className="bg-gray-900 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-orange-400">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white"
                  placeholder="Your full name"
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white"
                  placeholder="your.email@example.com"
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white"
                >
                  <option value="">Select a subject</option>
                  <option value="support">Technical Support</option>
                  <option value="demo">Request a Demo</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="billing">Billing Question</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-gray-900 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-6 text-orange-400">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Email Support</h3>
                    <p className="text-gray-300">support@s10clinic.com</p>
                    <p className="text-gray-400 text-sm">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Phone Support</h3>
                    <p className="text-gray-300">+1 (555) 123-4567</p>
                    <p className="text-gray-400 text-sm">Mon-Fri 9AM-6PM EST</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-1.414.586H8a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-1.586a1.998 1.998 0 01-1.414-.586l-3.243-3.243z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Live Chat</h3>
                    <p className="text-gray-300">Available 24/7</p>
                    <p className="text-gray-400 text-sm">Instant support for urgent issues</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-orange-400">Office Hours</h3>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                Emergency support available 24/7 for existing clients.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-900 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-orange-400">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-orange-400">How do I get started?</h3>
              <p className="text-gray-300 text-sm mb-6">
                Simply click "START CONSULTING" to begin your free trial. Our onboarding team will guide you through the setup process.
              </p>

              <h3 className="text-lg font-semibold mb-3 text-orange-400">Is my data secure?</h3>
              <p className="text-gray-300 text-sm mb-6">
                Yes, we use industry-leading security measures including encryption, regular audits, and HIPAA compliance to protect your data.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-orange-400">What support do you offer?</h3>
              <p className="text-gray-300 text-sm mb-6">
                We provide 24/7 technical support, comprehensive documentation, and dedicated account managers for enterprise clients.
              </p>

              <h3 className="text-lg font-semibold mb-3 text-orange-400">Can I cancel anytime?</h3>
              <p className="text-gray-300 text-sm">
                Yes, you can cancel your subscription at any time. We offer flexible pricing with no long-term contracts.
              </p>
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

export default ContactUs;