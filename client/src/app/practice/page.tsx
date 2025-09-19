import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PracticeTestsPage = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Practice Tests
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Test your knowledge and prepare for exams with our comprehensive practice tests and mock exams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Mock Exams
              </h3>
              <p className="text-gray-600 mb-4">
                Full-length practice exams that simulate real test conditions and timing.
              </p>
              <div className="text-green-600 font-medium">Timed Tests</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Chapter-wise Tests
              </h3>
              <p className="text-gray-600 mb-4">
                Focused tests for each chapter to reinforce learning and identify weak areas.
              </p>
              <div className="text-green-600 font-medium">Topic-wise Practice</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Previous Year Papers
              </h3>
              <p className="text-gray-600 mb-4">
                Access to previous year question papers with detailed solutions and explanations.
              </p>
              <div className="text-green-600 font-medium">Real Exam Questions</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Quick Quizzes
              </h3>
              <p className="text-gray-600 mb-4">
                Short quizzes for quick revision and concept reinforcement.
              </p>
              <div className="text-green-600 font-medium">5-10 Questions</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Performance Analytics
              </h3>
              <p className="text-gray-600 mb-4">
                Detailed performance reports to track progress and identify improvement areas.
              </p>
              <div className="text-green-600 font-medium">Progress Tracking</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Adaptive Tests
              </h3>
              <p className="text-gray-600 mb-4">
                AI-powered adaptive tests that adjust difficulty based on your performance.
              </p>
              <div className="text-green-600 font-medium">Personalized Learning</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PracticeTestsPage;
