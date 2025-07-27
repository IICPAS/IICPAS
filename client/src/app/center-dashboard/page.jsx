"use client";
import { useState } from "react";
import {
  FaBars,
  FaTachometerAlt,
  FaBookOpen,
  FaUserGraduate,
  FaMoneyBill,
  FaUsers,
  FaUserTie,
  FaChartBar,
  FaLayerGroup,
  FaUniversity,
  FaBoxOpen,
  FaFileInvoiceDollar,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaTicketAlt,
  FaUserCircle,
} from "react-icons/fa";

// Import tab content components
import DashboardTab from "./Dashboard";
import GuideTab from "./GuideTab";
import StudentsTab from "./StudentsTab";
import PaymentsTab from "./PaymentsTab";
import JobSeekersTab from "./JobSeekersTab";
import LeadsTab from "./LeadsTab";
import AnalyticsTab from "./AnalyticsTab";
import TeamTab from "./TeamTab";
import BatchesTab from "./BatchesTab";
import CollegesTab from "./CollegesTab";
import KitsTab from "./KitsTab";
import OrdersInvoicesTab from "./OrdersInvoicesTab";
import TrainingTab from "./TrainingTab";
import CalendarTab from "./CalendarTab";
import TicketTab from "./TicketTab";
import ProfileTab from "./ProfileTab";

// Sidebar tabs config (icon for each)
const tabs = [
  { id: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { id: "guide", label: "Guide", icon: <FaBookOpen /> },
  { id: "students", label: "Students", icon: <FaUserGraduate /> },
  { id: "payments", label: "Payments", icon: <FaMoneyBill /> },
  { id: "jobseekers", label: "Job Seekers", icon: <FaUserTie /> },
  { id: "leads", label: "Leads", icon: <FaUsers /> },
  { id: "analytics", label: "Analytics", icon: <FaChartBar /> },
  { id: "team", label: "Team", icon: <FaUsers /> },
  { id: "batches", label: "Batches", icon: <FaLayerGroup /> },
  { id: "colleges", label: "Colleges", icon: <FaUniversity /> },
  { id: "kits", label: "Kits", icon: <FaBoxOpen /> },
  {
    id: "orders-invoices",
    label: "Orders & Invoices",
    icon: <FaFileInvoiceDollar />,
  },
  { id: "training", label: "Training", icon: <FaChalkboardTeacher /> },
  { id: "calendar", label: "Calendar", icon: <FaCalendarAlt /> },
  { id: "raise-ticket", label: "Raise Ticket", icon: <FaTicketAlt /> },
  { id: "profile", label: "Profile", icon: <FaUserCircle /> },
];

// Tab content renderer
function renderTabContent(tabId) {
  switch (tabId) {
    case "dashboard":
      return <DashboardTab />;
    case "guide":
      return <GuideTab />;
    case "students":
      return <StudentsTab />;
    case "payments":
      return <PaymentsTab />;
    case "jobseekers":
      return <JobSeekersTab />;
    case "leads":
      return <LeadsTab />;
    case "analytics":
      return <AnalyticsTab />;
    case "team":
      return <TeamTab />;
    case "batches":
      return <BatchesTab />;
    case "colleges":
      return <CollegesTab />;
    case "kits":
      return <KitsTab />;
    case "orders-invoices":
      return <OrdersInvoicesTab />;
    case "training":
      return <TrainingTab />;
    case "calendar":
      return <CalendarTab />;
    case "raise-ticket":
      return <TicketTab />;
    case "profile":
      return <ProfileTab />;
    default:
      return (
        <div className="flex-1 px-8 py-6">
          <div className="text-2xl font-semibold mb-6">Coming soon...</div>
        </div>
      );
  }
}

export default function CenterDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Sidebar as component so you can reuse it in both desktop and drawer
  const Sidebar = (
    <div className="h-screen flex flex-col">
      <div className="flex items-center gap-2 mb-8 px-4">
        <img
          src="https://fincurious.in/favicon.ico"
          alt="Logo"
          className="h-8 w-8"
        />
        <span className="font-bold text-lg">IICPA</span>
        <span className="ml-auto">
          <i className="fas fa-lock" />
        </span>
      </div>
      <div className="mb-10 px-4">
        <div className="font-semibold">Gupta Enterprises</div>
        <div className="text-sm text-[#e0e7ff]">guptaab@gmail.com</div>
      </div>
      <nav className="flex-1 flex flex-col gap-2 text-base overflow-y-auto px-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setDrawerOpen(false); // also close drawer on mobile
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
              activeTab === tab.id
                ? "bg-white text-[#3866c6] font-bold shadow"
                : "hover:bg-[#274087] font-medium"
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f5f7fa] relative">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-70 bg-blue-400 border-r-1 border-blue-500 rounded-[1vmin] text-white h-screen sticky top-0 overflow-y-auto z-20 shadow">
        {Sidebar}
      </aside>

      {/* Hamburger Button for Mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 bg-white p-2 rounded shadow"
        onClick={() => setDrawerOpen(true)}
      >
        <FaBars className="text-xl text-[#3866c6]" />
      </button>

      {/* Drawer for Mobile */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-30 flex">
          <div className="w-64 bg-[#3866c6] text-white h-full">{Sidebar}</div>
          <div
            className="flex-1"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close Sidebar"
          />
        </div>
      )}

      {/* Main content (full scrollable area) */}
      <div className="flex-1 h-screen overflow-y-auto">
        {renderTabContent(activeTab)}
      </div>
    </div>
  );
}
