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
} from "react-icons/fa";
import BookingCalendar from "./BookingCalendar";
import TicketRaise from "./IndividualTicketRaiseAndList";
import IndividualProfile from "./IndividualProfile";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

const IndividualDashboardPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("training-request");

  useEffect(() => {
    const verifyIndividual = async () => {
      try {
        console.log("Hi");
        const res = await axios.get(`${API}/api/v1/individual/profile-valid`, {
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
        `${API}/api/v1/individual/logout`,
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
      case "training-request":
        return <BookingCalendar />;

      case "Tickets":
        return <TicketRaise />;
      case "Profile":
        return <IndividualProfile />;
      default:
        return null;
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
        <Sidebar setActiveTab={setActiveTab} />
      </Drawer>

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar (Desktop) */}
        <div className="hidden md:block w-64 bg-gray-50 border-r p-4">
          <Sidebar setActiveTab={setActiveTab} />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100 min-h-screen">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

const Sidebar = ({ setActiveTab }) => {
  return (
    <ul className="space-y-6 text-sm font-medium">
      <li>
        <button
          className="flex items-center gap-3 text-gray-700 hover:text-green-600"
          onClick={() => setActiveTab("training-request")}
        >
          <FaChalkboardTeacher className="text-xl" />
          Training Request
        </button>
      </li>

      <li>
        <button
          className="flex items-center gap-3 text-gray-700 hover:text-green-600"
          onClick={() => setActiveTab("Tickets")}
        >
          <FaFileUpload className="text-xl" />
          Tickets
        </button>
      </li>
      <li>
        <button
          className="flex items-center gap-3 text-gray-700 hover:text-green-600"
          onClick={() => setActiveTab("Profile")}
        >
          <span className="text-xl">👤</span>
          Profile
        </button>
      </li>
    </ul>
  );
};

export default IndividualDashboardPage;
