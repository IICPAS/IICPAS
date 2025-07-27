import React from "react";

const MODULES = [
  { module: "Basic Accounting & Tally Foundation", hours: 30 },
  { module: "Microsoft Excel", hours: 20 },
  { module: "Payroll or Salary Statement", hours: 20 },
  { module: "Income Tax Computation", hours: 30 },
  { module: "TDS Computation", hours: 20 },
  { module: "GST Computation", hours: 22 },
  { module: "GST Return Filing", hours: 20 },
  { module: "Tally Advanced", hours: 25 },
  { module: "ITR Filing (Individual)", hours: 25 },
  { module: "TDS Return Filing", hours: 18 },
  { module: "PF & ESI Return Filing", hours: 20 },
  { module: "Business Taxation", hours: 18 },
  { module: "Financial Statements & MIS", hours: 25 },
];

export default function TrainingTab() {
  return (
    <main className="flex-1 px-8 py-6">
      {/* Notification Bars */}
      <div className="mb-4">
        <div className="bg-blue-100 text-blue-900 px-4 py-3 rounded mb-2 flex flex-wrap justify-between items-center">
          <div>
            You can now enable Live Class Notifications for the modules that you
            want to learn. You will receive an Email 30 minutes before the class
            starts.
            <br />
            <span className="font-semibold">
              Check the modules you want to receive notifications below.
            </span>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold text-sm ml-4 mt-2 lg:mt-0">
            View Current Schedule
          </button>
        </div>
        <div className="bg-yellow-100 text-yellow-900 px-4 py-3 rounded mb-2">
          All trainers must now complete their Viva with our master trainers to
          get certification from Fincurious. Please contact Pavan (8121644550)
          for more information.
        </div>
      </div>
      <div className="bg-white rounded shadow border p-5">
        <div className="text-3xl font-bold text-center mb-2">
          Faculty Training
        </div>
        <div className="text-center text-lg mb-6 font-medium">
          Test your skills in a particular course. These tests are mandatory for
          all faculties and should complete the test with 70% marks at least
          once.
        </div>
        <div className="flex justify-center gap-4 mb-6">
          <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded font-semibold border">
            View Test Results
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold">
            Training Video
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 font-semibold">Module</th>
                <th className="px-4 py-2 font-semibold">Hours</th>
                <th className="px-4 py-2 font-semibold">Videos</th>
                <th className="px-4 py-2 font-semibold">Answers</th>
                <th className="px-4 py-2 font-semibold">Take Test</th>
                <th className="px-4 py-2 font-semibold">Viva Status</th>
                <th className="px-4 py-2 font-semibold">
                  Live Class Notifications
                </th>
              </tr>
            </thead>
            <tbody>
              {MODULES.map((row, i) => (
                <tr key={i} className={i % 2 ? "bg-gray-50" : ""}>
                  <td className="px-4 py-2">{row.module}</td>
                  <td className="px-4 py-2 text-center">{row.hours}</td>
                  <td className="px-4 py-2 text-center">
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded font-semibold text-xs">
                      Videos
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded font-semibold text-xs">
                      Answers
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded font-semibold text-xs">
                      Take Test
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center">
                    {/* Checkbox for Viva Status (disabled as per screenshot) */}
                    <input
                      type="checkbox"
                      disabled
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    {/* Checkbox for Live Class Notifications (disabled as per screenshot) */}
                    <input
                      type="checkbox"
                      disabled
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
