"use client";

import Link from "next/link";
import Header from "../components/Header";

export default function CancellationRefundPolicy() {
  return (
    <>
      <Header />
      <div className="mt-20 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Cancellation & Refund Policy
            </h1>
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  1. Overview
                </h2>
                <p>
                  IICPA Institute is committed to providing quality educational
                  services. This policy outlines our cancellation and refund
                  procedures for course enrollments, live sessions, and other
                  services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  2. Course Cancellation Policy
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Before Course Start
                    </h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        <strong>7+ days before:</strong> 100% refund
                      </li>
                      <li>
                        <strong>3-6 days before:</strong> 75% refund
                      </li>
                      <li>
                        <strong>1-2 days before:</strong> 50% refund
                      </li>
                      <li>
                        <strong>Same day:</strong> No refund
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      After Course Start
                    </h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        <strong>First week:</strong> 50% refund
                      </li>
                      <li>
                        <strong>Second week:</strong> 25% refund
                      </li>
                      <li>
                        <strong>After second week:</strong> No refund
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  3. Live Session Cancellation
                </h2>
                <div className="space-y-3">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>24+ hours notice:</strong> Full credit for
                      rescheduling
                    </li>
                    <li>
                      <strong>12-24 hours notice:</strong> 50% credit for
                      rescheduling
                    </li>
                    <li>
                      <strong>Less than 12 hours:</strong> No credit or refund
                    </li>
                    <li>
                      In case of technical issues on our end, full credit will
                      be provided
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  4. Refund Process
                </h2>
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-800">
                    How to Request a Refund
                  </h3>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Contact our support team via email or phone</li>
                    <li>
                      Provide your enrollment details and reason for
                      cancellation
                    </li>
                    <li>Submit any required documentation</li>
                    <li>Wait for approval (typically 2-3 business days)</li>
                  </ol>

                  <h3 className="text-lg font-medium text-gray-800">
                    Refund Timeline
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      <strong>Credit/Debit Cards:</strong> 5-10 business days
                    </li>
                    <li>
                      <strong>Bank Transfers:</strong> 3-5 business days
                    </li>
                    <li>
                      <strong>Digital Wallets:</strong> 1-3 business days
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  5. Non-Refundable Items
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Course materials and study guides</li>
                  <li>Certification exam fees</li>
                  <li>One-time setup or registration fees</li>
                  <li>Services already delivered or consumed</li>
                  <li>Gift cards or promotional credits</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  6. Special Circumstances
                </h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      Medical Emergencies
                    </h3>
                    <p>
                      Full refunds may be provided with valid medical
                      documentation.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      Technical Issues
                    </h3>
                    <p>
                      If we cannot provide the service due to technical
                      problems, full refunds will be issued.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      Course Cancellation by IICPA
                    </h3>
                    <p>
                      If we cancel a course, full refunds or course credits will
                      be provided.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  7. Course Transfer Policy
                </h2>
                <p>
                  Students may transfer to a different course or session within
                  30 days of enrollment, subject to availability and a 10%
                  transfer fee.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  8. Dispute Resolution
                </h2>
                <p>
                  If you disagree with a refund decision, you may appeal by
                  contacting our customer service team. All disputes will be
                  reviewed by our management team within 5 business days.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  9. Contact Information
                </h2>
                <p>
                  For cancellation and refund requests, please contact us at:
                </p>
                <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                  <p>
                    <strong>Email:</strong> refunds@iicpa.in
                  </p>
                  <p>
                    <strong>Phone:</strong> +91 98765 43210
                  </p>
                  <p>
                    <strong>Support Hours:</strong> Monday - Friday, 9:00 AM -
                    6:00 PM IST
                  </p>
                  <p>
                    <strong>Address:</strong> IICPA Institute, Professional
                    Development Center, New Delhi, India
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  10. Policy Updates
                </h2>
                <p>
                  This policy may be updated from time to time. Students will be
                  notified of any changes via email or through our website.
                  Continued use of our services constitutes acceptance of the
                  updated policy.
                </p>
              </section>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
