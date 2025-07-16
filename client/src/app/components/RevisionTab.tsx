"use client";

import { FaPlay } from "react-icons/fa";

export default function RevisionTab() {
  return (
    <div className="bg-white min-h-screen px-6 py-12 text-gray-800">
      <div className="max-w-3xl mx-auto text-center">
        {/* Header CTA */}
        <div className="bg-blue-100 border border-blue-400 rounded-xl p-6 shadow-md mb-10">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">
            Upgrade your Soft Skills!
          </h2>
          <div className="flex items-center justify-center space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-blue-700 transition-all">
              <FaPlay className="text-sm" />
              <span>Watch our Videos on Skill Development</span>
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-6 text-lg">
          Choose a topic and take tests. <em>Measure</em> your skills and get
          detailed information on improving your skills.
        </p>

        {/* Loading Spinner (can be replaced with list of topics) */}
        <div className="flex justify-center mt-10">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
