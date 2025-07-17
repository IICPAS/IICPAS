/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  FaBug,
  FaPaperclip,
  FaPlusCircle,
  FaTimesCircle,
} from "react-icons/fa";

const RaiseTicketTab = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [form, setForm] = useState({
    subject: "",
    description: "",
    file: null as File | null,
  });

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm({ ...form, file: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const newTicket = {
      id: Date.now(),
      ...form,
      fileName: form.file ? form.file.name : null,
      status: "Open",
    };
    setTickets([newTicket, ...tickets]);
    setForm({ subject: "", description: "", file: null });
  };

  const handleCloseTicket = (id: number) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id ? { ...ticket, status: "Closed" } : ticket
      )
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-100 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
        <FaBug className="text-red-500" />
        Raise an Issue
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow flex flex-col gap-4 mb-8"
      >
        <input
          type="text"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="Subject"
          className="p-3 border rounded-md focus:outline-none focus:ring-2 ring-blue-400"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe your issue..."
          rows={4}
          className="p-3 border rounded-md focus:outline-none focus:ring-2 ring-blue-400"
          required
        />
        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
          <FaPaperclip />
          Attach file (optional)
          <input
            type="file"
            name="file"
            className="hidden"
            onChange={handleChange}
          />
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center gap-2 w-fit"
        >
          <FaPlusCircle />
          Submit Ticket
        </button>
      </form>

      <h3 className="text-xl font-semibold text-gray-700 mb-4">All Tickets</h3>
      {tickets.length === 0 ? (
        <div className="text-gray-500">No tickets raised yet.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`relative p-5 rounded-lg shadow-md bg-white border-t-4 ${
                ticket.status === "Closed"
                  ? "border-green-500"
                  : "border-yellow-400"
              }`}
            >
              <h4 className="text-lg font-semibold text-gray-800">
                {ticket.subject}
              </h4>
              <p className="text-sm text-gray-700 mt-1">{ticket.description}</p>
              {ticket.fileName && (
                <p className="text-xs text-gray-500 mt-1">
                  📎 {ticket.fileName}
                </p>
              )}
              <div className="mt-3 flex justify-between items-center">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    ticket.status === "Closed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {ticket.status}
                </span>
                {ticket.status === "Open" && (
                  <button
                    onClick={() => handleCloseTicket(ticket.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Close Ticket"
                  >
                    <FaTimesCircle size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RaiseTicketTab;
