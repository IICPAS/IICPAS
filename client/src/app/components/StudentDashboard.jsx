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

// Sidebar tabs (as before)
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
  const [student, setStudent] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();

  // Student auth check
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/students/isstudent`,
          { withCredentials: true }
        );
        // Authenticated: set student
        if (res.data && res.data.student) {
          setStudent(res.data.student);
        } else {
          router.replace("/student-login");
        }
      } catch (err) {
        router.replace("/student-login");
      } finally {
        setCheckingAuth(false);
      }
    };
    fetchStudent();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/students/logout`,
        {
          withCredentials: true,
        }
      );
      router.replace("/student-login");
    } catch (err) {
      alert("Failed to logout");
    }
  };

  // Tab rendering
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
    <div
      className={`flex flex-col justify-between h-full p-5 ${
        sidebarCollapsed ? "w-16" : "w-64"
      } pt-30 transition-all duration-300`}
    >
      <div>
        <div
          className={`flex items-center ${
            sidebarCollapsed ? "justify-center" : "justify-between"
          } mb-6`}
        >
          <h2
            className={`font-bold text-blue-600 ${
              sidebarCollapsed ? "text-lg" : "text-2xl"
            }`}
          >
            {sidebarCollapsed ? "IICPA" : "IICPA INSTITUTE"}
          </h2>
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded hover:bg-gray-100"
              title="Collapse sidebar"
            >
              ←
            </button>
          )}
          {sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded hover:bg-gray-100"
              title="Expand sidebar"
            >
              →
            </button>
          )}
        </div>
        {student && !sidebarCollapsed && (
          <div className="mb-6">
            <p className="font-semibold">{student.name}</p>
            <p className="text-sm text-gray-600">{student.email}</p>
          </div>
        )}
        <nav className="space-y-4">
          {tabs.map((tab) => (
            <NavItem
              key={tab.id}
              icon={tab.icon}
              label={sidebarCollapsed ? "" : tab.label}
              active={activeTab === tab.id}
              dot={tab.dot}
              dotColor={tab.dotColor}
              collapsed={sidebarCollapsed}
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
      <aside
        className={`hidden lg:block bg-white border-r ${
          sidebarCollapsed ? "w-16" : "w-64"
        } transition-all duration-300`}
      >
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
        {/* (optional: banners and prompts) */}
        {renderTabContent()}
      </main>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active,
  dot,
  dotColor = "red",
  collapsed,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center ${
        collapsed ? "justify-center" : "gap-3"
      } px-4 py-2 rounded cursor-pointer ${
        active
          ? "bg-blue-100 text-blue-700 font-semibold"
          : "text-gray-800 hover:bg-gray-100"
      }`}
      title={collapsed ? label : ""}
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
      {!collapsed && <span>{label}</span>}
    </div>
  );
}
