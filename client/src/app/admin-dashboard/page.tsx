"use client";

import { useState } from "react";
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
import BlogComponent from "./BlogComponent.jsx";
import CollegeTab from "./CollegeTab";
import CalendarTab from "./CalendarTab";
import AboutTab from "./AboutTab";
import StudentsTab from "./StudentsTab";
import { useRouter } from "next/navigation";
import "react-modern-drawer/dist/index.css";

import {
  FaBars,
  FaSignOutAlt,
  FaBell,
  FaCalendarAlt,
  FaClipboardList,
  FaLayerGroup,
  FaHome,
  FaBook,
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
} from "react-icons/fa";
import CompanyTab from "./CompanyTab";
import CourseArea from "./CourseBuilder";
import CourseCategory from "./Course/CourseCategory";
import LiveSessionAdmin from "./Course/LiveSesionAdmin";
import TicketTab from "../components/TicketTab";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const tabs = [
  { id: "course-category", label: "Course Category", icon: <FaBook /> },
  { id: "course", label: "Course", icon: <FaLayerGroup /> },
  { id: "live-session", label: "Live Session", icon: <FaCalendarAlt /> },
  { id: "enquiries", label: "Enquiries", icon: <FaEnvelope /> },
  { id: "jobs", label: "Jobs", icon: <FaBriefcase /> },
  { id: "testimonials", label: "Testimonials", icon: <FaQuoteRight /> },
  { id: "about", label: "About Us", icon: <FaBook /> },
  { id: "meta", label: "Manage Metatags", icon: <FaTags /> },
  { id: "Blogs", label: "Blogs", icon: <FaBlogger /> },
  { id: "Alert", label: "Alert", icon: <FaBell /> },
  { id: "news", label: "News", icon: <FaNewspaper /> },
  { id: "center", label: "Center", icon: <FaHome /> },
  { id: "students", label: "Students", icon: <FaUserGraduate /> },
  { id: "staff", label: "Staff Management", icon: <FaUsers /> },
  { id: "companies", label: "Companies", icon: <FaStarOfDavid /> },
  { id: "colleges", label: "Colleges", icon: <FaUniversity /> },
  { id: "calendar", label: "Calendar", icon: <FaCalendarAlt /> },
  { id: "team", label: "Our Team", icon: <FaUsers /> },
  { id: "support", label: "Support Requests", icon: <FaEnvelope /> },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("live-session");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  const logout = async () => {
    try {
      await axios.post(`${API_BASE}/logout`, {}, { withCredentials: true });
    } finally {
      router.push("/admin");
    }
  };

  // SIDEBAR: scrollable, hidden scrollbar
  const renderSidebar = (isMobile = false) => (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <img src="/images/logo.png" alt="logo" className="h-20 mx-auto mb-6" />
      </div>
      <nav className="flex-1 overflow-y-auto scrollbar-hide px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (isMobile) setDrawerOpen(false);
            }}
            className={`flex items-center gap-3 px-4 py-2 rounded-md w-full text-left mb-1 transition-all ${
              activeTab === tab.id
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "hover:bg-gray-100 text-gray-800"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar - Desktop: fixed height, scrollable, hidden scrollbar */}
      <aside className="hidden lg:block w-70 min-h-screen bg-blue-200 border-r-1 border-blue-400 rounded-[1vmin] scrollbar-hide overflow-y-auto">
        {renderSidebar()}
      </aside>

      {/* Topbar - Right: Bell & Logout */}
      <div className="fixed top-4 right-4 z-50 flex gap-4 items-center">
        <div className="relative">
          <FaBell className="text-xl text-gray-700" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
            3
          </span>
        </div>
        <button
          onClick={logout}
          className="bg-red-100 text-red-600 px-3 py-1 rounded-md hover:bg-red-200 text-sm flex items-center gap-2"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      {/* Topbar - Left: Drawer for Mobile */}
      <div className="fixed top-4 left-4 lg:hidden z-50">
        <button
          onClick={() => setDrawerOpen(true)}
          className="bg-white p-2 shadow rounded-md"
        >
          <FaBars />
        </button>
      </div>

      {/* Drawer - Mobile Sidebar: scrollable, hidden scrollbar */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        direction="left"
        className="bg-white w-64 h-full scrollbar-hide"
      >
        <div className="h-full">{renderSidebar(true)}</div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-100 mt-4"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </Drawer>

      {/* Main Content: scrolls independently of sidebar */}
      <main className="flex-1 min-h-screen p-6 pt-20 overflow-y-auto">
        {activeTab === "live-session" ? (
          <LiveSessionAdmin />
        ) : activeTab === "enquiries" ? (
          <EnquiriesTab />
        ) : activeTab === "support" ? (
          <TicketTab />
        ) : activeTab === "calendar" ? (
          <CalendarTab />
        ) : activeTab === "companies" ? (
          <CompanyTab />
        ) : activeTab === "meta" ? (
          <ManageMetaTags />
        ) : activeTab === "about" ? (
          <AboutTab />
        ) : activeTab === "colleges" ? (
          <CollegeTab />
        ) : activeTab === "roles" ? (
          <RoleManager />
        ) : activeTab === "Blogs" ? (
          <BlogComponent />
        ) : activeTab === "course-category" ? (
          <CourseCategory />
        ) : activeTab === "students" ? (
          <StudentsTab />
        ) : activeTab === "jobs" ? (
          <JobsAdminPanel />
        ) : activeTab === "staff" ? (
          <StaffManagementTab />
        ) : activeTab === "Alert" ? (
          <AlertsTab />
        ) : activeTab === "news" ? (
          <NewsTab />
        ) : activeTab === "testimonials" ? (
          <TestimonialAdmin />
        ) : activeTab === "course" ? (
          <CourseArea />
        ) : null}
      </main>
    </div>
  );
}
