import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const InvestmentBankingCoursesPage = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Investment Banking Courses
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master the world of investment banking with our comprehensive courses covering capital markets and financial services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Capital Markets
              </h3>
              <p className="text-gray-600 mb-4">
                Learn about equity and debt markets, IPOs, secondary offerings, and market analysis.
              </p>
              <div className="text-green-600 font-medium">Duration: 10 weeks</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Mergers & Acquisitions
              </h3>
              <p className="text-gray-600 mb-4">
                Master M&A processes, valuation techniques, due diligence, and deal structuring.
              </p>
              <div className="text-green-600 font-medium">Duration: 12 weeks</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Financial Modeling
              </h3>
              <p className="text-gray-600 mb-4">
                Build advanced financial models for valuation, forecasting, and investment analysis.
              </p>
              <div className="text-green-600 font-medium">Duration: 8 weeks</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InvestmentBankingCoursesPage;
