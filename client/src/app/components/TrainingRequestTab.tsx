"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { FaUserGraduate, FaEnvelope, FaFileAlt } from "react-icons/fa";
import toast from "react-hot-toast";

Modal.setAppElement("body");

interface TrainingRequest {
  _id: string;
  training: string;
  category: string;
  resumeUrl: string;
  status: "pending" | "approved" | "scheduled";
  scheduledDate?: string;
  createdAt: string;
}

const TrainingRequestTab = () => {
  const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  const [requests, setRequests] = useState<TrainingRequest[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [training, setTraining] = useState("");
  const [category, setCategory] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API}/individual/training-requests`, {
        withCredentials: true,
      });
      setRequests(res.data.requests || []);
    } catch (err) {
      toast.error("Failed to load requests");
    }
  };

  const handleSubmit = async () => {
    if (!training || !category || !resume) {
      toast.error("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("training", training);
    formData.append("category", category);
    formData.append("resume", resume);

    try {
      setSubmitting(true);
      await axios.post(`${API}/individual/training-requests`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success("Request submitted");
      setModalOpen(false);
      setTraining("");
      setCategory("");
      setResume(null);
      fetchRequests();
    } catch (err) {
      toast.error("Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 py-6 mx-auto max-w-screen-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          📋 Training Requests
        </h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + New Request
        </button>
      </div>

      {/* Requests List */}
      <div className="space-y-6">
        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-white p-6 rounded-lg shadow flex flex-col sm:flex-row sm:justify-between gap-4"
          >
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                <FaUserGraduate className="text-blue-600" />
                {req.training}
              </h3>
              <p className="text-sm text-gray-600">
                🎓 Category: <span className="font-medium">{req.category}</span>
              </p>
              <a
                href={req.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline inline-flex items-center gap-1"
              >
                <FaFileAlt /> View Resume
              </a>
              <p className="text-sm mt-1">
                🕒 Requested on: {new Date(req.createdAt).toLocaleDateString()}
              </p>
              {req.scheduledDate && (
                <p className="text-sm text-green-700 font-medium">
                  📅 Scheduled: {new Date(req.scheduledDate).toLocaleString()}
                </p>
              )}
            </div>
            <span
              className={`self-start sm:self-center px-3 py-1 text-sm font-medium rounded-full ${
                req.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : req.status === "scheduled"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {req.status}
            </span>
          </div>
        ))}

        {requests.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No requests yet.</p>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Request Training"
        className="bg-white max-w-md mx-auto p-8 rounded-xl shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-6">📥 Request Training</h2>

        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">
            Training Name
          </span>
          <input
            type="text"
            value={training}
            onChange={(e) => setTraining(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
            placeholder="e.g. React, Python"
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">Category</span>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
            placeholder="e.g. B.Tech CSE"
            required
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm font-medium text-gray-700">
            Upload Resume
          </span>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files?.[0] || null)}
            className="w-full mt-1"
            required
          />
        </label>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setModalOpen(false)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default TrainingRequestTab;
