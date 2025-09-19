import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PartnersPage = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Our Partners
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We collaborate with leading organizations and institutions to provide the best education and career opportunities for our students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Industry Partners
              </h3>
              <p className="text-gray-600 mb-4">
                Leading companies that provide internships, placements, and real-world project opportunities.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Deloitte</li>
                <li>• PwC</li>
                <li>• KPMG</li>
                <li>• EY</li>
                <li>• Goldman Sachs</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Academic Partners
              </h3>
              <p className="text-gray-600 mb-4">
                Renowned universities and educational institutions that collaborate on curriculum development.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• IIM Ahmedabad</li>
                <li>• IIM Bangalore</li>
                <li>• Delhi University</li>
                <li>• Mumbai University</li>
                <li>• Symbiosis International</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Technology Partners
              </h3>
              <p className="text-gray-600 mb-4">
                Tech companies that provide cutting-edge tools and platforms for enhanced learning.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Microsoft</li>
                <li>• Google Cloud</li>
                <li>• AWS</li>
                <li>• Salesforce</li>
                <li>• Oracle</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Certification Partners
              </h3>
              <p className="text-gray-600 mb-4">
                Professional bodies that provide industry-recognized certifications and credentials.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• ICAI (Institute of Chartered Accountants)</li>
                <li>• ICSI (Institute of Company Secretaries)</li>
                <li>• CFA Institute</li>
                <li>• FRM (Financial Risk Manager)</li>
                <li>• CPA (Certified Public Accountant)</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Government Partners
              </h3>
              <p className="text-gray-600 mb-4">
                Government agencies and departments that support our educational initiatives.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Ministry of Education</li>
                <li>• AICTE (All India Council for Technical Education)</li>
                <li>• UGC (University Grants Commission)</li>
                <li>• NSDC (National Skill Development Corporation)</li>
                <li>• GST Council</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                International Partners
              </h3>
              <p className="text-gray-600 mb-4">
                Global organizations that provide international exposure and opportunities.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• ACCA (Association of Chartered Certified Accountants)</li>
                <li>• CIMA (Chartered Institute of Management Accountants)</li>
                <li>• CPA Australia</li>
                <li>• AICPA (American Institute of CPAs)</li>
                <li>• IFAC (International Federation of Accountants)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PartnersPage;
