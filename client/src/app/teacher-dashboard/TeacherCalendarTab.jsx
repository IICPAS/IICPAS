"use client";

import { FaCalendar, FaClock, FaMapMarkerAlt, FaUsers } from "react-icons/fa";

export default function TeacherCalendarTab({ teacher }) {
  const events = [
    {
      id: 1,
      title: "Web Development Class",
      date: "2024-02-15",
      time: "10:00 AM - 12:00 PM",
      location: "Room 101",
      students: 15,
      type: "class",
    },
    {
      id: 2,
      title: "Student Consultation",
      date: "2024-02-16",
      time: "2:00 PM - 3:00 PM",
      location: "Office",
      students: 1,
      type: "consultation",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Calendar & Schedule
          </h2>
          <p className="text-gray-600 mt-1">
            Manage your teaching schedule and appointments
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gray-50 p-6 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <FaCalendar className="text-4xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Calendar view will be implemented here
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        {event.title}
                      </h4>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          event.type === "class"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {event.type}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaCalendar />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaClock />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUsers />
                        <span>{event.students} students</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
