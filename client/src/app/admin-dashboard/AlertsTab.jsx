"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_BASE + "/alerts";

export default function AlertsTab() {
  const [alerts, setAlerts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    message: "",
    status: "inactive",
  });

  const fetchAlerts = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setAlerts(data);
  };

  const addAlert = async (e) => {
    e.preventDefault();
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ title: "", message: "", status: "inactive" });
      fetchAlerts();
    }
  };

  const deleteAlert = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchAlerts();
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchAlerts();
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="p-1 max-w-7xl mx-auto font-[Inter]">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">📊 Alerts</h2>

      {/* Form */}
      <form
        onSubmit={addAlert}
        className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8"
      >
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md px-4 py-2 w-full transition-all"
          required
        />
        <input
          type="text"
          placeholder="Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md px-4 py-2 w-full transition-all"
          required
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md px-4 py-2 w-full transition-all"
        >
          <option value="inactive">Inactive</option>
          <option value="active">Active</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md px-4 py-2 transition-all"
        >
          ➕ Add Alert
        </button>
      </form>

      {/* Table */}
      <div className="overflow-auto border border-gray-200 rounded-xl shadow-sm max-h-[65vh]">
        <table className="min-w-full text-sm table-auto">
          <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Title
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Message
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, idx) => (
              <motion.tr
                key={alert._id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
                className={`border-t hover:bg-gray-50 transition-colors ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-6 py-3 whitespace-nowrap">{alert.title}</td>
                <td className="px-6 py-3">{alert.message}</td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => toggleStatus(alert._id, alert.status)}
                    className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm transition ${
                      alert.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {alert.status}
                  </button>
                </td>
                <td className="px-6 py-3 text-center">
                  <button
                    onClick={() => deleteAlert(alert._id)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Delete alert"
                  >
                    <X size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
