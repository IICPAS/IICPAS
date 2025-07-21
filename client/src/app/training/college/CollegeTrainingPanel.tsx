// components/CollegeTrainingPanel.tsx
import React from "react";

const CollegeTrainingPanel: React.FC = () => {
  return (
    <section className="bg-white py-16 px-4 md:px-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Pane: Info */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            College Training Programs
          </h2>
          <p className="text-gray-700 mb-4">
            Our college-focused training programs are designed to prepare
            students for the dynamic demands of the corporate world. We blend
            technical skills with soft skills to ensure holistic development.
          </p>
          <ul className="list-disc text-gray-600 pl-5 space-y-2">
            <li>Industry-aligned and future-ready curriculum</li>
            <li>Hands-on training with real-world projects</li>
            <li>Placement preparation & interview coaching</li>
            <li>Delivered in-person, online, or hybrid formats</li>
            <li>Workshops on communication, teamwork, and leadership</li>
          </ul>
        </div>

        {/* Right Pane: Form */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Request a Training Program
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
                placeholder="e.g., Digital Marketing"
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
                placeholder="e.g., 5"
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
                placeholder="Tell us more about your training needs..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CollegeTrainingPanel;
