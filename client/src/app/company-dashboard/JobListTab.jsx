"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCheck, FaEnvelope, FaPlusCircle } from "react-icons/fa";
import { MdWhatsapp } from "react-icons/md";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api";

const JobManagerTab = () => {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    role: "",
    location: "",
    salary: "",
    jd: "",
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeJobTab, setActiveJobTab] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API}/jobs-external`, {
        withCredentials: true,
      });
      setJobs(res.data || []);
    } catch {
      toast.error("Failed to load jobs");
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    const { title, role, location, salary, jd } = form;
    if (!title || !role || !location || !salary || !jd) {
      return toast.error("All fields required");
    }
    setLoading(true);
    try {
      await axios.post(`${API}/jobs-internal`, form, {
        withCredentials: true,
      });
      toast.success("Job posted!");
      setForm({
        title: "",
        role: "",
        location: "",
        salary: "",
        jd: "",
      });
      fetchJobs();
    } catch {
      toast.error("Posting failed");
    }
    setLoading(false);
  };

  const renderJobList = () => (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full border rounded shadow-sm bg-white text-sm">
        <thead className="bg-gray-100 text-gray-800">
          <tr>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Location</th>
            <th className="p-2 border">Salary</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center text-gray-500 p-6">
                No jobs posted yet.
              </td>
            </tr>
          ) : (
            jobs.map((job) => (
              <tr key={job._id} className="border-t hover:bg-gray-50">
                <td className="p-2 border">{job.title}</td>
                <td className="p-2 border">{job.role}</td>
                <td className="p-2 border">{job.location}</td>
                <td className="p-2 border">{job.salary}</td>
                <td className="p-2 border">
                  <div className="flex gap-2 flex-wrap">
                    <button
                      className="text-blue-600 text-xs border px-2 py-1 rounded hover:bg-blue-100"
                      onClick={() =>
                        setActiveJobTab({ ...job, tab: "shortlist" })
                      }
                    >
                      Shortlist
                    </button>
                    <button
                      className="text-green-600 text-xs border px-2 py-1 rounded hover:bg-green-100"
                      onClick={() => setActiveJobTab({ ...job, tab: "hire" })}
                    >
                      <FaCheck className="inline mr-1" /> Hire
                    </button>
                    <a
                      href={`https://wa.me/${job.phone || ""}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-700 text-xs border px-2 py-1 rounded hover:bg-green-50"
                    >
                      <MdWhatsapp className="inline" /> WhatsApp
                    </a>
                    <a
                      href={`mailto:${job.email}`}
                      className="text-red-600 text-xs border px-2 py-1 rounded hover:bg-red-50"
                    >
                      <FaEnvelope className="inline" /> Email
                    </a>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderActiveTab = () => {
    if (!activeJobTab) return null;

    return (
      <div className="mt-10 p-6 bg-white rounded shadow border">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-blue-700">
            {activeJobTab.tab === "shortlist"
              ? "Shortlist Candidates"
              : "Hire Candidate"}
          </h3>
          <button
            onClick={() => setActiveJobTab(null)}
            className="text-sm text-red-500"
          >
            Close ✕
          </button>
        </div>
        <div className="text-sm text-gray-700">
          Job: <strong>{activeJobTab.title}</strong> | Role:{" "}
          <strong>{activeJobTab.role}</strong>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          This section will show applications or hiring tools.
        </p>
      </div>
    );
  };

  return (
    <div>
      {/* Post Job Form */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-green-700">Jobs</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
          onClick={() => setShowForm((s) => !s)}
        >
          <FaPlusCircle /> {showForm ? "Close" : "Add Job"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handlePostJob}
          className="bg-green-50 border mt-4 p-4 rounded grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            placeholder="Job Title"
            className="border px-3 py-2 rounded"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            placeholder="Role"
            className="border px-3 py-2 rounded"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            required
          />
          <input
            placeholder="Location"
            className="border px-3 py-2 rounded"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />
          <input
            placeholder="Salary"
            className="border px-3 py-2 rounded"
            value={form.salary}
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
            required
          />
          <textarea
            placeholder="Job Description"
            rows={3}
            className="border px-3 py-2 rounded col-span-full"
            value={form.jd}
            onChange={(e) => setForm({ ...form, jd: e.target.value })}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {loading ? "Posting..." : "Post Job"}
          </button>
        </form>
      )}

      {/* Job Listing */}
      {renderJobList()}

      {/* Dynamic Action Panel */}
      {renderActiveTab()}
    </div>
  );
};

export default JobManagerTab;
