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
} from "react-icons/fa";
import CompanyTab from "./CompanyTab";
import CourseArea from "./CourseBuilder";
import CourseCategory from "./Course/CourseCategory";
import LiveSessionAdmin from "./Course/LiveSesionAdmin";
import TicketTab from "../components/TicketTab";
import RevisionQuizTable from "../code/page";

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
  { id: "topics", label: "Training Topics", icon: <FaBook /> },
  { id: "revision", label: "Revision", icon: <FaSyncAlt /> },
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
      <div className="p-6 pb-4">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-bold text-xl shadow-lg">
            <span className="text-green-300">+</span> RoboBooks <span className="text-green-300">+</span>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto scrollbar-hide px-3">
        {tabs.map((tab) => (
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
            <span className={`text-lg ${activeTab === tab.id ? 'text-white' : 'text-blue-500'}`}>
              {tab.icon}
            </span>
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-blue-200">
        <div className="text-center text-sm text-blue-600 font-medium">
          28°C Partly cloudy
        </div>
      </div>
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
          onClick={logout}
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
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 mt-4 mx-3 mb-3 rounded-lg transition-colors"
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
        ) : activeTab === "revision" ? (
          <RevisionQuizTable />
        ) : activeTab === "topics" ? (
          <TopicsManager />
        ) : activeTab === "center" ? (
          <CenterTab />
        ) : null}
      </main>
    </div>
  );
}
