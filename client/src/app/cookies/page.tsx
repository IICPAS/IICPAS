import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CookiePolicyPage = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-600">
              Last updated: January 2025
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Are Cookies?</h2>
              <p className="text-gray-600 leading-relaxed">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Cookies</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                IICPA Institute uses cookies to enhance your browsing experience and provide personalized services. We use cookies for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>To remember your login status and preferences</li>
                <li>To track your progress in courses</li>
                <li>To analyze website traffic and usage patterns</li>
                <li>To provide personalized content and recommendations</li>
                <li>To improve website functionality and performance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                  <p className="text-gray-600 leading-relaxed">
                    These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and remembering your login status. The website cannot function properly without these cookies.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Cookies</h3>
                  <p className="text-gray-600 leading-relaxed">
                    These cookies collect information about how visitors use our website, such as which pages are visited most often and if visitors get error messages. This helps us improve how our website works.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Functionality Cookies</h3>
                  <p className="text-gray-600 leading-relaxed">
                    These cookies allow the website to remember choices you make (such as your username, language, or region) and provide enhanced, more personal features.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Targeting/Advertising Cookies</h3>
                  <p className="text-gray-600 leading-relaxed">
                    These cookies are used to deliver advertisements more relevant to you and your interests. They may also be used to limit the number of times you see an advertisement and measure the effectiveness of advertising campaigns.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Cookies</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We may also use third-party cookies from trusted partners to provide additional services and analytics. These may include:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Google Analytics for website traffic analysis</li>
                <li>Social media platforms for sharing functionality</li>
                <li>Payment processors for secure transactions</li>
                <li>Video hosting services for course content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing Cookies</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You can control and manage cookies in various ways. Please note that removing or blocking cookies can impact your user experience and parts of our website may no longer be fully accessible.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Browser Settings</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Most browsers allow you to refuse cookies or delete them. You can usually find these settings in the options or preferences menu of your browser.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookie Consent</h3>
                  <p className="text-gray-600 leading-relaxed">
                    When you first visit our website, you'll see a cookie consent banner. You can choose to accept or decline non-essential cookies.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookie Retention</h2>
              <p className="text-gray-600 leading-relaxed">
                Different cookies have different retention periods. Session cookies are deleted when you close your browser, while persistent cookies remain on your device for a set period or until you delete them. We regularly review and update our cookie practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to This Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
                <br />
                Email: privacy@iicpa.com
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

export default CookiePolicyPage;
