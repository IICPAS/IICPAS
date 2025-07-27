import React from "react";

export default function PaymentsTab() {
  return (
    <main className="flex-1 px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-bold text-blue-700 flex items-center">
          Payments
          <i className="fa fa-share-alt ml-2 text-blue-600 cursor-pointer"></i>
        </div>
        <span className="font-bold text-blue-700 cursor-pointer">GNAAGBN</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded shadow border p-5">
          <div className="text-blue-600 font-semibold text-lg">
            Offline (This Month)
          </div>
          <div className="mt-3 font-bold text-2xl">0</div>
          <div className="mt-2 text-gray-700">Pending: 0</div>
          <div className="mt-2 text-gray-500 text-sm">Last month: 0</div>
          <div className="text-gray-500 text-sm">Last month Pending: 0</div>
        </div>
        <div className="bg-white rounded shadow border p-5 border-l-4 border-cyan-400">
          <div className="text-gray-600 font-semibold text-lg">
            Online (This Month)
          </div>
          <div className="mt-3 font-bold text-2xl">0</div>
          <div className="mt-2 text-gray-700">Pending: 0</div>
          <div className="mt-2 text-gray-500 text-sm">Last month: 0</div>
          <div className="text-gray-500 text-sm">Last month Pending: 0</div>
        </div>
        <div className="bg-white rounded shadow border p-5 border-l-4 border-green-400">
          <div className="text-green-600 font-semibold text-lg">
            OVERALL (THIS MONTH)
          </div>
          <div className="mt-3 font-bold text-2xl">0</div>
          <div className="mt-2 text-gray-700">Pending: 0</div>
          <div className="mt-2 text-gray-500 text-sm">Last month: 0</div>
          <div className="text-gray-500 text-sm">Last month Pending: 0</div>
        </div>
      </div>
      <div className="bg-white rounded shadow border mt-4">
        <div className="flex items-center gap-3 px-4 py-2 border-b">
          <button className="bg-gray-400 text-white px-3 py-1 rounded font-medium text-sm mr-1">
            Pending
          </button>
          <button className="bg-white border border-gray-400 text-gray-800 px-3 py-1 rounded font-medium text-sm mr-2">
            Paid
          </button>
          <button className="ml-auto flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-semibold">
            <i className="fa fa-file-excel"></i>Download Excel
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 font-semibold">Date</th>
                <th className="px-3 py-2 font-semibold">Name</th>
                <th className="px-3 py-2 font-semibold">Phone</th>
                <th className="px-3 py-2 font-semibold">Type</th>
                <th className="px-3 py-2 font-semibold">Reason</th>
                <th className="px-3 py-2 font-semibold">Sales</th>
                <th className="px-3 py-2 font-semibold">Amount</th>
                <th className="px-3 py-2 font-semibold">
                  <div className="flex items-center gap-1">
                    Confirm
                    <select className="ml-1 border rounded text-xs px-1 py-0.5">
                      <option value=""> </option>
                    </select>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>{/* Empty as per screenshot */}</tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
