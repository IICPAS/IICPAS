import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CareerGuidancePage = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Career Guidance
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get expert career guidance and counseling to make informed decisions about your professional future in finance and accounting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Career Counseling
              </h3>
              <p className="text-gray-600 mb-4">
                One-on-one sessions with experienced career counselors to help you choose the right path.
              </p>
              <div className="text-green-600 font-medium">Personalized Guidance</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Industry Insights
              </h3>
              <p className="text-gray-600 mb-4">
                Stay updated with the latest trends, opportunities, and requirements in the finance industry.
              </p>
              <div className="text-green-600 font-medium">Market Updates</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Resume Building
              </h3>
              <p className="text-gray-600 mb-4">
                Professional resume writing services and interview preparation to land your dream job.
              </p>
              <div className="text-green-600 font-medium">Professional Support</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Skill Assessment
              </h3>
              <p className="text-gray-600 mb-4">
                Comprehensive skill assessments to identify your strengths and areas for improvement.
              </p>
              <div className="text-green-600 font-medium">Detailed Analysis</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Networking Opportunities
              </h3>
              <p className="text-gray-600 mb-4">
                Connect with industry professionals and alumni through our networking events and platforms.
              </p>
              <div className="text-green-600 font-medium">Industry Connections</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Job Placement Support
              </h3>
              <p className="text-gray-600 mb-4">
                Dedicated placement support with job matching, interview scheduling, and follow-up assistance.
              </p>
              <div className="text-green-600 font-medium">End-to-End Support</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CareerGuidancePage;
