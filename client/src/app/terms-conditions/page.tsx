"use client";

import Link from "next/link";
import Header from "../components/Header";

export default function TermsConditions() {
  return (
    <>
      <Header />
      <div className="mt-20 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Terms & Conditions
            </h1>
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing and using the IICPA Institute website and
                  services, you accept and agree to be bound by the terms and
                  provision of this agreement. If you do not agree to abide by
                  the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  2. Use License
                </h2>
                <div className="space-y-3">
                  <p>
                    Permission is granted to temporarily access the materials on
                    IICPA Institute&#39;s website for personal, non-commercial
                    transitory viewing only. This is the grant of a license, not
                    a transfer of title, and under this license you may not:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Modify or copy the materials</li>
                    <li>
                      Use the materials for any commercial purpose or for any
                      public display
                    </li>
                    <li>
                      Attempt to reverse engineer any software contained on the
                      website
                    </li>
                    <li>
                      Remove any copyright or other proprietary notations from
                      the materials
                    </li>
                    <li>
                      Transfer the materials to another person or
                      &ldquo;mirror&ldquo; the materials on any other server
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  3. Course Enrollment and Payment
                </h2>
                <div className="space-y-3">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Course fees must be paid in full before access is granted
                    </li>
                    <li>
                      All prices are subject to change without prior notice
                    </li>
                    <li>
                      Payment methods accepted include credit cards, debit
                      cards, and bank transfers
                    </li>
                    <li>
                      Course access is granted for the duration specified in the
                      course description
                    </li>
                    <li>
                      Sharing of course access credentials is strictly
                      prohibited
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  4. Student Conduct
                </h2>
                <div className="space-y-3">
                  <p>Students are expected to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Maintain respectful behavior in all interactions</li>
                    <li>
                      Not engage in any form of harassment or discrimination
                    </li>
                    <li>
                      Not share course materials with unauthorized individuals
                    </li>
                    <li>Complete assignments and assessments honestly</li>
                    <li>
                      Follow all technical requirements for online courses
                    </li>
                  </ul>
                  <p>
                    Violation of these conduct standards may result in immediate
                    termination of access without refund.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  5. Intellectual Property Rights
                </h2>
                <div className="space-y-3">
                  <p>
                    All content on this website, including but not limited to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Course materials, videos, and presentations</li>
                    <li>Text, graphics, and images</li>
                    <li>Software and applications</li>
                    <li>Logos and trademarks</li>
                  </ul>
                  <p>
                    Are the property of IICPA Institute and are protected by
                    copyright and other intellectual property laws.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  6. Privacy and Data Protection
                </h2>
                <p>
                  Your privacy is important to us. Please review our Privacy
                  Policy, which also governs your use of the website, to
                  understand our practices regarding the collection and use of
                  your personal information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  7. Disclaimers
                </h2>
                <div className="space-y-3">
                  <p>
                    The materials on IICPA Institute&lsquo;s website are
                    provided on an &lsquo;as is&lsquo; basis. IICPA Institute
                    makes no warranties, expressed or implied, and hereby
                    disclaims and negates all other warranties including without
                    limitation, implied warranties or conditions of
                    merchantability, fitness for a particular purpose, or
                    non-infringement of intellectual property or other violation
                    of rights.
                  </p>

                  <p>
                    Further, IICPA Institute does not warrant or make any
                    representations concerning the accuracy, likely results, or
                    reliability of the use of the materials on its website or
                    otherwise relating to such materials or on any sites linked
                    to this site.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  8. Limitations
                </h2>
                <p>
                  In no event shall IICPA Institute or its suppliers be liable
                  for any damages (including, without limitation, damages for
                  loss of data or profit, or due to business interruption)
                  arising out of the use or inability to use the materials on
                  IICPA Institute&lsquo;s website, even if IICPA Institute or an
                  authorized representative has been notified orally or in
                  writing of the possibility of such damage.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  9. Accuracy of Materials
                </h2>
                <p>
                  The materials appearing on IICPA Institute&lsquo;s website
                  could include technical, typographical, or photographic
                  errors. IICPA Institute does not warrant that any of the
                  materials on its website are accurate, complete, or current.
                  IICPA Institute may make changes to the materials contained on
                  its website at any time without notice.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  10. Links
                </h2>
                <p>
                  IICPA Institute has not reviewed all of the sites linked to
                  its website and is not responsible for the contents of any
                  such linked site. The inclusion of any link does not imply
                  endorsement by IICPA Institute of the site. Use of any such
                  linked website is at the user&#39;s own risk.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  11. Modifications
                </h2>
                <p>
                  IICPA Institute may revise these terms of service for its
                  website at any time without notice. By using this website, you
                  are agreeing to be bound by the then current version of these
                  Terms and Conditions of Use.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  12. Governing Law
                </h2>
                <p>
                  These terms and conditions are governed by and construed in
                  accordance with the laws of India and you irrevocably submit
                  to the exclusive jurisdiction of the courts in that state or
                  location.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  13. Contact Information
                </h2>
                <p>
                  If you have any questions about these Terms and Conditions,
                  please contact us at:
                </p>
                <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                  <p>
                    <strong>Email:</strong> legal@iicpa.in
                  </p>
                  <p>
                    <strong>Phone:</strong> +91 98765 43210
                  </p>
                  <p>
                    <strong>Address:</strong> IICPA Institute, Professional
                    Development Center, New Delhi, India
                  </p>
                </div>
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
