import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const AuditingCoursesPage = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Auditing Courses
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Develop expertise in auditing standards, procedures, and best practices with our comprehensive courses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                External Auditing
              </h3>
              <p className="text-gray-600 mb-4">
                Learn external audit procedures, risk assessment, and audit reporting standards.
              </p>
              <div className="text-green-600 font-medium">Duration: 8 weeks</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Internal Auditing
              </h3>
              <p className="text-gray-600 mb-4">
                Master internal audit processes, control testing, and compliance monitoring.
              </p>
              <div className="text-green-600 font-medium">Duration: 6 weeks</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Forensic Auditing
              </h3>
              <p className="text-gray-600 mb-4">
                Specialize in fraud detection, investigation techniques, and forensic accounting methods.
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

export default AuditingCoursesPage;
