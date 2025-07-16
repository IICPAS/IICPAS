"use client";
import { useState } from "react";

export default function TicketTab() {
  const [tickets, setTickets] = useState([]);
  const [viewClosed, setViewClosed] = useState(false);

  return (
    <div className="p-6 w-full text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Support</h2>
        <div className="flex gap-2">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Create New Ticket
          </button>
          <button
            onClick={() => setViewClosed(!viewClosed)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            {viewClosed ? "Open Tickets" : "Closed Tickets"}
          </button>
          <select className="bg-white text-black px-3 py-2 rounded">
            <option value="">Filter</option>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center text-gray-300 mt-20 text-lg">
          There are no {viewClosed ? "closed" : "open"} tickets.
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 rounded-lg border border-gray-600"
            >
              <h3 className="text-lg font-semibold">{ticket.subject}</h3>
              <p className="text-sm text-gray-300">{ticket.description}</p>
              <p className="text-xs text-gray-400 mt-2">
                Status: {ticket.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
