import React from "react";

export default function KitsTab() {
  return (
    <main className="flex-1 px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-bold text-blue-700 flex items-center">
          Kit Stock{" "}
          <i className="fa fa-share-alt ml-2 text-blue-600 cursor-pointer"></i>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold text-sm">
            Order New
          </button>
          <button className="bg-white border border-blue-600 text-blue-700 px-4 py-2 rounded font-semibold text-sm">
            Order History
          </button>
          <span className="font-bold text-blue-700 cursor-pointer">
            GNAAGBN
          </span>
        </div>
      </div>
      <div className="bg-white rounded shadow border p-5">
        <div className="text-lg font-semibold mb-4">Available Stocks</div>
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 font-semibold">Modules</th>
                <th className="px-4 py-2 font-semibold">Lab (Classroom)</th>
                <th className="px-4 py-2 font-semibold">Recorded</th>
                <th className="px-4 py-2 font-semibold">LabPlus (Live)</th>
              </tr>
            </thead>
            <tbody>
              {[
                "Basic Accounting & Tally Foundation",
                "Microsoft Excel",
                "Payroll or Salary Statement",
                "Income Tax Computation",
                "TDS Computation",
                "GST Computation",
                "GST Return Filing",
                "Tally Advanced",
                "ITR Filing (Individual)",
                "TDS Return Filing",
                "PF & ESI Return Filing",
                "Business Taxation",
                "Financial Statements & MIS",
              ].map((module, i) => (
                <tr key={i} className={i % 2 ? "bg-gray-50" : ""}>
                  <td className="px-4 py-2">{module}</td>
                  <td className="px-4 py-2">0</td>
                  <td className="px-4 py-2">0</td>
                  <td className="px-4 py-2">0</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
