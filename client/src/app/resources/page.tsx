import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const StudyMaterialsPage = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Study Materials
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access comprehensive study materials, notes, and resources to excel in your finance and accounting journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Course Notes
              </h3>
              <p className="text-gray-600 mb-4">
                Detailed notes covering all major topics in finance, accounting, taxation, and auditing.
              </p>
              <div className="text-green-600 font-medium">Available for all courses</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Video Lectures
              </h3>
              <p className="text-gray-600 mb-4">
                High-quality video content with expert instructors explaining complex concepts.
              </p>
              <div className="text-green-600 font-medium">HD Quality Videos</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Practice Problems
              </h3>
              <p className="text-gray-600 mb-4">
                Extensive collection of practice problems with step-by-step solutions.
              </p>
              <div className="text-green-600 font-medium">1000+ Problems</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Reference Books
              </h3>
              <p className="text-gray-600 mb-4">
                Curated list of recommended textbooks and reference materials.
              </p>
              <div className="text-green-600 font-medium">Expert Recommended</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Case Studies
              </h3>
              <p className="text-gray-600 mb-4">
                Real-world case studies to apply theoretical knowledge in practical scenarios.
              </p>
              <div className="text-green-600 font-medium">Industry Cases</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Formula Sheets
              </h3>
              <p className="text-gray-600 mb-4">
                Quick reference guides with all important formulas and calculations.
              </p>
              <div className="text-green-600 font-medium">Quick Reference</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudyMaterialsPage;
