"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AlertsTab from "./AlertsTab";
import JobsAdminPanel from "./JobsAdminPanel";
import CourseBuilder from "./CourseBuilder";
import TestimonialAdmin from "./Course/TestimonialAdmin";
import NewsTab from "./NewsTab";
import StaffManagementTab from "./StaffManagementTab";
import EnquiriesTab from "./LeadsTab";
import RoleManager from "./RoleManager";
import Drawer from "react-modern-drawer";
import axios from "axios";
import ManageMetaTags from "./Course/ManageMetaTags";
import BlogComponent from "./BlogComponent";
import CollegeTab from "./CollegeTab";
import CenterTab from "./CenterTab";
import CalendarTab from "./CalendarTab";
import AboutTab from "./AboutTab";
import StudentsTab from "./StudentsTab";
import { useRouter } from "next/navigation";
import "react-modern-drawer/dist/index.css";
import TopicsManager from "./Topic/TopicsManager";

import {
  FaBars,
  FaSignOutAlt,
  FaBell,
  FaCalendarAlt,
  FaClipboardList,
  FaLayerGroup,
  FaHome,
  FaBook,
  FaSyncAlt,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUserShield,
  FaUsers,
  FaBriefcase,
  FaEnvelope,
  FaBlog,
  FaQuoteRight,
  FaTags,
  FaUniversity,
  FaStarOfDavid,
  FaBlogger,
  FaNewspaper,
  FaCog,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import CompanyTab from "./CompanyTab";
import CourseArea from "./CourseBuilder";
import CourseCategory from "./Course/CourseCategory";
import LiveSessionAdmin from "./Course/LiveSesionAdmin";
import TicketTab from "../components/TicketTab";
import RevisionQuizTable from "../code/page";
import Header from "../components/Header";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

// All available modules with their permissions
const ALL_MODULES = [
  { id: "course-category", label: "Course Category", icon: <FaBook /> },
  { id: "course", label: "Course", icon: <FaLayerGroup /> },
  { id: "live-session", label: "Live Session", icon: <FaCalendarAlt /> },
  { id: "enquiries", label: "Enquiries", icon: <FaEnvelope /> },
  { id: "jobs", label: "Jobs", icon: <FaBriefcase /> },
  { id: "news", label: "News", icon: <FaNewspaper /> },
  { id: "center", label: "Center", icon: <FaHome /> },
  { id: "students", label: "Students", icon: <FaUserGraduate /> },
  { id: "staff", label: "Staff Management", icon: <FaUsers /> },
  { id: "companies", label: "Companies", icon: <FaStarOfDavid /> },
  { id: "colleges", label: "Colleges", icon: <FaUniversity /> },
  { id: "calendar", label: "Calendar", icon: <FaCalendarAlt /> },
  { id: "team", label: "Our Team", icon: <FaUsers /> },
  { id: "topics", label: "Training Topics", icon: <FaBook /> },
  { id: "revision", label: "Revision", icon: <FaSyncAlt /> },
  { id: "support", label: "Support Requests", icon: <FaEnvelope /> },
];

// Website Settings modules
const WEBSITE_SETTINGS_MODULES = [
  { id: "blogs", label: "Blogs", icon: <FaBlogger /> },
  { id: "testimonials", label: "Testimonials", icon: <FaQuoteRight /> },
  { id: "about", label: "About Us", icon: <FaBook /> },
  { id: "meta", label: "Manage Metatags", icon: <FaTags /> },
  { id: "alert", label: "Alert", icon: <FaBell /> },
];

function AdminDashboardContent() {
  const { user, hasPermission, canAccess, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [websiteSettingsOpen, setWebsiteSettingsOpen] = useState(false);
  const router = useRouter();

  // Filter modules based on user permissions
  const getAccessibleModules = () => {
    if (!user) return [];

    // Admin has access to all modules
    if (user.role === "Admin") return ALL_MODULES;

    // Filter modules based on permissions
    return ALL_MODULES.filter((module) => canAccess(module.id));
  };

  // Filter website settings modules based on permissions
  const getAccessibleWebsiteSettings = () => {
    if (!user) return [];

    // Admin has access to all website settings
    if (user.role === "Admin") return WEBSITE_SETTINGS_MODULES;

    // Filter based on permissions
    return WEBSITE_SETTINGS_MODULES.filter((module) => canAccess(module.id));
  };

  const accessibleModules = getAccessibleModules();
  const accessibleWebsiteSettings = getAccessibleWebsiteSettings();

  // Set default active tab to first accessible module only if no tab is selected
  useEffect(() => {
    if (activeTab === "" && accessibleModules.length > 0) {
      setActiveTab(accessibleModules[0].id);
    }
  }, [accessibleModules, activeTab]);

  const handleLogout = async () => {
    await logout();
    router.push("/admin");
  };

  // Check if user can perform action on current tab
  const canPerformAction = (action: string) => {
    if (!user) return false;
    if (user.role === "Admin") return true;
    return hasPermission(activeTab, action);
  };

  // SIDEBAR: scrollable, hidden scrollbar
  const renderSidebar = (isMobile = false) => (
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
        <div className="text-center mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="font-semibold text-blue-800">{user?.name}</p>
          <p className="text-sm text-blue-600">{user?.role}</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto scrollbar-hide px-3">
        {/* Accessible main modules */}
        {accessibleModules.slice(0, 3).map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (isMobile) setDrawerOpen(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left mb-2 transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-md"
                : "hover:bg-blue-50 text-gray-700 hover:text-blue-700"
            }`}
          >
            <span
              className={`text-lg ${
                activeTab === tab.id ? "text-white" : "text-blue-500"
              }`}
            >
              {tab.icon}
            </span>
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}

        {/* Website Settings Dropdown - Position 4 */}
        {accessibleWebsiteSettings.length > 0 && (
          <div className="mb-2">
            <button
              onClick={() => setWebsiteSettingsOpen(!websiteSettingsOpen)}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg w-full text-left transition-all duration-200 ${
                accessibleWebsiteSettings.some((tab) => activeTab === tab.id)
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-md"
                  : "hover:bg-blue-50 text-gray-700 hover:text-blue-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`text-lg ${
                    accessibleWebsiteSettings.some(
                      (tab) => activeTab === tab.id
                    )
                      ? "text-white"
                      : "text-blue-500"
                  }`}
                >
                  <FaCog />
                </span>
                <span className="font-medium">Website Settings</span>
              </div>
              <span
                className={`text-sm transition-transform duration-200 ${
                  accessibleWebsiteSettings.some((tab) => activeTab === tab.id)
                    ? "text-white"
                    : "text-blue-500"
                }`}
              >
                {websiteSettingsOpen ? <FaChevronDown /> : <FaChevronRight />}
              </span>
            </button>

            {/* Dropdown content */}
            {websiteSettingsOpen && (
              <div className="ml-6 mt-2 space-y-1">
                {accessibleWebsiteSettings.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (isMobile) setDrawerOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg w-full text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold shadow-md"
                        : "hover:bg-blue-50 text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <span
                      className={`text-sm ${
                        activeTab === tab.id ? "text-white" : "text-blue-400"
                      }`}
                    >
                      {tab.icon}
                    </span>
                    <span className="font-medium text-sm">{tab.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Remaining accessible modules */}
        {accessibleModules.slice(3).map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (isMobile) setDrawerOpen(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left mb-2 transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-md"
                : "hover:bg-blue-50 text-gray-700 hover:text-blue-700"
            }`}
          >
            <span
              className={`text-lg ${
                activeTab === tab.id ? "text-white" : "text-blue-500"
              }`}
            >
              {tab.icon}
            </span>
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop: fixed height, scrollable, hidden scrollbar */}
      <aside className="hidden lg:block w-70 min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 border-r border-blue-300 rounded-r-2xl shadow-xl">
        {renderSidebar()}
      </aside>

      {/* Topbar - Right: Bell & Logout */}
      <div className="fixed top-4 right-4 z-50 flex gap-4 items-center">
        <div className="relative">
          <div className="bg-white p-2 rounded-full shadow-md">
            <FaBell className="text-xl text-gray-700" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
              3
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 text-sm flex items-center gap-2 font-medium shadow-md transition-all duration-200"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      {/* Topbar - Left: Drawer for Mobile */}
      <div className="fixed top-4 left-4 lg:hidden z-50">
        <button
          onClick={() => setDrawerOpen(true)}
          className="bg-white p-3 shadow-lg rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FaBars className="text-gray-700" />
        </button>
      </div>

      {/* Drawer - Mobile Sidebar: scrollable, hidden scrollbar */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        direction="left"
        className="bg-gradient-to-b from-blue-100 to-blue-200 w-64 h-full scrollbar-hide"
      >
        <div className="h-full">{renderSidebar(true)}</div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 mt-4 mx-3 mb-3 rounded-lg transition-colors"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </Drawer>

      {/* Main Content: scrolls independently of sidebar */}
      <main className="flex-1 min-h-screen p-6 pt-20 overflow-y-auto">
        {/* Permission-based content rendering */}
        {activeTab === "live-session" && canAccess("live-session") ? (
          <LiveSessionAdmin />
        ) : activeTab === "enquiries" && canAccess("enquiries") ? (
          <EnquiriesTab />
        ) : activeTab === "support" && canAccess("support") ? (
          <TicketTab />
        ) : activeTab === "calendar" && canAccess("calendar") ? (
          <CalendarTab />
        ) : activeTab === "companies" && canAccess("companies") ? (
          <CompanyTab />
        ) : activeTab === "meta" && canAccess("meta") ? (
          <ManageMetaTags />
        ) : activeTab === "about" && canAccess("about") ? (
          <AboutTab />
        ) : activeTab === "colleges" && canAccess("colleges") ? (
          <CollegeTab />
        ) : activeTab === "blogs" && canAccess("blogs") ? (
          <BlogComponent />
        ) : activeTab === "course-category" && canAccess("course-category") ? (
          <CourseCategory />
        ) : activeTab === "students" && canAccess("students") ? (
          <StudentsTab />
        ) : activeTab === "jobs" && canAccess("jobs") ? (
          <JobsAdminPanel />
        ) : activeTab === "staff" && canAccess("staff") ? (
          <StaffManagementTab />
        ) : activeTab === "alert" && canAccess("alert") ? (
          <AlertsTab />
        ) : activeTab === "news" && canAccess("news") ? (
          <NewsTab />
        ) : activeTab === "testimonials" && canAccess("testimonials") ? (
          <TestimonialAdmin />
        ) : activeTab === "course" && canAccess("course") ? (
          <CourseArea />
        ) : activeTab === "revision" && canAccess("revision") ? (
          <RevisionQuizTable />
        ) : activeTab === "topics" && canAccess("topics") ? (
          <TopicsManager />
        ) : activeTab === "center" && canAccess("center") ? (
          <CenterTab />
        ) : activeTab === "" ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">
              Welcome to Admin Dashboard
            </h2>
            <p className="text-gray-500">
              Please select a module from the sidebar to get started.
            </p>
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-500">
              You don&apos;t have permission to access this module.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

// Wrap the dashboard with ProtectedRoute
export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
