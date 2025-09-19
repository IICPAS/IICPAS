import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const FinanceCoursesPage = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Finance Courses
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master the fundamentals of finance with our comprehensive courses designed for aspiring financial professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Financial Analysis
              </h3>
              <p className="text-gray-600 mb-4">
                Learn to analyze financial statements, evaluate company performance, and make informed investment decisions.
              </p>
              <div className="text-green-600 font-medium">Duration: 8 weeks</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Corporate Finance
              </h3>
              <p className="text-gray-600 mb-4">
                Understand capital structure, working capital management, and corporate valuation techniques.
              </p>
              <div className="text-green-600 font-medium">Duration: 10 weeks</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Investment Management
              </h3>
              <p className="text-gray-600 mb-4">
                Master portfolio theory, risk management, and investment strategies for various asset classes.
              </p>
              <div className="text-green-600 font-medium">Duration: 12 weeks</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FinanceCoursesPage;
