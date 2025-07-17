/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

const CandidateTab = () => {
  const [activeTab, setActiveTab] = useState<"all" | "shortlisted">("all");
  const [filter, setFilter] = useState("");

  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: "Anjali Sharma",
      email: "anjali@example.com",
      phone: "9876543210",
      role: "Accountant",
      classification: "A",
      resume: "https://example.com/resume1.pdf",
    },
    {
      id: 2,
      name: "Ravi Patel",
      email: "ravi@example.com",
      phone: "9876501234",
      role: "Finance Analyst",
      classification: "B",
      resume: "https://example.com/resume2.pdf",
    },
    {
      id: 3,
      name: "Megha Verma",
      email: "megha@example.com",
      phone: "9834567890",
      role: "Accountant",
      classification: "C",
      resume: "https://example.com/resume3.pdf",
    },
  ]);

  const [shortlisted, setShortlisted] = useState<any[]>([]);

  const handleClassificationChange = (id: number, value: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, classification: value } : c))
    );
  };

  const handleShortlist = (candidate: any) => {
    if (!shortlisted.find((c) => c.id === candidate.id)) {
      setShortlisted((prev) => [...prev, candidate]);
      alert(`Shortlisted ${candidate.name} - Email sent to ${candidate.email}`);
    }
  };

  const handleUnshortlist = (id: number) => {
    setShortlisted((prev) => prev.filter((c) => c.id !== id));
  };

  const handleDelete = (id: number) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
    setShortlisted((prev) => prev.filter((c) => c.id !== id));
  };

  const filteredCandidates =
    activeTab === "all"
      ? candidates.filter((c) =>
          c.role.toLowerCase().includes(filter.toLowerCase())
        )
      : shortlisted;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Tabs */}
      <div className="flex space-x-4 border-b pb-2">
        {["all", "shortlisted"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "all" | "shortlisted")}
            className={`px-4 py-2 rounded-t-md capitalize ${
              activeTab === tab
                ? "bg-green-100 text-green-700 font-semibold"
                : "text-gray-600 hover:text-green-600"
            }`}
          >
            {tab === "all" ? "All Students" : "Shortlisted"}
          </button>
        ))}
      </div>

      {/* Filter */}
      {activeTab === "all" && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            👥 All Applied Candidates
          </h2>
          <input
            type="text"
            placeholder="Filter by job role..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
          />
        </div>
      )}

      {/* Candidate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCandidates.length === 0 ? (
          <p className="text-gray-500 col-span-full">
            No{" "}
            {activeTab === "all"
              ? "candidates found."
              : "shortlisted candidates yet."}
          </p>
        ) : (
          filteredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="relative bg-white p-4 rounded-lg shadow border"
            >
              <button
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                onClick={() => handleDelete(candidate.id)}
              >
                <FaTimes />
              </button>

              <h3 className="text-lg font-semibold text-gray-800">
                {candidate.name}
              </h3>
              <p className="text-sm text-gray-600">📧 {candidate.email}</p>
              <p className="text-sm text-gray-600">📞 {candidate.phone}</p>
              <p className="text-sm text-gray-600">💼 {candidate.role}</p>

              <div className="flex items-center gap-2 mt-2">
                <label className="text-sm font-medium text-gray-700">
                  Classification:
                </label>
                <select
                  value={candidate.classification}
                  onChange={(e) =>
                    handleClassificationChange(candidate.id, e.target.value)
                  }
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="A">Student A</option>
                  <option value="B">Student B</option>
                  <option value="C">Student C</option>
                </select>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <a
                  href={candidate.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm hover:underline"
                >
                  📄 View Resume
                </a>

                {activeTab === "all" ? (
                  <button
                    onClick={() => handleShortlist(candidate)}
                    className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Shortlist
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnshortlist(candidate.id)}
                    className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Unshortlist
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CandidateTab;
