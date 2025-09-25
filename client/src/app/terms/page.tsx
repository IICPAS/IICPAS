import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const TermsOfServicePage = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600">
              Last updated: January 2025
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using IICPA Institute's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Permission is granted to temporarily download one copy of the materials on IICPA Institute's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Course Enrollment and Access</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                When you enroll in a course, you are granted a non-exclusive, non-transferable license to access and view the course content for your personal, non-commercial use. You agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>share your login credentials with others</li>
                <li>record, download, or distribute course content</li>
                <li>use course materials for commercial purposes</li>
                <li>violate any intellectual property rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Payment Terms</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                All course fees are due at the time of enrollment. We accept various payment methods including credit cards, debit cards, and online banking. By making a payment, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>provide accurate payment information</li>
                <li>authorize us to charge the specified amount</li>
                <li>understand that all sales are final unless otherwise stated</li>
                <li>comply with our refund policy</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Refund Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We offer a 7-day money-back guarantee for all courses. Refund requests must be submitted within 7 days of enrollment and before completing more than 20% of the course content. Refunds will be processed within 5-7 business days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. User Conduct</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You agree to use our services in a manner that is lawful and respectful. You will not:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>violate any applicable laws or regulations</li>
                <li>infringe on the rights of others</li>
                <li>transmit harmful or malicious code</li>
                <li>engage in harassment or abusive behavior</li>
                <li>attempt to gain unauthorized access to our systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
              <p className="text-gray-600 leading-relaxed">
                All content, including but not limited to text, graphics, logos, images, audio clips, video, and software, is the property of IICPA Institute or its content suppliers and is protected by copyright and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Privacy Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the website, to understand our practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                In no event shall IICPA Institute or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on IICPA Institute's website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                IICPA Institute reserves the right to revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
                <br />
                Email: legal@iicpa.com
                <br />
                Phone: +91 98765 43210
                <br />
                Address: 123 Education Street, Learning City, LC 12345
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfServicePage;
