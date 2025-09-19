import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LiveSessionsPage = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Live Sessions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our interactive live sessions with industry experts and get real-time answers to your questions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Daily Q&A Sessions
              </h3>
              <p className="text-gray-600 mb-4">
                Join our daily Q&A sessions where you can ask questions and get immediate answers from our expert instructors.
              </p>
              <div className="text-green-600 font-medium">Daily at 7 PM IST</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Weekly Masterclasses
              </h3>
              <p className="text-gray-600 mb-4">
                Attend weekly masterclasses on advanced topics with industry leaders and subject matter experts.
              </p>
              <div className="text-green-600 font-medium">Every Saturday 10 AM IST</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Career Guidance Sessions
              </h3>
              <p className="text-gray-600 mb-4">
                Get personalized career guidance and counseling from experienced professionals in the finance industry.
              </p>
              <div className="text-green-600 font-medium">Every Sunday 3 PM IST</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Exam Preparation
              </h3>
              <p className="text-gray-600 mb-4">
                Special live sessions focused on exam preparation, tips, and strategies for various professional certifications.
              </p>
              <div className="text-green-600 font-medium">As per exam schedule</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Industry Updates
              </h3>
              <p className="text-gray-600 mb-4">
                Stay updated with the latest industry trends, regulatory changes, and market developments.
              </p>
              <div className="text-green-600 font-medium">Monthly sessions</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Guest Lectures
              </h3>
              <p className="text-gray-600 mb-4">
                Attend special guest lectures by industry veterans, successful professionals, and thought leaders.
              </p>
              <div className="text-green-600 font-medium">Bi-weekly sessions</div>
            </div>
          </div>

          <div className="mt-16 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              How to Join Live Sessions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Schedule</h3>
                <p className="text-gray-600">View our live session calendar and mark your preferred sessions.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔔</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Set Reminders</h3>
                <p className="text-gray-600">Get notifications before your scheduled live sessions begin.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💻</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Join Session</h3>
                <p className="text-gray-600">Click the join link and participate in interactive discussions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LiveSessionsPage;
