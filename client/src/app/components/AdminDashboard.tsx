"use client";

import { useState } from "react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import {
  FaBars,
  FaBook,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaClipboardList,
  FaCog,
} from "react-icons/fa";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: <FaClipboardList /> },
  { id: "course-category", label: "Course Category", icon: <FaBook /> },
  { id: "teachers", label: "Teachers", icon: <FaChalkboardTeacher /> },
  { id: "students", label: "Students", icon: <FaUserGraduate /> },
  { id: "settings", label: "Settings", icon: <FaCog /> },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => setIsOpen(!isOpen);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <div>Welcome to the IICPA Admin Dashboard 👋</div>;
      case "course-category":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Course Categories</h2>
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2">Sr. No.</th>
                  <th className="p-2">Category Name</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {["Accounting", "Taxation", "HR", "Finance", "US CMA"].map(
                  (cat, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{i + 1}</td>
                      <td className="p-2">{cat}</td>
                      <td className="p-2">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded">
                          Active
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        );
      case "teachers":
        return <div>Manage Teachers: Add, Edit, Remove Teachers.</div>;
      case "students":
        return <div>Student List, Verification, and Reports.</div>;
      case "settings":
        return (
          <div>Theme, Notifications & General Settings Coming Soon...</div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden lg:block w-64 bg-white border-r p-4 space-y-4">
        <img src="/images/iicpa-logo.png" alt="logo" className="h-12 mb-4" />
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-left ${
              activeTab === tab.id
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mobile Topbar */}
      <div className="lg:hidden absolute top-4 left-4">
        <button
          onClick={toggleDrawer}
          className="text-blue-900 bg-white p-2 rounded-full shadow"
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Drawer for Mobile */}
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="left"
        className="bg-white p-4 w-64"
      >
        <img src="/images/iicpa-logo.png" alt="logo" className="h-12 mb-4" />
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              toggleDrawer();
            }}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-left ${
              activeTab === tab.id
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </Drawer>

      {/* Content */}
      <main className="flex-1 p-6 lg:ml-64 mt-10 lg:mt-0">
        <div className="bg-white p-6 rounded-xl shadow">{renderContent()}</div>
      </main>
    </div>
  );
}
