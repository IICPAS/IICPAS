"use client";

import { useEffect, useState } from "react";
import AlertsTab from "./AlertsTab";
import CourseBuilder from "./CourseBuilder";
import NewsTab from "./NewsTab";
import StaffManagementTab from "./StaffManagementTab";
import EnquiriesTab from "./LeadsTab";
import RoleManager from "./RoleManager";
import Drawer from "react-modern-drawer";
import axios from "axios";
import BlogComponent from "./BlogComponent";
import CollegeTab from "./CollegeTab";
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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const tabs = [
  { id: "course-category", label: "Course Category", icon: <FaBook /> },
  { id: "course", label: "Course", icon: <FaLayerGroup /> },
  { id: "live-session", label: "Live Session", icon: <FaCalendarAlt /> },
  { id: "center", label: "Center", icon: <FaHome /> },
  { id: "students", label: "Students", icon: <FaUserGraduate /> },
  { id: "staff", label: "Staff Management", icon: <FaUsers /> },
  { id: "enquiries", label: "Enquiries", icon: <FaEnvelope /> },
  { id: "jobs", label: "Jobs", icon: <FaBriefcase /> },
  { id: "calendar", label: "Calendar", icon: <FaCalendarAlt /> },

  { id: "team", label: "Our Team", icon: <FaUsers /> },
  { id: "testimonials", label: "Testimonials", icon: <FaQuoteRight /> },
  { id: "about", label: "About Us", icon: <FaBook /> },
  { id: "meta", label: "Manage Metatags", icon: <FaTags /> },
  { id: "companies", label: "Companies", icon: <FaStarOfDavid /> },
  { id: "colleges", label: "Colleges", icon: <FaUniversity /> },
  { id: "Blogs", label: "Blogs", icon: <FaBlogger /> },
  { id: "Alert", label: "Alert", icon: <FaBell /> },
  { id: "news", label: "News", icon: <FaNewspaper /> },
  { id: "support", label: "Support Requests", icon: <FaEnvelope /> },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("live-session");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // ✅ Role Check on Mount
  //   useEffect(() => {
  //     axios
  //       .get(`${API_BASE}/admin-only`, { withCredentials: true })
  //       .then((res) => {
  //         if (res.data?.user?.role !== "superadmin") {
  //           router.push("/unauthorized");
  //         } else {
  //           setIsLoading(false);
  //         }
  //       })
  //       .catch(() => router.push("/admin"));
  //   }, [router]);

  // ✅ Logout Handler
  const logout = async () => {
    try {
      await axios.post(`${API_BASE}/logout`, {}, { withCredentials: true });
    } finally {
      router.push("/login");
    }
  };

  const renderLiveSessions = () => {
    const sessions = [
      {
        title: "Basic Accounting & Tally Foundation",
        date: "20 July 2025",
        time: "10:00 AM – 05:00 PM",
        ended: false,
      },
      {
        title: "Basic Accounting & Tally Foundation",
        date: "11 July 2025",
        time: "01:23 PM – 03:23 PM",
        ended: true,
      },
      {
        title: "Unknown",
        date: "07 March 2025",
        time: "11:41 AM – 12:41 AM",
        ended: true,
      },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sessions.map((s, i) => (
          <div
            key={i}
            className={`rounded-xl border-l-4 shadow-sm p-4 ${
              s.ended ? "border-gray-400" : "border-blue-500"
            } bg-white`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.date}</p>
              </div>
              <div className="flex gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-blue-500">✎</span>
                <span className="text-red-500">🗑</span>
              </div>
            </div>
            <p className="mt-2 text-sm font-medium text-blue-700 bg-blue-100 inline-block px-2 py-1 rounded">
              {s.time}
            </p>
            {s.ended && (
              <div className="mt-2 text-xs text-white bg-red-500 inline-block px-2 py-1 rounded">
                Session Ended
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSidebar = (isMobile = false) => (
    <div className="p-4 space-y-3">
      <img src="/images/logo.png" alt="logo" className="h-28 mb-4" />
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            setActiveTab(tab.id);
            if (isMobile) setDrawerOpen(false);
          }}
          className={`flex items-center gap-3 px-4 py-2 rounded-md w-full text-left ${
            activeTab === tab.id
              ? "bg-blue-100 text-blue-700 font-semibold"
              : "hover:bg-gray-100 text-gray-800"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );

  //   if (isLoading) {
  //     return (
  //       <div className="min-h-screen flex items-center justify-center">
  //         Verifying admin...
  //       </div>
  //     );
  //   }

  return (
    <div className="flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block w-64 min-h-screen bg-white border-r">
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

      {/* Drawer - Mobile Sidebar */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        direction="left"
        className="bg-white w-64 h-full"
      >
        {renderSidebar(true)}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-100 mt-4"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </Drawer>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 min-h-screen p-6 pt-20">
        <div className="bg-white p-6 rounded-lg shadow">
          {activeTab === "live-session" ? (
            <LiveSessionAdmin />
          ) : activeTab === "enquiries" ? (
            <EnquiriesTab />
          ) : activeTab === "companies" ? (
            <CompanyTab />
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
          ) : activeTab === "staff" ? (
            <StaffManagementTab />
          ) : activeTab === "Alert" ? (
            <AlertsTab />
          ) : activeTab === "news" ? ( // ✅ News tab condition
            <NewsTab />
          ) : activeTab === "course" ? ( // ✅ News tab condition
            <CourseArea />
          ) : null}
        </div>
      </main>
    </div>
  );
}
