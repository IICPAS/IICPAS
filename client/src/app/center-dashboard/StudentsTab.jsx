import React from "react";

export default function StudentsTab() {
  return (
    <main className="flex-1 px-8 py-6">
      {/* Topbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-bold text-blue-700">
          Students
          <span className="text-black font-normal text-lg align-top ml-1">
            [Ctrl+F to search]
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold">
            <i className="fa fa-file-excel mr-2"></i>Download Excel
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold">
            Add Student
          </button>
          <span className="text-gray-700 text-base ml-2">Old Students</span>
          <span className="ml-3 font-bold text-blue-700 cursor-pointer">
            GNAAGBN
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 font-semibold">Name</th>
              <th className="px-4 py-2 font-semibold">Phone</th>
              <th className="px-4 py-2 font-semibold">Email ID</th>
              <th className="px-4 py-2 font-semibold">Modules</th>
              <th className="px-2 py-2 font-semibold">
                <div className="flex items-center gap-1">
                  Status
                  <select className="ml-1 border rounded text-xs px-1 py-0.5">
                    <option value=""> </option>
                  </select>
                </div>
              </th>
              <th className="px-2 py-2 font-semibold">Fees</th>
              <th className="px-2 py-2 font-semibold">
                <div className="flex items-center gap-1">
                  Job
                  <select className="ml-1 border rounded text-xs px-1 py-0.5">
                    <option value=""> </option>
                  </select>
                </div>
              </th>
              <th className="px-2 py-2 font-semibold">
                <div className="flex items-center gap-1">
                  Type
                  <select className="ml-1 border rounded text-xs px-1 py-0.5">
                    <option value=""> </option>
                  </select>
                </div>
              </th>
              <th className="px-2 py-2 font-semibold">Hold Access</th>
            </tr>
          </thead>
          <tbody>{/* No rows, as per your screenshot */}</tbody>
        </table>
      </div>
    </main>
  );
}
