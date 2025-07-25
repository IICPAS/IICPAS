/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Drawer from "react-modern-drawer";
import BookingTab from "./BookingTab";
import "react-modern-drawer/dist/index.css";
import { Menu, LogOut, Bell, FilePlus } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api";

type TabType = "dashboard" | "certifications" | "notifications";

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
        const res = await axios.get(`${API}/college/isCollege`, {
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
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Partner Certification Requests
            </h2>

            {/* Request Form */}
            <div className="bg-white p-6 rounded shadow space-y-4">
              <h3 className="text-lg font-medium text-gray-700">
                Request New Certification
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="College Name"
                  className="border border-gray-300 rounded px-3 py-2"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Specialization..."
                  className="border border-gray-300 rounded px-3 py-2"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Certification Topic"
                  className="border border-gray-300 rounded px-3 py-2"
                  value={certTopic}
                  onChange={(e) => setCertTopic(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Hours"
                  className="border border-gray-300 rounded px-3 py-2"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                />
              </div>
              <button
                onClick={handleAddCertification}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Request
              </button>
            </div>

            {/* Existing Requests */}
            <div className="space-y-4">
              {certificationRequests.map((req, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded shadow flex flex-col"
                >
                  <span className="font-medium text-gray-800">
                    College: {req.college}
                  </span>
                  <span className="font-medium text-gray-800">
                    Partner: {req.partner}
                  </span>
                  <span className="text-sm text-gray-600">
                    Topic: {req.topic}
                  </span>
                  <span className="text-sm text-gray-600">
                    Hours: {req.hours}
                  </span>
                  <span className="text-sm text-gray-500">
                    Status: {req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case "notifications":
        return <BookingTab />;

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
