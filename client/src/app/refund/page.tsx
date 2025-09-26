import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const RefundPolicyPage = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Refund Policy
            </h1>
            <p className="text-xl text-gray-600">Last updated: January 2025</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Overview
              </h2>
              <p className="text-gray-600 leading-relaxed">
                At IICPA Institute, we are committed to providing high-quality
                educational services. We understand that circumstances may arise
                where you need to request a refund. This policy outlines the
                terms and conditions under which refunds may be granted.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Refund Eligibility
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Full Refund (100%)
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-2">
                    You may be eligible for a full refund if:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>
                      You request a refund within 7 days of course enrollment
                    </li>
                    <li>
                      You have not accessed more than 20% of the course content
                    </li>
                    <li>
                      The course has not yet started (for scheduled courses)
                    </li>
                    <li>
                      Technical issues prevent you from accessing the course
                    </li>
                    <li>We cancel the course due to insufficient enrollment</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Partial Refund (50-80%)
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-2">
                    You may be eligible for a partial refund if:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>
                      You request a refund within 14 days of course enrollment
                    </li>
                    <li>You have accessed 20-50% of the course content</li>
                    <li>
                      You provide valid documentation for medical or emergency
                      circumstances
                    </li>
                    <li>
                      You experience technical difficulties that we cannot
                      resolve
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Refund
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-2">
                    Refunds will not be granted if:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>
                      You have accessed more than 50% of the course content
                    </li>
                    <li>More than 30 days have passed since enrollment</li>
                    <li>You have received a certificate of completion</li>
                    <li>You violate our terms of service</li>
                    <li>You request a refund for completed courses</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Refund Process
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Step 1: Submit Refund Request
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    To request a refund, please contact our support team at
                    refunds@iicpa.com with the following information:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4 mt-2">
                    <li>Your full name and email address</li>
                    <li>Course name and enrollment date</li>
                    <li>Reason for refund request</li>
                    <li>Supporting documentation (if applicable)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Step 2: Review Process
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our team will review your request within 3-5 business days.
                    We may contact you for additional information or
                    clarification.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Step 3: Refund Processing
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    If approved, your refund will be processed within 7-10
                    business days. The refund will be issued to the original
                    payment method used for the purchase.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Special Circumstances
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Medical Emergencies
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We understand that medical emergencies can occur. If you
                    provide valid medical documentation, we may consider
                    extending the refund period or offering alternative
                    solutions such as course extensions or transfers.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Technical Issues
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    If you experience persistent technical issues that prevent
                    you from accessing course content, we will work with you to
                    resolve the problem. If we cannot resolve the issue, a full
                    refund may be granted regardless of the time elapsed.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Course Quality Issues
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    If you believe the course content does not meet the
                    advertised quality or learning objectives, please contact us
                    immediately. We take quality concerns seriously and will
                    investigate all claims.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Refund Methods
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Refunds will be processed using the same payment method used for
                the original purchase:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>
                  <strong>Credit/Debit Cards:</strong> Refunds will appear on
                  your statement within 7-10 business days
                </li>
                <li>
                  <strong>Bank Transfers:</strong> Refunds will be processed
                  within 5-7 business days
                </li>
                <li>
                  <strong>Digital Wallets:</strong> Refunds will be credited to
                  your wallet within 3-5 business days
                </li>
                <li>
                  <strong>Cash Payments:</strong> Refunds will be processed via
                  bank transfer or check
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Course Transfers
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Instead of a refund, you may be eligible to transfer your
                enrollment to another course or defer your enrollment to a
                future session. Course transfers are subject to availability and
                may incur additional fees if the new course has a higher price.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Dispute Resolution
              </h2>
              <p className="text-gray-600 leading-relaxed">
                If you are not satisfied with our refund decision, you may
                request a review by our management team. All disputes will be
                handled fairly and in accordance with our terms of service and
                applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Policy Updates
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to update this refund policy at any time.
                Changes will be posted on our website with an updated "Last
                updated" date. Continued use of our services after changes
                constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              <p className="text-gray-600 leading-relaxed">
                For refund requests or questions about this policy, please
                contact us at:
                <br />
                Email: refunds@iicpa.com
                <br />
                Phone: +91 98765 43210
                <br />
                Address: 123 Education Street, Learning City, LC 12345
                <br />
                <br />
                <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00
                PM (IST)
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RefundPolicyPage;
