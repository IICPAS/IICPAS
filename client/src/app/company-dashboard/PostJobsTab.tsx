import { FaTimes } from "react-icons/fa";
import { useState } from "react";
const PostJobsTab = () => {
  const [subTab, setSubTab] = useState<"post" | "view">("post");
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Frontend Developer",
      location: "Remote",
      salary: "45000",
      type: "Full-Time",
      skills: "React, Tailwind, Next.js",
    },
    {
      id: 2,
      title: "Backend Engineer",
      location: "Delhi",
      salary: "60000",
      type: "Contract",
      skills: "Node.js, MongoDB, Express",
    },
  ]);

  const handleDelete = (id: number) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-xl">
      {/* Sub Tabs */}
      <div className="flex space-x-4 mb-6 border-b pb-2">
        <button
          onClick={() => setSubTab("post")}
          className={`px-4 py-2 rounded-t-md ${
            subTab === "post"
              ? "bg-green-100 text-green-700 font-semibold"
              : "text-gray-600 hover:text-green-600"
          }`}
        >
          Post Job
        </button>
        <button
          onClick={() => setSubTab("view")}
          className={`px-4 py-2 rounded-t-md ${
            subTab === "view"
              ? "bg-green-100 text-green-700 font-semibold"
              : "text-gray-600 hover:text-green-600"
          }`}
        >
          View Jobs
        </button>
      </div>

      {/* Post Form */}
      {subTab === "post" && (
        <div className="space-y-5">
          <h2 className="text-2xl font-semibold text-gray-800">
            📝 Post a New Job
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                placeholder="e.g. Frontend Developer"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe responsibilities, expectations, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 45000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Select</option>
                  <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Required Skills
              </label>
              <input
                type="text"
                placeholder="e.g. React, Node.js"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate skills with commas
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Remote, Mumbai"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-all">
              Post Job
            </button>
          </div>
        </div>
      )}

      {/* View Jobs */}
      {subTab === "view" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="relative bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <button
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                onClick={() => handleDelete(job.id)}
              >
                <FaTimes />
              </button>
              <h3 className="text-lg font-semibold text-gray-800">
                {job.title}
              </h3>
              <p className="text-sm text-gray-600">📍 {job.location}</p>
              <p className="text-sm text-gray-600">💼 {job.type}</p>
              <p className="text-sm text-gray-600">💰 ₹{job.salary}</p>
              <p className="text-sm text-gray-600">🛠️ {job.skills}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostJobsTab;
