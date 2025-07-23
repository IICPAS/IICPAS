"use client";

import React, { useState, useEffect } from "react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Dashboard = () => {
  const [isMobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("calendar");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [pinnedEvents, setPinnedEvents] = useState<
    { date: Date; title: string }[]
  >([]);

  const [certificationRequests] = useState([
    {
      college: "ABC College",
      partner: "TechCorp",
      topic: "React Basics",
      hours: 20,
      status: "Approved",
      date: new Date("2025-07-22"),
    },
    {
      college: "XYZ Institute",
      partner: "SkillEdge",
      topic: "Tailwind Masterclass",
      hours: 15,
      status: "Pending",
    },
    {
      college: "PQR University",
      partner: "TypeScript Pro",
      topic: "TypeScript Deep Dive",
      hours: 25,
      status: "Approved",
      date: new Date("2025-08-05"),
    },
  ]);

  useEffect(() => {
    const approved = certificationRequests
      .filter((req) => req.status === "Approved" && req.date)
      .map((req) => ({
        date: new Date(req.date!),
        title: req.topic,
      }));
    setPinnedEvents(approved);
  }, [certificationRequests]);

  const toggleDrawer = () => setMobileDrawerOpen((prev) => !prev);

  const handleLogout = () => {
    alert("Logged out successfully!");
    // Example: localStorage.clear(); router.push("/login");
  };

  return (
    <div className="flex overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col justify-between w-1/5 bg-gray-800 text-white p-4">
        <div>
          <h2 className="text-xl font-bold mb-6">Dashboard</h2>
          <button
            className={`w-full mb-4 px-4 py-2 rounded ${
              activeTab === "training" ? "bg-gray-700" : "bg-gray-600"
            }`}
            onClick={() => setActiveTab("training")}
          >
            Training Notifications
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 rounded bg-red-600 hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Mobile Drawer Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleDrawer}
          className="bg-gray-800 text-white p-2 rounded"
        >
          ☰
        </button>
      </div>

      {/* Mobile Sidebar Drawer */}
      <Drawer
        open={isMobileDrawerOpen}
        onClose={toggleDrawer}
        direction="left"
        className="bg-gray-800 text-white p-4 flex flex-col justify-between h-full"
      >
        <div>
          <h2 className="text-xl font-bold mb-6">Dashboard</h2>
          <button
            className={`w-full mb-4 px-4 py-2 rounded ${
              activeTab === "training" ? "bg-gray-700" : "bg-gray-600"
            }`}
            onClick={() => {
              setActiveTab("training");
              toggleDrawer();
            }}
          >
            Training Notifications
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 rounded bg-red-600 hover:bg-red-700 mt-6"
        >
          Logout
        </button>
      </Drawer>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
        {activeTab === "training" && (
          <div className="space-y-6">
            {/* Calendar Block */}
            <div className="w-full flex justify-center">
              <div className="w-full max-w-6xl">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Training Calendar
                </h2>
                <Calendar
                  className="w-[80%] mx-auto rounded border shadow"
                  value={selectedDate}
                  onChange={(value) => {
                    if (value instanceof Date) {
                      setSelectedDate(value);
                    }
                  }}
                  tileContent={({ date, view }) => {
                    if (view === "month") {
                      const isPinned = pinnedEvents.some(
                        (event) =>
                          event.date.toDateString() === date.toDateString()
                      );
                      return isPinned ? (
                        <div className="text-xs text-blue-600 text-center mt-1">
                          📌
                        </div>
                      ) : null;
                    }
                  }}
                />
                <p className="mt-2 text-center text-gray-600">
                  Selected: <strong>{selectedDate.toDateString()}</strong>
                </p>
              </div>
            </div>

            {/* Training Request List */}
            <div className="bg-white shadow rounded p-4 space-y-4 max-w-6xl mx-auto">
              <h3 className="text-xl font-medium text-gray-800">
                Training Requests
              </h3>
              {certificationRequests.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No training requests yet.
                </p>
              ) : (
                certificationRequests.map((req, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded border ${
                      req.status === "Approved"
                        ? "border-green-400 bg-green-50"
                        : "border-yellow-400 bg-yellow-50"
                    }`}
                  >
                    <div className="font-medium text-gray-800">{req.topic}</div>
                    <div className="text-sm text-gray-600">
                      College: {req.college} | Partner: {req.partner} |{" "}
                      {req.hours} hrs
                    </div>
                    <div
                      className={`text-xs font-semibold ${
                        req.status === "Approved"
                          ? "text-green-700"
                          : "text-yellow-700"
                      }`}
                    >
                      Status: {req.status}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
