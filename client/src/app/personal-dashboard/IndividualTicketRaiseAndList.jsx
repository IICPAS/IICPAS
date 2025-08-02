"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { PlusCircle, CheckCircle2, Clock, X } from "lucide-react";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api";

export default function IndividualTicketRaiseAndList() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Fetch individual email from profile
  useEffect(() => {
    const fetchIndividual = async () => {
      try {
        const res = await axios.get(`${API}/v1/individual/profile-valid`, {
          withCredentials: true,
        });

        const { email: userEmail, name } = res.data.user;
        setEmail(userEmail);
        setForm((prev) => ({ ...prev, email: userEmail, name: name || "" }));
      } catch {
        toast.error("Unauthorized. Please login.");
        window.location.href = "/individual/login";
      }
    };
    fetchIndividual();
  }, []);

  // Fetch tickets
  useEffect(() => {
    if (!email) return;
    fetchTickets();
  }, [email, submitted]);

  const fetchTickets = async () => {
    setListLoading(true);
    try {
      const res = await axios.get(`${API}/tickets?email=${email}`);
      setTickets(res.data || []);
    } catch {
      toast.error("Failed to fetch tickets.");
      setTickets([]);
    }
    setListLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, message } = form;

    if (!phone.trim() || !message.trim()) {
      return toast.error("Phone and Message are required.");
    }

    setLoading(true);
    try {
      await axios.post(`${API}/tickets`, { name, email, phone, message });
      toast.success("Ticket raised successfully!");
      setForm((prev) => ({ ...prev, phone: "", message: "" }));
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
      setShowForm(false);
    } catch {
      toast.error("Failed to raise ticket.");
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    try {
      await axios.put(`${API}/tickets/${selectedTicket._id}`, {
        ...selectedTicket,
        resolve: replyMessage,
      });
      toast.success("Reply sent successfully!");
      setReplyMessage("");
      fetchTickets(); // Refresh to get updated ticket
      // Update selected ticket with new data
      const updatedTicket = { ...selectedTicket, resolve: replyMessage };
      setSelectedTicket(updatedTicket);
    } catch {
      toast.error("Failed to send reply.");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
        Support Tickets
      </h2>

      <div className="text-gray-600 mb-4">
        Logged in as <strong>{form.name || "Individual"}</strong>{" "}
        <span className="text-sm text-gray-400">({form.email})</span>
      </div>

      <button
        onClick={() => setShowForm((v) => !v)}
        className={`flex items-center gap-2 px-5 py-2 ${
          showForm
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white font-semibold rounded-lg shadow transition mb-6`}
      >
        <PlusCircle size={20} />
        {showForm ? "Close Form" : "Raise Ticket"}
      </button>

      {submitted && (
        <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg flex items-center gap-2">
          <CheckCircle2 size={20} />
          Your support ticket has been submitted successfully!
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-blue-50 p-6 rounded-xl border space-y-4 mb-8"
        >
          <div>
            <label className="block text-xs mb-1 font-semibold">Name</label>
            <input
              className="border px-3 py-2 rounded w-full bg-gray-100"
              value={form.name}
              readOnly
            />
          </div>

          <div>
            <label className="block text-xs mb-1 font-semibold">Email</label>
            <input
              className="border px-3 py-2 rounded w-full bg-gray-100"
              value={form.email}
              readOnly
            />
          </div>

          <div>
            <label className="block text-xs mb-1 font-semibold">Phone *</label>
            <input
              type="tel"
              className="border px-3 py-2 rounded w-full"
              placeholder="Your contact number"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <label className="block text-xs mb-1 font-semibold">
              Message *
            </label>
            <textarea
              className="border px-3 py-2 rounded w-full"
              rows={4}
              placeholder="Explain the issue or request..."
              value={form.message}
              onChange={(e) =>
                setForm((f) => ({ ...f, message: e.target.value }))
              }
              required
            />
          </div>

          <button
            className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700"
            type="submit"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
      )}

      {/* Two Column Layout */}
      <div className="flex gap-6 h-[600px]">
        {/* Left Column - Ticket List */}
        <div className="w-1/3 bg-gray-50 rounded-xl border overflow-hidden">
          <div className="p-4 bg-blue-100 border-b">
            <h3 className="text-lg font-bold text-blue-900">Tickets</h3>
          </div>
          <div className="overflow-y-auto h-full">
            {listLoading ? (
              <div className="p-4 text-center text-gray-400">
                Loading tickets...
              </div>
            ) : tickets.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                No tickets found.
              </div>
            ) : (
              tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className={`p-4 border-b cursor-pointer hover:bg-blue-50 transition ${
                    selectedTicket?._id === ticket._id ? "bg-blue-100" : ""
                  }`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="font-semibold text-gray-800">
                    {ticket.name}
                  </div>
                  <div className="text-sm text-gray-600">{ticket.email}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </div>
                  <div className="mt-2">
                    {ticket.resolve ? (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                        <CheckCircle2 size={12} />
                        Resolved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                        <Clock size={12} />
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column - Ticket Details */}
        <div className="flex-1 bg-white rounded-xl border overflow-hidden">
          {selectedTicket ? (
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-4 bg-gray-50 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">
                    {selectedTicket.name}
                  </h3>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="text-gray-400 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 overflow-y-auto">
                {/* Ticket Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="font-semibold text-gray-700 mb-1">
                    Message:{" "}
                    <span className="font-normal">
                      {selectedTicket.message}
                    </span>
                  </div>
                  <div className="font-semibold text-gray-700 mb-1">
                    Phone:{" "}
                    <span className="font-normal">{selectedTicket.phone}</span>
                  </div>
                  <div className="font-semibold text-gray-700 mb-1">
                    Email:{" "}
                    <span className="font-normal">{selectedTicket.email}</span>
                  </div>
                  <div className="font-semibold text-gray-700">
                    Date:{" "}
                    <span className="font-normal">
                      {new Date(selectedTicket.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Resolution/Reply */}
                {selectedTicket.resolve && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      Resolution
                    </div>
                    <div className="text-green-700">
                      {selectedTicket.resolve}
                    </div>
                  </div>
                )}

                {/* Reply Form */}
                <div className="mt-auto">
                  <label className="block mb-2 font-medium text-gray-700">
                    Your Reply
                  </label>
                  <textarea
                    className="w-full border rounded-lg p-3 bg-green-50 border-green-200"
                    rows={4}
                    placeholder="Type your reply..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleReplySubmit}
                      className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
                      disabled={!replyMessage.trim()}
                    >
                      OK
                    </button>
                    <button
                      onClick={() => setReplyMessage("")}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-300"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-lg font-medium mb-2">
                  Select a ticket to chat
                </div>
                <div className="text-sm">
                  Choose a ticket from the list to view details and reply
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
