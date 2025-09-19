import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const TaxationCoursesPage = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Taxation Courses
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master tax laws and regulations with our comprehensive taxation courses designed for professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Income Tax
              </h3>
              <p className="text-gray-600 mb-4">
                Learn income tax laws, deductions, exemptions, and filing procedures for individuals and businesses.
              </p>
              <div className="text-green-600 font-medium">Duration: 8 weeks</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                GST (Goods & Services Tax)
              </h3>
              <p className="text-gray-600 mb-4">
                Master GST concepts, registration, returns filing, and compliance requirements.
              </p>
              <div className="text-green-600 font-medium">Duration: 6 weeks</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Corporate Tax
              </h3>
              <p className="text-gray-600 mb-4">
                Understand corporate tax planning, transfer pricing, and international taxation.
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

export default TaxationCoursesPage;
