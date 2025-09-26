import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const TermsAndConditionsPage = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Terms & Conditions
            </h1>
            <p className="text-xl text-gray-600">
              Last updated: January 2025
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using IICPA Institute's website, services, and educational programs, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description of Service</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                IICPA Institute provides educational services including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Online and offline courses in accounting, finance, and related fields</li>
                <li>Certification programs and professional development courses</li>
                <li>Study materials, resources, and learning tools</li>
                <li>Assessment and examination services</li>
                <li>Career guidance and placement assistance</li>
                <li>Webinars, workshops, and training sessions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Registration and Accounts</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Creation</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To access certain features of our services, you must create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Security</h3>
                  <p className="text-gray-600 leading-relaxed mb-2">
                    You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Use a strong and unique password</li>
                    <li>Notify us immediately of any unauthorized use of your account</li>
                    <li>Log out from your account at the end of each session</li>
                    <li>Not share your account credentials with others</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Course Enrollment and Payment</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Enrollment Process</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Course enrollment is subject to availability and completion of the enrollment process, including payment of applicable fees. We reserve the right to refuse enrollment to any individual at our discretion.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Terms</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>All fees must be paid in full before course access is granted</li>
                    <li>Payment methods include credit cards, debit cards, bank transfers, and digital wallets</li>
                    <li>Prices are subject to change without prior notice</li>
                    <li>Late payment fees may apply for overdue amounts</li>
                    <li>All payments are non-refundable except as specified in our Refund Policy</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Course Access</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Course access is granted for the duration specified in the course description. Access may be extended at our discretion or for an additional fee. Sharing course access with others is strictly prohibited.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property Rights</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Content</h3>
                  <p className="text-gray-600 leading-relaxed">
                    All content, materials, and resources provided through our services, including but not limited to text, graphics, logos, images, audio, video, and software, are the property of IICPA Institute or its licensors and are protected by copyright and other intellectual property laws.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Permitted Use</h3>
                  <p className="text-gray-600 leading-relaxed mb-2">
                    You may use our content solely for personal, non-commercial educational purposes. You may not:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Copy, distribute, or reproduce any content without permission</li>
                    <li>Modify, adapt, or create derivative works</li>
                    <li>Use content for commercial purposes</li>
                    <li>Remove copyright or proprietary notices</li>
                    <li>Share login credentials or course access</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Conduct and Prohibited Activities</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You agree not to engage in any of the following prohibited activities:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Violating any applicable laws or regulations</li>
                <li>Infringing on intellectual property rights</li>
                <li>Transmitting harmful or malicious code</li>
                <li>Attempting to gain unauthorized access to our systems</li>
                <li>Interfering with the proper functioning of our services</li>
                <li>Harassing, abusing, or threatening other users or staff</li>
                <li>Posting false, misleading, or inappropriate content</li>
                <li>Using our services for any unlawful or prohibited purpose</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Certification and Assessment</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Certification Requirements</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Certification is awarded upon successful completion of course requirements, including passing assessments and examinations. We reserve the right to modify certification requirements and assessment criteria.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Academic Integrity</h3>
                  <p className="text-gray-600 leading-relaxed mb-2">
                    All students must maintain the highest standards of academic integrity. Violations include but are not limited to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Cheating on examinations or assessments</li>
                    <li>Plagiarism or unauthorized collaboration</li>
                    <li>Falsifying academic records</li>
                    <li>Using unauthorized materials during assessments</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Consequences of Violations</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Violations of academic integrity may result in immediate termination of enrollment, revocation of certificates, and permanent ban from our services.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy and Data Protection</h2>
              <p className="text-gray-600 leading-relaxed">
                Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our Privacy Policy, which is incorporated into these Terms and Conditions by reference.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                To the maximum extent permitted by law, IICPA Institute shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
              <p className="text-gray-600 leading-relaxed">
                We may terminate or suspend your account and access to our services immediately, without prior notice, for any reason, including but not limited to breach of these Terms and Conditions. Upon termination, your right to use our services will cease immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law and Dispute Resolution</h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or relating to these terms shall be subject to the exclusive jurisdiction of the courts in [City], India.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Modifications to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify these Terms and Conditions at any time. We will notify users of any material changes by posting the updated terms on our website. Your continued use of our services after such modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact us at:
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

export default TermsAndConditionsPage;