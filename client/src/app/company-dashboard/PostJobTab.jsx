import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api";

const PostJobTab = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/jobs`, form);
      toast.success("Job posted successfully!");
      setForm({ title: "", description: "", location: "" });
    } catch {
      toast.error("Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl">
      <h2 className="text-xl font-bold mb-4">+ Add Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Job Title"
          className="w-full border px-3 py-2 rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Location"
          className="w-full border px-3 py-2 rounded"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <textarea
          placeholder="Job Description"
          className="w-full border px-3 py-2 rounded"
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default PostJobTab;
