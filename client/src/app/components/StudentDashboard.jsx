"use client";

import { useEffect, useState } from "react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import axios from "axios";
import { useRouter } from "next/navigation";

import {
  FaBook,
  FaVideo,
  FaNewspaper,
  FaUser,
  FaHeadset,
  FaCertificate,
  FaMoon,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

import CertificatesTab from "../components/CertificateTab";
import CoursesTab from "../components/CourseTab";
import RevisionTab from "./RevisionTab";
import TicketTab from "../components/TicketTab";
import NewsTab from "./NewsTab";
import LiveClassTab from "../components/LiveClassTab";
import ProfileTab from "../components/ProfileTab";

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

export default function StudentDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("courses");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [student, setStudent] = useState({ name: "", email: "" });
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  // Auth check on page load
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE}/student/protected`,
          { withCredentials: true }
        );
        setStudent(res.data.user); // Should contain name, email
        setCheckingAuth(false);
      } catch (err) {
        console.error("Unauthorized", err);
        router.push("/student-login");
      }
    };
    fetchStudent();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/student/logout`, {
        withCredentials: true,
      });
      window.location.href = "/student-login";
    } catch (err) {
      console.error("Logout failed", err);
      alert("Failed to logout");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "courses":
        return <CoursesTab />;
      case "revision":
        return <RevisionTab />;
      case "live":
        return <LiveClassTab />;
      case "news":
        return <NewsTab />;
      case "profile":
        return <ProfileTab />;
      case "support":
        return <TicketTab />;
      case "certificates":
        return <CertificatesTab />;
      default:
        return null;
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col justify-between h-full p-5 w-64">
      <div>
        <h2 className="text-2xl font-bold text-blue-600 mb-6">Fincurious</h2>
        <div className="mb-6">
          <p className="font-semibold">{student?.name}</p>
          <p className="text-sm text-gray-600">{student?.email}</p>
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
              onClick={() => {
                setActiveTab(tab.id);
                setIsDrawerOpen(false);
              }}
            />
          ))}
        </nav>
      </div>

      <div className="flex items-center justify-between mt-10">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded bg-gray-100"
        >
          <FaMoon />
        </button>
        <button
          onClick={handleLogout}
          className="text-red-600 flex items-center gap-1"
        >
          <FaSignOutAlt /> Exit
        </button>
      </div>
    </div>
  );

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="flex overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block bg-white border-r">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        direction="left"
        className="lg:hidden"
      >
        <SidebarContent />
      </Drawer>

      {/* Main Content */}
      <main className="flex-1 bg-[#f5f6fa] p-4 md:p-6 overflow-y-auto min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            className="lg:hidden p-2 bg-gray-100 rounded"
            onClick={() => setIsDrawerOpen(true)}
          >
            <FaBars />
          </button>

          <input
            type="text"
            placeholder="Search for a topic"
            className="w-full md:w-1/2 px-4 py-2 border rounded"
          />
          <div className="hidden md:flex items-center gap-3 ml-4">
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
        {renderTabContent()}
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
