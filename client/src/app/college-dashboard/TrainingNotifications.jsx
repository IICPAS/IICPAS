// pages/college/training-notifications.tsx
"use client";

import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Pin } from "lucide-react";

export default function TrainingNotifications() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [pinnedEvents, setPinnedEvents] = useState([]);
  const [title, setTitle] = useState("");

  const handlePinEvent = () => {
    if (!title.trim()) return;
    setPinnedEvents([...pinnedEvents, { date: selectedDate, title }]);
    setTitle("");
  };

  const getPinnedForDate = (date) => {
    return pinnedEvents.filter(
      (e) => e.date.toDateString() === date.toDateString()
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Training Notifications Calendar
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Calendar onChange={setSelectedDate} value={selectedDate} />
          <p className="mt-4 text-gray-600">
            Selected: {selectedDate.toDateString()}
          </p>
          <div className="mt-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter training title"
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            <button
              onClick={handlePinEvent}
              className="mt-2 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              <Pin size={16} />
              Pin Training
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            📌 Pinned Trainings
          </h3>
          <ul className="space-y-3">
            {pinnedEvents.map((event, index) => (
              <li key={index} className="bg-white shadow px-4 py-2 rounded">
                <strong>{event.date.toDateString()}</strong>: {event.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
