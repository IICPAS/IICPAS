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
  FaBars,
  FaTimes,
  FaQuoteLeft,
  FaArrowLeft,
} from "react-icons/fa";
import toast from "react-hot-toast";

import CertificatesTab from "../components/CertificateTab";
import CoursesTab from "../components/CourseTab";
import RevisionTab from "./RevisionTab";
import TicketTab from "../components/TicketTab";
import NewsTab from "./NewsTab";
import LiveClassTab from "../components/LiveClassTab";
import ProfileTab from "../components/ProfileTab";
import TestimonialTab from "./TestimonialTab";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("courses");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Ticket modal state
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";

  // Debug environment variable
  console.log("NEXT_PUBLIC_API_BASE:", process.env.NEXT_PUBLIC_API_BASE);
  console.log("API variable:", API);

  // Sidebar tabs
  const tabs = [
    { id: "courses", icon: <FaBook />, label: "Courses" },
    { id: "revision", icon: <FaBook />, label: "Assessment" },
    { id: "live", icon: <FaVideo />, label: "Live Class", dot: true },
    { id: "news", icon: <FaNewspaper />, label: "News" },
    { id: "profile", icon: <FaUser />, label: "Profile" },
    { id: "testimonial", icon: <FaQuoteLeft />, label: "Testimonial" },
    { id: "support", icon: <FaHeadset />, label: "Support" },
    {
      id: "certificates",
      icon: <FaCertificate />,
      label: "Certificates",
      dot: true,
      dotColor: "green",
    },
    { id: "dashboard", icon: <FaBook />, label: "Dashboard" },
    { id: "reports", icon: <FaBook />, label: "Reports" },
    { id: "help", icon: <FaBook />, label: "Help Center" },
    { id: "feedback", icon: <FaBook />, label: "Feedback" },
    { id: "notifications", icon: <FaBook />, label: "Notifications" },
    {
      id: "collapse",
      icon: <span>{sidebarCollapsed ? "→" : "←"}</span>,
      label: sidebarCollapsed ? "Expand" : "Collapse",
    },
  ];

  // Student auth check
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE}/v1/students/isstudent`,
          { withCredentials: true }
        );
        // Authenticated: set student
        if (res.data && res.data.student) {
          setStudent(res.data.student);

          // Update ticket form with student data
          setTicketForm({
            name: res.data.student.name || "",
            email: res.data.student.email || "",
            phone: res.data.student.phone || "",
            message: "",
          });
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

  // Handle ticket submission
  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, message } = ticketForm;

    if (!phone.trim() || !message.trim()) {
      return toast.error("Phone and Message are required.");
    }

    setSubmitting(true);
    try {
      console.log("API URL:", `${process.env.NEXT_PUBLIC_API_BASE}/tickets`);
      console.log("Ticket data:", { name, email, phone, message });

      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/tickets`, {
        name,
        email,
        phone,
        message,
      });
      toast.success("Ticket submitted successfully!");
      setTicketForm((prev) => ({ ...prev, phone: "", message: "" }));
      setShowTicketModal(false);
    } catch (error) {
      console.error(
        "Error submitting ticket:",
        error.response?.data || error.message
      );
      toast.error("Failed to submit ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    setActiveTab("courses");
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
        return <ProfileTab student={student} />;
      case "testimonial":
        return <TestimonialTab student={student} />;
      case "support":
        return <TicketTab />;
      case "certificates":
        return <CertificatesTab />;
      case "collapse":
        // Handle collapse action
        setSidebarCollapsed(!sidebarCollapsed);
        setActiveTab("courses"); // Switch back to courses tab
        return <CoursesTab />;
      default:
        return null;
    }
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-6 pb-4">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-white p-3 rounded-lg shadow-lg">
            <img
              src="/images/logo.png"
              alt="IICPA Institute"
              className="h-12 w-auto object-contain"
            />
          </div>
        </div>
        {/* User Info */}
        {student && (
          <div className="text-center mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="font-semibold text-blue-800">{student.name}</p>
            <p className="text-sm text-blue-600">Student</p>
          </div>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto px-3 custom-scrollbar">
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
  );

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 h-full">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block ${
          sidebarCollapsed ? "w-16" : "w-70"
        } h-screen fixed left-0 top-0 bg-gradient-to-b from-blue-100 to-blue-200 border-r border-blue-300 rounded-r-2xl shadow-xl overflow-y-auto custom-scrollbar z-50 transition-all duration-300`}
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
      <main className={`lg:${sidebarCollapsed ? "ml-16" : "ml-70"} bg-[#f5f6fa] h-screen transition-all duration-300 overflow-y-auto thin-scrollbar`}>
        {/* Fixed Header */}
        <div className="sticky top-0 z-40 bg-[#f5f6fa] border-b border-gray-200 p-4 md:p-6">
          <div className="flex justify-between items-center">
            <button
              className="lg:hidden p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              onClick={() => setIsDrawerOpen(true)}
            >
              <FaBars />
            </button>
            <input
              type="text"
              placeholder="Search for a topic"
              className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="hidden md:flex items-center gap-3 ml-4">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors">
                Digital Hub
              </button>
              <button className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-1 rounded text-sm transition-colors">
                Download App
              </button>
              <div className="bg-yellow-400 px-3 py-1 rounded-full font-semibold">
                50
              </div>
            </div>
          </div>
        </div>
        
        {/* Scrollable Content */}
        <div className="p-4 md:p-6">
        
        {/* Back Button - Only show when not on courses tab */}
        {activeTab !== "courses" && (
          <div className="mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
            >
              <FaArrowLeft className="text-sm" />
              Back to Courses
            </button>
          </div>
        )}
        
        {/* (optional: banners and prompts) */}
        {renderTabContent()}
        </div>
      </main>

      {/* Floating Add Ticket Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setShowTicketModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105"
          title="Submit a Ticket"
        >
          <FaHeadset size={24} />
        </button>
      </div>

      {/* Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                Submit a Ticket
              </h3>
              <button
                onClick={() => setShowTicketModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleTicketSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  value={ticketForm.name}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  value={ticketForm.email}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter your phone number"
                  value={ticketForm.phone}
                  onChange={(e) =>
                    setTicketForm((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={4}
                  placeholder="Describe your issue or request..."
                  value={ticketForm.message}
                  onChange={(e) =>
                    setTicketForm((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
    <button
      onClick={onClick}
      className={`flex items-center ${
        collapsed ? "justify-center" : "gap-3"
      } px-4 py-3 rounded-lg w-full text-left mb-2 transition-all duration-200 ${
        active
          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-md"
          : "hover:bg-blue-50 text-gray-700 hover:text-blue-700"
      }`}
      title={collapsed ? label : ""}
    >
      <span
        className={`text-lg relative ${
          active ? "text-white" : "text-blue-500"
        }`}
      >
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
      </span>
      {!collapsed && <span className="font-medium break-words">{label}</span>}
    </button>
  );
}
