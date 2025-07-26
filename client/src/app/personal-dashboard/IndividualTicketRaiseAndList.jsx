"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { PlusCircle, CheckCircle2, Clock } from "lucide-react";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api";

export default function IndividualTicketRaiseAndList() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

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

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
        Raise a Support Ticket
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

      {/* Ticket List Table */}
      <div className="mt-10 overflow-x-auto border rounded-xl shadow bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="px-4 py-3 font-bold text-left">Phone</th>
              <th className="px-4 py-3 font-bold text-left">Message</th>
              <th className="px-4 py-3 font-bold text-center">Status</th>
              <th className="px-4 py-3 font-bold text-center">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {listLoading ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-gray-400">
                  Loading tickets...
                </td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-gray-400 py-10">
                  No tickets found.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket._id} className="border-t hover:bg-blue-50">
                  <td className="px-4 py-3">{ticket.phone}</td>
                  <td className="px-4 py-3 text-gray-700">{ticket.message}</td>
                  <td className="px-4 py-3 text-center">
                    {ticket.resolve ? (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        <CheckCircle2 size={14} />
                        Resolved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">
                        <Clock size={14} />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
