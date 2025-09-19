import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const FAQPage = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to the most common questions about our courses, services, and platform.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How do I enroll in a course?
              </h3>
              <p className="text-gray-600">
                You can enroll in any course by browsing our course catalog, selecting your desired course, and clicking the "Enroll Now" button. You'll be redirected to the payment page where you can complete your enrollment.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, debit cards, net banking, UPI, and digital wallets. We also offer EMI options for select courses to make education more accessible.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I access course materials offline?
              </h3>
              <p className="text-gray-600">
                Yes, you can download course materials including PDFs, notes, and some video content for offline access. However, live sessions and interactive content require an internet connection.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What is your refund policy?
              </h3>
              <p className="text-gray-600">
                We offer a 7-day money-back guarantee for all courses. If you're not satisfied with the course content within the first 7 days, you can request a full refund.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Do you provide certificates upon completion?
              </h3>
              <p className="text-gray-600">
                Yes, we provide industry-recognized certificates upon successful completion of courses. These certificates can be verified online and are valuable for your professional profile.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How long do I have access to course materials?
              </h3>
              <p className="text-gray-600">
                You have lifetime access to course materials once enrolled. This includes all videos, notes, practice tests, and updates to the course content.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I get help with job placement?
              </h3>
              <p className="text-gray-600">
                Yes, we provide comprehensive placement support including resume building, interview preparation, job matching, and direct connections with our industry partners.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Are there any prerequisites for courses?
              </h3>
              <p className="text-gray-600">
                Most of our courses are designed for beginners, but some advanced courses may have prerequisites. Check the course description for specific requirements.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How do I contact support?
              </h3>
              <p className="text-gray-600">
                You can contact our support team through live chat, email (support@iicpa.com), or phone (+91 98765 43210). We're available Monday to Friday, 9 AM to 6 PM.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Do you offer group discounts?
              </h3>
              <p className="text-gray-600">
                Yes, we offer special discounts for group enrollments (5+ students) and corporate training programs. Contact our sales team for customized pricing.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQPage;
