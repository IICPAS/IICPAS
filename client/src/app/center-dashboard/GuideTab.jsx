import React from "react";

export default function GuideTab() {
  return (
    <main className="flex-1 px-8 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-3xl font-bold mt-2">Guides and Resources</div>
        <div className="text-gray-500 text-lg">
          A central place for all your documents, templates, and tools.
        </div>
      </div>
      <div className="max-w-6xl mx-auto">
        <div className="text-2xl font-semibold mb-2">
          Marketing & Creative Resources
        </div>
        <hr className="mb-6" />

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Student Brochure */}
          <div className="bg-white rounded-lg shadow border p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-file-alt text-2xl text-green-500"></i>
              <span className="font-bold text-base text-green-700">
                Student Brochure (All)
              </span>
            </div>
            <button className="mt-2 bg-blue-600 text-white rounded px-4 py-2 font-semibold w-fit">
              Download
            </button>
          </div>
          {/* Design Templates */}
          <div className="bg-white rounded-lg shadow border p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-palette text-2xl text-blue-500"></i>
              <span className="font-bold text-base">Design Templates</span>
            </div>
            <div className="flex gap-2 mt-auto">
              <button className="bg-blue-600 text-white rounded px-4 py-2 font-semibold">
                Download
              </button>
              <button className="bg-blue-100 text-blue-700 border border-blue-300 rounded px-3 py-2 font-medium">
                Extras
              </button>
            </div>
          </div>
          {/* Video Templates */}
          <div className="bg-white rounded-lg shadow border p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-video text-2xl text-blue-400"></i>
              <span className="font-bold text-base">Video Templates</span>
            </div>
            <button className="mt-auto bg-blue-100 text-blue-700 border border-blue-300 rounded px-4 py-2 font-semibold w-fit">
              View
            </button>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Digital Marketing Guide */}
          <div className="bg-white rounded-lg shadow border p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <i className="fas fa-bullhorn text-2xl text-blue-600"></i>
              <span className="font-bold text-base">
                Digital Marketing Guide
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-auto">
              <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded text-red-600 text-sm">
                <i className="fab fa-youtube"></i> Basic (Meta)
              </span>
              <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded text-red-600 text-sm">
                <i className="fab fa-youtube"></i> Advanced (Meta)
              </span>
              <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded text-blue-600 text-sm">
                <i className="fab fa-google"></i> Google Ads Guide
              </span>
            </div>
          </div>
          {/* Editing & Marketing Training */}
          <div className="bg-white rounded-lg shadow border p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <i className="fas fa-chalkboard-teacher text-2xl text-blue-500"></i>
              <span className="font-bold text-base">
                Editing & Marketing Training
              </span>
            </div>
            <button className="mt-auto border-2 border-red-400 text-red-500 rounded px-4 py-2 font-semibold w-fit flex items-center gap-2">
              <i className="fab fa-youtube text-lg" /> Watch on YouTube
            </button>
          </div>
          {/* Online Photo Editor */}
          <div className="bg-white rounded-lg shadow border p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-magic text-2xl text-blue-500"></i>
              <span className="font-bold text-base">Online Photo Editor</span>
            </div>
            <button className="mt-auto bg-blue-100 text-blue-700 border border-blue-300 rounded px-4 py-2 font-semibold w-fit">
              Start
            </button>
          </div>
        </div>

        {/* For Counsellors & Sales Teams */}
        <div className="text-2xl font-semibold mt-8 mb-2">
          For Counsellors & Sales Teams
        </div>
        <hr className="mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Admin Kit */}
          <div className="bg-white rounded-lg shadow border p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-toolbox text-2xl text-blue-600"></i>
              <span className="font-bold text-base">Admin Kit</span>
            </div>
            <button className="mt-auto bg-blue-100 text-blue-700 border border-blue-300 rounded px-4 py-2 font-semibold w-fit">
              View
            </button>
          </div>
          {/* Script for Counselling */}
          <div className="bg-white rounded-lg shadow border p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-scroll text-2xl text-blue-600"></i>
              <span className="font-bold text-base">
                Script for Counselling
              </span>
            </div>
            <button className="mt-auto bg-blue-100 text-blue-700 border border-blue-300 rounded px-4 py-2 font-semibold w-fit">
              View
            </button>
          </div>
          {/* Price List */}
          <div className="bg-white rounded-lg shadow border p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-2xl text-blue-600">₹</span>
              <span className="font-bold text-base">Price List</span>
            </div>
            <button className="mt-auto bg-blue-100 text-blue-700 border border-blue-300 rounded px-4 py-2 font-semibold w-fit">
              View
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Training Videos */}
          <div className="bg-white rounded-lg shadow border p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-film text-2xl text-blue-600"></i>
              <span className="font-bold text-base">Training Videos</span>
            </div>
            <button className="mt-auto bg-blue-100 text-blue-700 border border-blue-300 rounded px-4 py-2 font-semibold w-fit">
              Watch
            </button>
          </div>
          {/* Lead Conversion Chart */}
          <div className="bg-white rounded-lg shadow border p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-chart-line text-2xl text-blue-600"></i>
              <span className="font-bold text-base">Lead Conversion Chart</span>
            </div>
            <button className="mt-auto bg-blue-100 text-blue-700 border border-blue-300 rounded px-4 py-2 font-semibold w-fit">
              Visit
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
