import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SuccessStoriesPage = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how our students have transformed their careers and achieved their professional goals with IICPA Institute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">A</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ankit Sharma
                </h3>
                <p className="text-gray-600 mb-4">
                  "IICPA Institute helped me transition from a non-finance background to becoming a successful Financial Analyst at a leading MNC. The practical approach and industry-relevant curriculum made all the difference."
                </p>
                <div className="text-green-600 font-medium">Financial Analyst, Deloitte</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">P</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Priya Patel
                </h3>
                <p className="text-gray-600 mb-4">
                  "The comprehensive accounting course at IICPA Institute gave me the confidence to start my own CA practice. The mentorship and support from faculty was exceptional."
                </p>
                <div className="text-green-600 font-medium">Chartered Accountant, Self-employed</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">R</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Rajesh Kumar
                </h3>
                <p className="text-gray-600 mb-4">
                  "After completing the Investment Banking course, I secured a position at Goldman Sachs. The practical training and real-world case studies were invaluable."
                </p>
                <div className="text-green-600 font-medium">Investment Banking Associate, Goldman Sachs</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">S</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Sneha Gupta
                </h3>
                <p className="text-gray-600 mb-4">
                  "The GST course at IICPA Institute helped me become a GST consultant. The practical simulations and expert guidance made complex concepts easy to understand."
                </p>
                <div className="text-green-600 font-medium">GST Consultant, TaxPro Solutions</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">V</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Vikram Singh
                </h3>
                <p className="text-gray-600 mb-4">
                  "IICPA Institute's auditing course provided me with the skills needed to excel in my role as an Internal Auditor. The hands-on approach was perfect for practical learning."
                </p>
                <div className="text-green-600 font-medium">Internal Auditor, TCS</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">M</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Meera Joshi
                </h3>
                <p className="text-gray-600 mb-4">
                  "The career guidance and placement support at IICPA Institute helped me land my dream job as a Financial Controller. The personalized approach made all the difference."
                </p>
                <div className="text-green-600 font-medium">Financial Controller, Infosys</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SuccessStoriesPage;
