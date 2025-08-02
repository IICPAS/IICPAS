"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import {
  FaSignOutAlt,
  FaBars,
  FaChalkboardTeacher,
  FaFileUpload,
  FaTachometerAlt,
} from "react-icons/fa";
import BookingCalendar from "./BookingCalendar";
import TicketRaise from "./IndividualTicketRaiseAndList";
import IndividualProfile from "./IndividualProfile";
import DashboardOverview from "./DashboardOverview";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api";

const IndividualDashboardPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const verifyIndividual = async () => {
      try {
        const res = await axios.get(`${API}/v1/individual/profile-valid`, {
          withCredentials: true,
        });

        setUser(res.data.user || res.data.individual);
        setLoading(false);
      } catch (err) {
        toast.error("Unauthorized. Please login.");
        router.push("/training/practical");
      }
    };

    verifyIndividual();
  }, [router]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API}/v1/individual/logout`,
        {},
        { withCredentials: true }
      );
      toast.success("Logged out");
      router.push("/training/practical");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "training-request":
        return <BookingCalendar />;
      case "Tickets":
        return <TicketRaise />;
      case "Profile":
        return <IndividualProfile />;
      default:
        return <DashboardOverview />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-medium">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button
            className="text-xl text-gray-700 md:hidden"
            onClick={() => setDrawerOpen(true)}
          >
            <FaBars />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            Individual Dashboard
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
        >
          <FaSignOutAlt className="inline mr-1" /> Logout
        </button>
      </div>

      {/* Drawer (Mobile) */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        direction="left"
        className="w-64 bg-white p-4"
      >
        <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />
      </Drawer>

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar (Desktop) */}
        <div className="hidden md:block w-64 bg-gray-50 border-r p-4">
          <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 min-h-screen">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

const Sidebar = ({ setActiveTab, activeTab }) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: FaTachometerAlt,
      color: "text-blue-600",
    },
    {
      id: "training-request",
      label: "Training Request",
      icon: FaChalkboardTeacher,
      color: "text-green-600",
    },
    {
      id: "Tickets",
      label: "Tickets",
      icon: FaFileUpload,
      color: "text-orange-600",
    },
    {
      id: "Profile",
      label: "Profile",
      icon: () => <span className="text-xl">👤</span>,
      color: "text-purple-600",
    },
  ];

  return (
    <ul className="space-y-6 text-sm font-medium">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.id}>
            <button
              className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? `${item.color} bg-white shadow-sm`
                  : "text-gray-700 hover:text-gray-900 hover:bg-white"
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="text-xl" />
              {item.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default IndividualDashboardPage;
