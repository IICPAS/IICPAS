import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const AccountingCoursesPage = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Accounting Courses
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Build a strong foundation in accounting principles and practices with our expert-led courses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Financial Accounting
              </h3>
              <p className="text-gray-600 mb-4">
                Learn the fundamentals of financial accounting, including journal entries, ledgers, and financial statements.
              </p>
              <div className="text-green-600 font-medium">Duration: 6 weeks</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Managerial Accounting
              </h3>
              <p className="text-gray-600 mb-4">
                Understand cost accounting, budgeting, and internal reporting for business decision-making.
              </p>
              <div className="text-green-600 font-medium">Duration: 8 weeks</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Advanced Accounting
              </h3>
              <p className="text-gray-600 mb-4">
                Master complex accounting topics including consolidations, partnerships, and international standards.
              </p>
              <div className="text-green-600 font-medium">Duration: 10 weeks</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AccountingCoursesPage;
