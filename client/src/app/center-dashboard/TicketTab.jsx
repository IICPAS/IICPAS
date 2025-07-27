import React from "react";

export default function TicketTab() {
  return (
    <main className="flex-1 px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-bold text-blue-700 flex items-center">
          Tickets{" "}
          <i className="fa fa-share-alt ml-2 text-blue-600 cursor-pointer"></i>
        </div>
        <div className="flex items-center gap-2">
          <select className="border rounded px-3 py-1 text-sm outline-none">
            <option>Select Type</option>
          </select>
          <button className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold text-sm">
            Closed Ticket
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold text-sm">
            Create Ticket
          </button>
          <span className="font-bold text-blue-700 cursor-pointer">
            GNAAGBN
          </span>
        </div>
      </div>
      <div className="bg-white rounded shadow border p-6">
        <div className="text-lg font-bold mb-2">Tickets Raised by you:</div>
        <div className="text-gray-800 text-base">
          There are no tickets created yet
        </div>
      </div>
    </main>
  );
}
