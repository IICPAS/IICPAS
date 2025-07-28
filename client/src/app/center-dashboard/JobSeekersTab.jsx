import React from "react";

export default function JobSeekersTab() {
  return (
    <main className="flex-1 px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-bold text-blue-700">
          Placed Students
          <span className="text-black font-normal text-lg align-top ml-1">
            [Submit and get 200 Credits]
          </span>
        </div>
        <span className="font-bold text-blue-700 cursor-pointer">
          <i className="fa fa-file-excel"></i> GNAAGBN
        </span>
      </div>
      <div className="bg-white rounded shadow border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 font-semibold">Name</th>
              <th className="px-4 py-2 font-semibold">Phone</th>
              <th className="px-4 py-2 font-semibold">Email ID</th>
              <th className="px-4 py-2 font-semibold">CV</th>
              <th className="px-4 py-2 font-semibold">Remarks</th>
              <th className="px-4 py-2 font-semibold">Follow up</th>
              <th className="px-4 py-2 font-semibold">Status</th>
              <th className="px-4 py-2 font-semibold">Mark Placed</th>
            </tr>
          </thead>
          <tbody>{/* Empty */}</tbody>
        </table>
      </div>
    </main>
  );
}
