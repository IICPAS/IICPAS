import React from "react";

export default function DashboardTab() {
  return (
    <main className="flex-1 px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-2xl font-semibold">
          Dashboard
          <span className="bg-yellow-400 text-xs font-bold rounded px-2 ml-2">
            Urban
          </span>
          <i className="fas fa-share-alt ml-2 text-blue-600 cursor-pointer"></i>
        </div>
        <div className="font-bold text-blue-600 cursor-pointer">GNAAGBN</div>
      </div>

      {/* Alert */}
      <div className="bg-red-100 border border-red-200 text-red-900 rounded-lg px-6 py-4 my-6">
        Initial Kit Credits have almost expired! Please order within{" "}
        <span className="font-bold text-red-700">Nov 16 2024</span> to utilize
        the credits.
        <br />
        Available Credits to be used: <span className="font-bold">10000</span>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-lg shadow px-6 py-4 mb-6">
        <h2 className="font-bold text-xl mb-3">Tasks assigned by HO</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-[#f6f6fa]">
                <th className="py-2 px-3 border">Meeting Date</th>
                <th className="py-2 px-3 border">Assigned Task</th>
                <th className="py-2 px-3 border">Due Date</th>
                <th className="py-2 px-3 border">Remark</th>
                <th className="py-2 px-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Sep 17 2024",
                  "Important! Start your classes by tomorrow as per the agreement.",
                  "Nov 17 2024",
                ],
                [
                  "Sep 17 2024",
                  "Important! Order Kits by tomorrow to retain Kit credits.",
                  "Oct 18 2024",
                ],
                [
                  "Sep 17 2024",
                  "IMPORTANT: Reminder to add Faculty (5 days remaining)",
                  "Oct 18 2024",
                ],
                [
                  "Sep 17 2024",
                  "IMPORTANT: Reminder to add Counsellor (1 week remaining)",
                  "Oct 15 2024",
                ],
                [
                  "Sep 17 2024",
                  "Reminder to add Faculty (15 days remaining)",
                  "Oct 18 2024",
                ],
                [
                  "Sep 17 2024",
                  "Reminder to add Counsellor (20 days remaining)",
                  "Oct 18 2024",
                ],
              ].map(([date, task, due], idx) => (
                <tr key={idx}>
                  <td className="py-2 px-3 border">{date}</td>
                  <td className="py-2 px-3 border">{task}</td>
                  <td className="py-2 px-3 border">{due}</td>
                  <td className="py-2 px-3 border text-blue-600 underline cursor-pointer">
                    Add Remark
                  </td>
                  <td className="py-2 px-3 border text-center">
                    <span className="text-yellow-500 text-xl">✔️</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dashboard Cards/Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Students Card */}
        <div className="bg-white rounded-lg shadow px-5 py-4 flex flex-col">
          <div className="text-lg font-semibold text-gray-600">Students</div>
          <div className="text-3xl font-bold text-blue-700 mt-1">
            0{" "}
            <span className="text-base font-medium text-green-500 ml-1">
              Active
            </span>
          </div>
          <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold w-fit">
            View Students
          </button>
          <div className="mt-4 text-lg font-bold text-blue-700">
            Total Students Joined: 0
          </div>
        </div>

        {/* Students Chart */}
        <div className="bg-white rounded-lg shadow px-5 py-4">
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold text-blue-700">Students</div>
            <select className="border rounded px-2 py-1 text-sm">
              <option>Select Year</option>
            </select>
          </div>
          {/* Chart Placeholder */}
          <div className="h-32 flex items-center justify-center border rounded mt-2 bg-[#f9f9fa]" />
        </div>

        {/* Kits Card */}
        <div className="bg-white rounded-lg shadow px-5 py-4 flex flex-col">
          <div className="text-lg font-semibold text-gray-600">Kits</div>
          <div className="text-3xl font-bold text-purple-700 mt-1">0</div>
          <div className="text-sm text-red-600 font-semibold mt-1">
            Kit Stock Critically Low. Order immediately!
          </div>
          <button className="mt-3 bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold w-fit">
            Order Now
          </button>
          <div className="mt-2 text-sm text-gray-500">
            Credits Available: <span className="font-bold">10000</span>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Sale Distribution */}
        <div className="bg-white rounded-lg shadow px-5 py-4">
          <div className="text-lg font-semibold text-purple-700">
            Sale Distribution
          </div>
          <div className="h-32 flex items-center justify-center border rounded mt-2 bg-[#f9f9fa]" />
        </div>
        {/* Orders */}
        <div className="bg-white rounded-lg shadow px-5 py-4">
          <div className="text-lg font-semibold text-purple-700">Orders</div>
          <div className="flex gap-6 text-sm font-semibold mt-2">
            <span className="text-purple-600">Offline</span>
            <span className="text-blue-700">Online</span>
          </div>
          <div className="h-32 flex items-center justify-center border rounded mt-2 bg-[#f9f9fa]" />
        </div>
        {/* Leads */}
        <div className="bg-white rounded-lg shadow px-5 py-4 flex flex-col">
          <div className="text-lg font-semibold text-green-600">Leads</div>
          <div className="text-3xl font-bold text-green-600 mt-1">
            0{" "}
            <span className="text-base font-medium text-green-500 ml-1">
              Active
            </span>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Conversion rate is at <span className="font-bold">NaN %</span>
          </div>
          <div className="flex gap-2 mt-2">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold">
              View Leads
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-semibold">
              Report
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Total Generated this year: <span className="font-bold">0</span>
          </div>
        </div>
      </div>

      {/* Leads Chart */}
      <div className="bg-white rounded-lg shadow px-5 py-4 mt-4">
        <div className="text-lg font-semibold text-green-600">Leads</div>
        <div className="h-32 flex items-center justify-center border rounded mt-2 bg-[#f9f9fa]" />
      </div>
    </main>
  );
}
