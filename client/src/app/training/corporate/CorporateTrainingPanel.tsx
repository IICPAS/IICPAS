// components/CorporateTrainingPanel.tsx
import React from "react";

const CorporateTrainingPanel: React.FC = () => {
  return (
    <section className="bg-white py-16 px-4 md:px-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Pane */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Corporate Training
          </h2>
          <p className="text-gray-700 mb-4">
            We offer practical, outcome-driven corporate training programs for
            college students to help them gain industry-level exposure. Our
            sessions are tailored to complement academic learning with
            real-world skills.
          </p>
          <ul className="list-disc text-gray-600 pl-5 space-y-2">
            <li>Customized curriculum aligned with industry trends</li>
            <li>Hands-on workshops and live projects</li>
            <li>Communication, leadership & problem-solving skills</li>
            <li>Delivered online, offline, or hybrid</li>
            <li>Pre-placement training and mock interviews</li>
          </ul>
        </div>

        {/* Right Pane - Form */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Request Corporate Training
          </h3>
          <form className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="topic"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Training Topic
              </label>
              <input
                type="text"
                id="topic"
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="e.g., Web Development"
                required
              />
            </div>
            <div>
              <label
                htmlFor="hours"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Duration (Hours)
              </label>
              <input
                type="number"
                id="hours"
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="e.g., 6"
                min="1"
                required
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Tell us more about your training needs"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CorporateTrainingPanel;
