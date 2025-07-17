"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface College {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  document?: string;
}

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default function CollegeTab() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "requests">("all");

  const fetchColleges = async () => {
    try {
      const res = await axios.get(`${API}/api/college`);
      setColleges(res.data.colleges);
    } catch (err) {
      toast.error("Failed to load colleges");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await axios.patch(`${API}/api/college/approve-college/${id}`);
      toast.success("College approved");
      fetchColleges();
    } catch {
      toast.error("Approval failed");
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const filteredColleges =
    activeTab === "all"
      ? colleges
      : colleges.filter((college) => college.status === "not approved");

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-700">
          College Management
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-1 rounded-full font-medium text-sm ${
              activeTab === "all"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-green-100"
            }`}
          >
            All Colleges
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-1 rounded-full font-medium text-sm ${
              activeTab === "requests"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-green-100"
            }`}
          >
            Partner Requests
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading colleges...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-green-100">
              <tr>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Phone</th>
                <th className="py-2 px-4 border">Document</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredColleges.map((college) => (
                <tr key={college._id} className="text-center">
                  <td className="border px-4 py-2">{college.name}</td>
                  <td className="border px-4 py-2">{college.email}</td>
                  <td className="border px-4 py-2">{college.phone}</td>
                  <td className="border px-4 py-2">
                    {college.document ? (
                      <a
                        href={`${API}/${college.document}`}
                        target="_blank"
                        className="text-blue-600 underline"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="border px-4 py-2 capitalize">
                    {college.status}
                  </td>
                  <td className="border px-4 py-2">
                    {college.status === "not approved" ? (
                      <button
                        onClick={() => handleApprove(college._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                    ) : (
                      <span className="text-green-600 font-medium">
                        Approved
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredColleges.length === 0 && (
            <div className="text-center text-gray-500 py-6">
              No colleges found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
