"use client";

import { useState } from "react";
import {
  FaBook,
  FaVideo,
  FaNewspaper,
  FaUser,
  FaHeadset,
  FaCertificate,
  FaMoon,
  FaSignOutAlt,
} from "react-icons/fa";

const tabs = [
  { id: "courses", icon: <FaBook />, label: "Courses" },
  { id: "revision", icon: <FaBook />, label: "Revision" },
  { id: "live", icon: <FaVideo />, label: "Live Class", dot: true },
  { id: "news", icon: <FaNewspaper />, label: "News" },
  { id: "profile", icon: <FaUser />, label: "Profile" },
  { id: "support", icon: <FaHeadset />, label: "Support" },
  {
    id: "certificates",
    icon: <FaCertificate />,
    label: "Certificates",
    dot: true,
    dotColor: "green",
  },
];

const course = {
  title: "Basic Accounting & Tally Foundation",
  status: "Not Certified. Finish test within lid Date",
  progress: 100,
  subtopics: [
    "Basic Accounting",
    "Company creation and data management",
    "Voucher Entries in Tally",
    "Method of Accounting",
    "Finalisation of ledger balances",
  ],
};

export default function StudentDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("courses");

  return (
    <div className="flex pt-20 h-screen overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Fincurious</h2>
          <div className="mb-6">
            <p className="font-semibold">Gupta Enterprises</p>
            <p className="text-sm text-gray-600">guptab1356@gmail.com</p>
          </div>
          <nav className="space-y-4">
            {tabs.map((tab) => (
              <NavItem
                key={tab.id}
                icon={tab.icon}
                label={tab.label}
                active={activeTab === tab.id}
                dot={tab.dot}
                dotColor={tab.dotColor}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </nav>
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded bg-gray-100"
          >
            <FaMoon />
          </button>
          <button className="text-red-600 flex items-center gap-1">
            <FaSignOutAlt /> Exit
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-[#f5f6fa] p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search for a topic"
            className="w-1/2 px-4 py-2 border rounded"
          />
          <div className="flex items-center gap-3">
            <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">
              Learn to Use Lab
            </button>
            <button className="bg-gray-800 text-white px-3 py-1 rounded text-sm">
              Download App
            </button>
            <div className="bg-yellow-400 px-3 py-1 rounded-full font-semibold">
              50
            </div>
          </div>
        </div>

        {/* Viva Alert */}
        <div className="bg-red-600 text-white p-4 rounded-lg mb-4 flex justify-between items-center">
          <span>
            Batches are scheduled for Viva. Please visit dashboard and book your
            slots!
          </span>
          <button className="bg-white text-red-600 px-4 py-1 rounded">
            Go to Dashboard
          </button>
        </div>

        {/* Resume Prompt */}
        <div className="bg-green-100 p-4 border-l-4 border-green-500 mb-6 rounded">
          <p className="text-green-700 font-medium">
            Pick up where you left off!
          </p>
          <p className="text-sm mt-1">
            You had last accessed{" "}
            <strong>GSTR - 1 Return in GST Return Filing (Online)</strong>.
            <button className="ml-2 text-green-700 underline">Continue</button>
          </p>
        </div>

        {/* Tab Content */}
        {activeTab === "courses" && (
          <div className="bg-white p-6 rounded-xl shadow border">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold">{course.title}</h3>
              <span className="text-red-600 text-xs bg-red-100 px-3 py-1 rounded-full">
                {course.status}
              </span>
            </div>
            <div className="flex justify-end text-blue-600 font-bold text-sm mb-4">
              {course.progress}%
            </div>

            {course.subtopics.map((topic, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center mb-3 hover:bg-gray-50 px-2 py-1 rounded cursor-pointer"
              >
                <div className="flex gap-3 items-center">
                  <span className="text-blue-500 font-semibold">{idx + 1}</span>
                  <span className="text-gray-700 font-medium">{topic}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-28 bg-blue-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-full" />
                  </div>
                  <span className="text-sm text-green-600 font-medium">
                    Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab !== "courses" && (
          <div className="bg-white p-10 rounded-xl text-center text-gray-500 shadow">
            This is <strong className="text-blue-600">{activeTab}</strong> tab
            content. Customize here.
          </div>
        )}
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, dot, dotColor = "red", onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 rounded cursor-pointer ${
        active
          ? "bg-blue-100 text-blue-700 font-semibold"
          : "text-gray-800 hover:bg-gray-100"
      }`}
    >
      <div className="relative">
        {icon}
        {dot && (
          <span
            className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
              dotColor === "green"
                ? "bg-green-500"
                : dotColor === "yellow"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          />
        )}
      </div>
      <span>{label}</span>
    </div>
  );
}
