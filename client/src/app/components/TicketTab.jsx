"use client";
import { useState, useEffect } from "react";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";

export default function TicketTab() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [resolveText, setResolveText] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch tickets on mount
  useEffect(() => {
    fetch(`${BASE_URL}/tickets`)
      .then((res) => res.json())
      .then(setTickets);
  }, []);

  useEffect(() => {
    setResolveText(selectedTicket?.resolve || "");
  }, [selectedTicket]);

  // Select a ticket and load fresh data
  async function handleSelect(ticket) {
    setLoading(true);
    const res = await fetch(`${BASE_URL}/tickets/${ticket._id}`);
    const data = await res.json();
    setSelectedTicket(data);
    setLoading(false);
  }

  // Update resolve field (admin reply)
  async function handleReply(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(
      `${BASE_URL}/tickets/${selectedTicket._id}/resolve`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolve: resolveText }),
      }
    );
    const data = await res.json();
    setTickets(tickets.map((t) => (t._id === data._id ? data : t)));
    setSelectedTicket(data);
    setLoading(false);
  }

  return (
    <div className="flex w-full h-[80vh] rounded-xl overflow-hidden shadow-2xl bg-gray-100">
      {/* Sidebar */}
      <div className="w-[340px] bg-gray-200 border-r border-gray-300 flex flex-col">
        <div className="p-6 pb-4 border-b border-gray-300 text-lg font-bold tracking-wide text-gray-900">
          Tickets
        </div>
        <div className="flex-1 overflow-y-auto">
          {tickets.length === 0 ? (
            <div className="text-gray-400 text-center mt-24">No tickets</div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket._id}
                onClick={() => handleSelect(ticket)}
                className={`cursor-pointer px-6 py-5 border-b border-gray-300 transition 
            ${
              selectedTicket && selectedTicket._id === ticket._id
                ? "bg-gray-300 text-gray-900 font-semibold"
                : "hover:bg-gray-100 text-gray-700"
            }
          `}
              >
                <div className="text-base truncate font-medium">
                  {ticket.name}
                </div>
                <div className="text-xs text-gray-500">{ticket.email}</div>
                <div className="text-xs text-gray-400">
                  {new Date(ticket.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat/Details */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {selectedTicket ? (
          <>
            <div className="flex-1 px-16 py-8 overflow-y-auto">
              {/* User's message bubble */}
              <div className="max-w-[600px] mb-7">
                <div className="mb-2 text-blue-600 text-sm font-bold">
                  {selectedTicket.name}
                </div>
                <div className="bg-white rounded-tl-3xl rounded-tr-3xl rounded-br-3xl rounded-bl-lg p-5 text-gray-900 text-[16px] shadow">
                  <span className="font-semibold">Message: </span>
                  {selectedTicket.message}
                  <div className="text-xs text-cyan-600 mt-2">
                    Phone: {selectedTicket.phone}
                  </div>
                </div>
              </div>
              {/* Admin's resolve bubble */}
              {selectedTicket.resolve && (
                <div className="max-w-[600px] ml-auto mb-7">
                  <div className="text-right mb-2 text-green-600 text-sm font-semibold">
                    Your Reply
                  </div>
                  <div className="bg-green-50 text-right rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl rounded-br-lg p-5 text-green-800 text-[16px] shadow">
                    {selectedTicket.resolve}
                  </div>
                </div>
              )}
            </div>
            {/* Reply area */}
            <form
              onSubmit={handleReply}
              className="flex gap-4 p-8 border-t border-gray-300 bg-gray-200"
            >
              <textarea
                value={resolveText}
                onChange={(e) => setResolveText(e.target.value)}
                placeholder="Type your reply or update here..."
                rows={2}
                disabled={loading}
                className="flex-1 rounded-lg bg-white border border-gray-400 px-4 py-3 text-gray-900 resize-none focus:outline-none focus:border-blue-400 text-[15px]"
              />
              <button
                type="submit"
                disabled={loading || !resolveText.trim()}
                className={`rounded-lg px-7 py-3 text-white font-bold text-lg transition
              ${
                loading || !resolveText.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-cyan-400 hover:opacity-90"
              }
            `}
              >
                {selectedTicket.resolve ? "Update" : "Reply"}
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-2xl font-semibold">
            Select a ticket to chat
          </div>
        )}
      </div>
    </div>
  );
}
