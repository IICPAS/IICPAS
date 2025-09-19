import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const HelpCenterPage = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Help Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to your questions and get the support you need to make the most of your learning journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Getting Started
              </h3>
              <p className="text-gray-600 mb-4">
                New to IICPA Institute? Learn how to get started with your courses and make the most of our platform.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• How to enroll in courses</li>
                <li>• Setting up your profile</li>
                <li>• Accessing study materials</li>
                <li>• Understanding the dashboard</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Course Support
              </h3>
              <p className="text-gray-600 mb-4">
                Need help with your courses? Find solutions to common course-related questions and issues.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Video playback issues</li>
                <li>• Downloading materials</li>
                <li>• Assignment submissions</li>
                <li>• Exam scheduling</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Technical Support
              </h3>
              <p className="text-gray-600 mb-4">
                Experiencing technical difficulties? Get help with platform issues and troubleshooting.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Login problems</li>
                <li>• Browser compatibility</li>
                <li>• Mobile app issues</li>
                <li>• Performance optimization</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Payment & Billing
              </h3>
              <p className="text-gray-600 mb-4">
                Questions about payments, refunds, or billing? Find answers to all payment-related queries.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Payment methods</li>
                <li>• Refund policy</li>
                <li>• Invoice generation</li>
                <li>• Payment failures</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Career Services
              </h3>
              <p className="text-gray-600 mb-4">
                Get support with career guidance, job placement, and professional development services.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Resume building</li>
                <li>• Interview preparation</li>
                <li>• Job placement</li>
                <li>• Career counseling</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Contact Support
              </h3>
              <p className="text-gray-600 mb-4">
                Still need help? Reach out to our support team through various channels.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Live chat support</li>
                <li>• Email support</li>
                <li>• Phone support</li>
                <li>• Ticket system</li>
              </ul>
            </div>
          </div>

          <div className="mt-16 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Contact Our Support Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📞</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
                <p className="text-gray-600 mb-2">Mon-Fri: 9 AM - 6 PM</p>
                <p className="text-green-600 font-medium">+91 98765 43210</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✉️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
                <p className="text-gray-600 mb-2">24/7 Response</p>
                <p className="text-green-600 font-medium">support@iicpa.com</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-2">Mon-Fri: 9 AM - 6 PM</p>
                <p className="text-green-600 font-medium">Available on website</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HelpCenterPage;
