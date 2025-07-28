"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ProfileTab() {
  const router = useRouter();

  const tabs = [
    "Basic Profile",
    "Job Profile",
    "Billing Information",
    "Notifications",
    "Account",
  ];

  const [activeTab, setActiveTab] = useState("Basic Profile");
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Fetch student data on mount
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE}/v1/students/isstudent`,
          { withCredentials: true }
        );

        console.log(res);
        setStudent({
          name: res.data.student.name,
          email: res.data.student.email,
          phone: res.data.student.phone || "",
        });
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/student-login");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/student/logout`, {
        withCredentials: true,
      });
      router.push("/student-login");
    } catch (err) {
      console.error("Logout error", err);
      alert("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen lg:flex-row gap-6 px-6 pt-20 pb-10 font-sans">
      {/* Left Sidebar */}
      <div className="w-full lg:w-1/4 bg-white border rounded-xl shadow-md p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-gray-200 w-24 h-24 rounded-full flex items-center justify-center text-4xl text-gray-500">
            📷
          </div>
          <div>
            <h2 className="text-xl font-bold text-blue-700">{student.name}</h2>
            <p className="text-sm text-gray-700">{student.email}</p>
            <p className="text-sm text-gray-800 font-semibold">
              {student.phone}
            </p>
          </div>
          <div className="text-orange-600 text-sm font-medium flex items-center justify-center gap-1">
            <span>Notifications</span> <span>🔔</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-600 mt-4 border px-4 py-2 rounded-lg hover:bg-red-50"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Right Content */}
      <div className="w-full lg:w-3/4 bg-white rounded-xl shadow-md">
        {/* Tabs */}
        <div className="flex gap-4 px-6 pt-4 border-b overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-3 text-sm font-medium ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "Basic Profile" ? (
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Name
                </label>
                <input
                  type="text"
                  value={student.name}
                  onChange={(e) =>
                    setStudent((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Email address
                </label>
                <input
                  type="email"
                  value={student.email}
                  disabled
                  className="w-full mt-1 p-2 border rounded bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={student.phone}
                  onChange={(e) =>
                    setStudent((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>

              <div className="md:col-span-2 flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div className="text-gray-600 italic">
              {activeTab} content coming soon...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
