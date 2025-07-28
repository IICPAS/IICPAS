import React from "react";

export default function LeadsTab() {
  return (
    <main className="flex-1 px-8 py-6">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-bold text-blue-700">Leads</div>
        <div className="flex items-center gap-3">
          <button className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-semibold">
            <i className="fa fa-file-excel mr-2"></i>
          </button>
          <input type="file" className="border px-2 py-1 rounded text-sm" />
          <button className="bg-blue-100 border px-4 py-1 rounded font-semibold text-blue-700 ml-1">
            Upload
          </button>
          <span className="font-bold text-blue-700 ml-3 cursor-pointer">
            GNAAGBN
          </span>
        </div>
      </div>
      <div className="flex items-center mb-2">
        <span className="text-base font-semibold text-blue-700 mr-2">
          Active Leads: 0
        </span>
        <span className="text-blue-600 ml-1 cursor-pointer text-sm">
          (Show Closed)
        </span>
        <button className="ml-4 bg-blue-100 px-2 py-1 rounded text-blue-600 text-xs">
          +
        </button>
        <button className="ml-1 bg-red-100 px-2 py-1 rounded text-red-600 text-xs">
          <i className="fa fa-chart-bar"></i>
        </button>
        <button className="ml-1 bg-green-100 px-2 py-1 rounded text-green-600 text-xs">
          <i className="fa fa-download"></i>
        </button>
        <button className="ml-1 bg-blue-100 px-2 py-1 rounded text-blue-600 text-xs">
          <i className="fa fa-paper-plane"></i>
        </button>
      </div>
      <div
        className="overflow-x-auto bg-white rounded shadow border"
        style={{ minWidth: 900 }}
      >
        <table className="min-w-[1400px] text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-2 py-2 font-semibold">Source</th>
              <th className="px-2 py-2 font-semibold">Date</th>
              <th className="px-2 py-2 font-semibold">CallDate</th>
              <th className="px-2 py-2 font-semibold">Count</th>
              <th className="px-2 py-2 font-semibold">Name</th>
              <th className="px-2 py-2 font-semibold">Phone</th>
              <th className="px-2 py-2 font-semibold">Message</th>
              <th className="px-2 py-2 font-semibold">Location</th>
              <th className="px-2 py-2 font-semibold">Remark</th>
              <th className="px-2 py-2 font-semibold">
                <div className="flex items-center gap-1">
                  Lead Type
                  <select className="ml-1 border rounded text-xs px-1 py-0.5">
                    <option value=""> </option>
                  </select>
                </div>
              </th>
              <th className="px-2 py-2 font-semibold">
                <div className="flex items-center gap-1">
                  Status
                  <select className="ml-1 border rounded text-xs px-1 py-0.5">
                    <option value=""> </option>
                  </select>
                </div>
              </th>
              <th className="px-2 py-2 font-semibold">Final Fee (0)</th>
              <th className="px-2 py-2 font-semibold">Closure Date</th>
              <th className="px-2 py-2 font-semibold">FollowUp</th>
              <th className="px-2 py-2 font-semibold">Course</th>
              <th className="px-2 py-2 font-semibold">Time Slot</th>
              <th className="px-2 py-2 font-semibold">
                <div className="flex items-center gap-1">
                  Assigned
                  <select className="ml-1 border rounded text-xs px-1 py-0.5">
                    <option value=""> </option>
                  </select>
                </div>
              </th>
              <th className="px-2 py-2 font-semibold">Transfer</th>
              <th className="px-2 py-2 font-semibold">Send to Branch</th>
              <th className="px-2 py-2 font-semibold">Email ID</th>
              <th className="px-2 py-2 font-semibold">Send/Move</th>
              <th className="px-2 py-2 font-semibold">History</th>
            </tr>
          </thead>
          <tbody>{/* Empty, as per screenshot */}</tbody>
        </table>
      </div>
    </main>
  );
}
