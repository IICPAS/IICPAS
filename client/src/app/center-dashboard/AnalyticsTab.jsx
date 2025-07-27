import React from "react";

export default function AnalyticsTab() {
  return (
    <main className="flex-1 px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-bold text-blue-700">
          Student Analytics Data
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-700 font-semibold">Filter by Date:</span>
          <span className="text-gray-700 ml-1">From</span>
          <input
            type="text"
            placeholder="dd/mm/yyyy"
            className="border px-2 py-1 rounded text-sm"
          />
          <span className="text-gray-700 ml-1">To:</span>
          <input
            type="text"
            placeholder="dd/mm/yyyy"
            className="border px-2 py-1 rounded text-sm"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded ml-2 font-semibold">
            Search
          </button>
          <span className="ml-3 font-bold text-blue-700 cursor-pointer">
            GNAAGBN
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded shadow border p-5 font-semibold text-lg">
          Average %Completion Percentage
        </div>
        <div className="bg-white rounded shadow border p-5 font-semibold text-lg">
          Average Learning Hours
        </div>
        <div className="bg-white rounded shadow border p-5 font-semibold text-lg">
          Average Test Percentage
        </div>
        <div className="bg-white rounded shadow border p-5 font-semibold text-lg">
          Average MCQ Performance %
        </div>
      </div>
      <div className="mt-6 text-2xl font-semibold text-gray-700">
        Filter by Date to get data.
      </div>
    </main>
  );
}
