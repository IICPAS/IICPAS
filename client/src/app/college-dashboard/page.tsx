/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Drawer from "react-modern-drawer";
import BookingTab from "./BookingTab";
import CollegeTicketRaise from "./CollegeTicketRaise";
import "react-modern-drawer/dist/index.css";
import { Menu, LogOut, Bell, FilePlus } from "lucide-react";
import Calendar from "react-calendar";
import CertificationRequests from "./CertificationRequest";
import "react-calendar/dist/Calendar.css";
import CollegeTicketRaiseAndList from "./CollegeTicketRaise";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

type TabType = "Tickets" | "dashboard" | "certifications" | "notifications";

const CollegeDashboard = () => {
  const [college, setCollege] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [tab, setTab] = useState<TabType>("notifications");

  // Certification state
  const [certificationRequests, setCertificationRequests] = useState<
    {
      college?: string;
      partner: string;
      topic: string;
      hours?: number;
      status: string;
    }[]
  >([
    {
      college: "ABC College",
      partner: "TechCorp",
      topic: "Web Development",
      status: "Pending",
      hours: 30,
    },
    {
      college: "XYZ Institute",
      partner: "SkillEdge",
      topic: "AI Basics",
      status: "Approved",
      hours: 20,
    },
  ]);
  const [partnerName, setPartnerName] = useState("");
  const [certTopic, setCertTopic] = useState("");
  const [hours, setHours] = useState<number>(0);
  const [collegeName, setCollegeName] = useState("");

  // Training notification state
  const [pinnedEvents, setPinnedEvents] = useState<
    { date: Date; title: string }[]
  >([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [title, setTitle] = useState("");

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const res = await axios.get(`${API}/api/college/isCollege`, {
          withCredentials: true,
        });
        setCollege(res.data.college);
      } catch (err) {
        toast.error("Unauthorized. Please login.");
        window.location.href = "/join/college";
      }
    };
    fetchCollege();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${API}/college/logout`, {
        withCredentials: true,
      });
      toast.success("Logged out");
      window.location.href = "/join/college";
    } catch (err) {
      toast.error("Failed to logout");
    }
  };

  const handleAddCertification = () => {
    if (
      !collegeName.trim() ||
      !partnerName.trim() ||
      !certTopic.trim() ||
      !hours
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    const newRequest = {
      college: collegeName,
      partner: partnerName,
      topic: certTopic,
      hours,
      status: "Pending",
    };

    setCertificationRequests((prev) => [...prev, newRequest]);
    setCollegeName("");
    setPartnerName("");
    setCertTopic("");
    setHours(0);
    toast.success("Certification request added");
  };

  const Sidebar = () => (
    <aside className="w-64 bg-white shadow-lg h-full flex flex-col p-6 space-y-6">
      <div className="text-xl font-semibold text-gray-800">College Panel</div>
      <nav className="flex flex-col space-y-4 text-gray-700">
        <button
          onClick={() => setTab("certifications")}
          className={`flex items-center gap-2 hover:text-blue-600 ${
            tab === "certifications" ? "text-blue-600 font-semibold" : ""
          }`}
        >
          <FilePlus size={18} />
          Partner Certifications
        </button>
        <button
          onClick={() => setTab("notifications")}
          className={`flex items-center gap-2 hover:text-blue-600 ${
            tab === "notifications" ? "text-blue-600 font-semibold" : ""
          }`}
        >
          <Bell size={18} />
          Training Notifications
        </button>

        <button
          onClick={() => setTab("Tickets")}
          className={`flex items-center gap-2 hover:text-blue-600 ${
            tab === "notifications" ? "text-blue-600 font-semibold" : ""
          }`}
        >
          <FilePlus size={18} />
          Tickets
        </button>
      </nav>
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 hover:text-red-600"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );

  const renderContent = () => {
    switch (tab) {
      case "certifications":
        return (
          <>
            <CertificationRequests />
          </>
        );

      case "notifications":
        return <BookingTab />;

      case "Tickets":
        return <CollegeTicketRaiseAndList />;

      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow text-gray-600">
            Select an option from the sidebar to view or manage requests.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Header + Drawer */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow px-4 py-3 flex items-center justify-between">
        <button onClick={() => setIsDrawerOpen(true)}>
          <Menu size={24} />
        </button>
        <div className="text-lg font-semibold text-gray-800">Dashboard</div>
      </div>

      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        direction="left"
        className="p-0"
      >
        <Sidebar />
      </Drawer>

      {/* Main Content */}
      <main className="flex-1 p-6 pt-24 md:pt-6">
        <div className="text-gray-800 text-xl font-semibold mb-4">
          Welcome, {college?.name || "College Admin"}
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default CollegeDashboard;
