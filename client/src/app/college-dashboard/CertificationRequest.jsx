"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { PlusCircle, File } from "lucide-react";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api";
const BASE_URL = API.replace("/api", "");

export default function CollegeCertRequests() {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    specialization: "",
    topics: "",
    document: null, // File object
  });
  const [loading, setLoading] = useState(false);
  const [college, setCollege] = useState({ name: "", email: "" });

  // Fetch current college info
  useEffect(() => {
    async function fetchCollege() {
      try {
        const res = await axios.get(`${API}/college/isCollege`, {
          withCredentials: true,
        });
        setCollege({ name: res.data.name, email: res.data.email });
      } catch {
        toast.error("Unauthorized. Please login.");
        window.location.href = "/join/college";
      }
    }
    fetchCollege();
  }, []);

  // Fetch this college's requests
  useEffect(() => {
    if (college.name) fetchRequests();
    // eslint-disable-next-line
  }, [college.name]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API}/certification-requests?college=${encodeURIComponent(
          college.name
        )}`
      );
      setRequests(res.data || []);
    } catch {
      setRequests([]);
    }
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.specialization) return toast.error("Enter specialization");
    const topicsArray = form.topics
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (topicsArray.length === 0) return toast.error("Add at least one topic");
    if (!form.document) return toast.error("Upload a document");

    setLoading(true);

    try {
      const data = new FormData();
      data.append("college", college.name);
      data.append("specialization", form.specialization);
      data.append("topics", JSON.stringify(topicsArray));
      data.append("document", form.document);

      await axios.post(`${API}/certification-requests`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Request sent!");
      setForm({ specialization: "", topics: "", document: null });
      setShowForm(false);
      fetchRequests();
    } catch {
      toast.error("Failed to add request");
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
          Certification Requests
        </h2>
        <div className="text-gray-500 text-base mb-2">
          <span className="font-semibold">{college.name}</span>
          <span className="ml-2 text-sm text-gray-400">({college.email})</span>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition"
        >
          <PlusCircle size={20} />
          {showForm ? "Close" : "Add Request"}
        </button>
      </div>

      {/* Add Request Inline Form */}
      {showForm && (
        <form
          className="bg-blue-50 border p-4 mb-6 rounded-xl flex gap-6 items-end flex-wrap"
          onSubmit={handleAdd}
          encType="multipart/form-data"
        >
          <div>
            <label className="block text-xs mb-1 font-semibold">
              Specialization
            </label>
            <input
              className="border px-3 py-2 rounded min-w-[180px]"
              placeholder="e.g. Data Analytics"
              value={form.specialization}
              onChange={(e) =>
                setForm((f) => ({ ...f, specialization: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-xs mb-1 font-semibold">
              Topics <span className="text-gray-400">(comma separated)</span>
            </label>
            <input
              className="border px-3 py-2 rounded min-w-[220px]"
              placeholder="e.g. Excel, Power BI, SQL"
              value={form.topics}
              onChange={(e) =>
                setForm((f) => ({ ...f, topics: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-xs mb-1 font-semibold">
              Upload Document
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              className="block border rounded px-2 py-1 bg-white"
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  document: e.target.files ? e.target.files[0] : null,
                }))
              }
              required
            />
            {form.document && (
              <div className="text-xs mt-1 flex items-center gap-1 text-gray-600">
                <File size={16} /> {form.document.name}
              </div>
            )}
          </div>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700"
            type="submit"
            disabled={loading}
          >
            {loading ? "Adding..." : "Submit Request"}
          </button>
        </form>
      )}

      {/* Excel-like Table */}
      <div className="overflow-x-auto border rounded-xl shadow bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-blue-100 text-blue-900 sticky top-0 z-10">
              <th className="px-4 py-3 font-bold text-left">Specialization</th>
              <th className="px-4 py-3 font-bold text-left">Topics</th>
              <th className="px-4 py-3 font-bold">Document</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold">Requested At</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-10">
                  No requests found.
                </td>
              </tr>
            )}
            {requests.map((r) => (
              <tr key={r._id} className="border-t hover:bg-blue-50">
                <td className="px-4 py-2">{r.specialization}</td>
                <td className="px-4 py-2">
                  {(Array.isArray(r.topics) ? r.topics : []).join(", ")}
                </td>
                <td className="px-4 py-2">
                  {r.document ? (
                    <a
                      href={`${BASE_URL}/${r.document.replace(/^[./]*/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-2 capitalize">
                  <span
                    className={
                      r.status === "active"
                        ? "bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold text-xs"
                        : "bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full font-bold text-xs"
                    }
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
