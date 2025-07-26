/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import {
  FaBriefcase,
  FaList,
  FaBug,
  FaSignOutAlt,
  FaBars,
  FaCalendarAlt,
  FaPlusCircle,
} from "react-icons/fa";

// Import your actual components here
import PostJobTab from "./PostJobTab";
import JobListTab from "./JobListTab";
import RaiseTicketTab from "./RaiseTicketTab";
import ScheduleBookingTab from "./ScheduleBookingTab";
import JobManagerTab from "./JobListTab";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api";

const CompanyDashboardPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("schedule-booking");

  useEffect(() => {
    const verifyCompany = async () => {
      try {
        const res = await axios.get(`${API}/companies/iscompany`, {
          withCredentials: true,
        });
        setCompany(res.data.company);
        setLoading(false);
      } catch (err) {
        toast.error("Unauthorized. Please login.");
        router.push("/placements/hire");
      }
    };

    verifyCompany();
  }, [router]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API}/companies/logout`,
        {},
        { withCredentials: true }
      );
      toast.success("Logged out");
      router.push("/placements/hire");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "job-list":
        return <JobManagerTab />;
      case "schedule-booking":
        return <ScheduleBookingTab />;
      case "raise-ticket":
        return <RaiseTicketTab />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 shadow-md bg-white sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button
            className="text-xl text-gray-700 md:hidden"
            onClick={() => setDrawerOpen(true)}
          >
            <FaBars />
          </button>
          <h1 className="text-xl font-semibold">Company Dashboard</h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md text-sm"
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

      {/* Layout */}
      <div className="flex">
        {/* Sidebar (Desktop) */}
        <div className="hidden md:block w-64 bg-gray-50 p-4 border-r">
          <Sidebar setActiveTab={setActiveTab} />
        </div>

        {/* Main Tab View */}
        <div className="flex-1 p-6 bg-gray-100 min-h-screen">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

// Sidebar Menu
const Sidebar = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  return (
    <ul className="space-y-5 text-sm font-medium">
      <li>
        <button
          className="flex items-center gap-3 text-gray-700 hover:text-green-600"
          onClick={() => setActiveTab("job-list")}
        >
          <FaList className="text-xl" /> Job List / Hire
        </button>
      </li>
      <li>
        <button
          className="flex items-center gap-3 text-gray-700 hover:text-green-600"
          onClick={() => setActiveTab("schedule-booking")}
        >
          <FaCalendarAlt className="text-xl" /> Schedule Booking
        </button>
      </li>
      <li>
        <button
          className="flex items-center gap-3 text-gray-700 hover:text-green-600"
          onClick={() => setActiveTab("raise-ticket")}
        >
          <FaBug className="text-xl" /> Raise Ticket
        </button>
      </li>
    </ul>
  );
};

export default CompanyDashboardPage;
