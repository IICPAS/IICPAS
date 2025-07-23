// components/IndividualTrainingPanel.tsx
import React from "react";

const IndividualTrainingPanel: React.FC = () => {
  return (
    <section className="bg-white py-16 px-4 md:px-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Pane - Info */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Practical Individual Training
          </h2>
          <p className="text-gray-700 mb-4">
            Our individual training programs are designed for students, job
            seekers, and professionals who want personal guidance and hands-on
            practice to build real skills.
          </p>
          <ul className="list-disc text-gray-600 pl-5 space-y-2">
            <li>One-on-one mentorship from experienced trainers</li>
            <li>Customized training roadmap tailored to your goals</li>
            <li>Live projects and practical case studies</li>
            <li>Flexible schedules: weekdays or weekends</li>
            <li>Training in tech, design, marketing, business & more</li>
          </ul>
        </div>

        {/* Right Pane - Form */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Request Personal Training
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
                placeholder="e.g., React, UI/UX, Excel"
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
                placeholder="e.g., 10"
                min={1}
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
                placeholder="What would you like to focus on?"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default IndividualTrainingPanel;
