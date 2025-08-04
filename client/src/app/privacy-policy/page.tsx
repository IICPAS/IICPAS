"use client";

import Link from "next/link";
import Header from "../components/Header";

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <div className="pt-10 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
              Privacy Policy
            </h1>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  1. Information We Collect
                </h2>
                <p>
                  IICPA Institute (&ldquo;we,&quot; &ldquo;our,&ldquo; or
                  &ldquo;us&ldquo;) is committed to protecting your privacy.
                  This Privacy Policy explains how we collect, use, disclose,
                  and safeguard your information when you visit our website, use
                  our services, or interact with us.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  2. Personal Information
                </h2>
                <p>
                  We may collect personal information such as your name, email
                  address, phone number, and educational background when you:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Register for our courses</li>
                  <li>Contact us for information</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Participate in our surveys</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  3. How We Use Your Information
                </h2>
                <p>We use your information to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide educational services</li>
                  <li>Process course registrations</li>
                  <li>Send important updates</li>
                  <li>Improve our services</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  4. Cookies and Tracking
                </h2>
                <p>
                  We use cookies and similar technologies to enhance your
                  browsing experience, analyze website traffic, and personalize
                  content. You can control cookie settings through your browser
                  preferences.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  5. Data Security
                </h2>
                <p>
                  We implement appropriate security measures to protect your
                  personal information from unauthorized access, alteration, or
                  disclosure.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  6. Contact Us
                </h2>
                <p>
                  If you have any questions about this Privacy Policy or our
                  data practices, please contact us at:
                </p>
                <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                  <p>
                    <strong>Email:</strong> privacy@iicpa.in
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
          </div>
        </div>
      </div>
    </>
  );
}
