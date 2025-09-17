"use client";

import { FaCalendarAlt } from "react-icons/fa";

export default function OurClassDay() {
  const classDays = [
    { day: "Saturday", time: "10:00-16:00" },
    { day: "Sunday", time: "10:00-16:00" },
    { day: "Monday", time: "10:00-16:00" },
    { day: "Tuesday", time: "10:00-16:00" },
    { day: "Wednesday", time: "10:00-16:00" },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-3">Our Class Day</h3>
      <div className="bg-gradient-to-b from-blue-600 to-blue-500 rounded-2xl p-6 shadow-lg relative overflow-hidden">
        {/* Background blur effect */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl"></div>
        
        {/* Header */}
        <div className="relative z-10 flex items-center mb-4">
          <FaCalendarAlt className="text-white text-2xl mr-3" />
          <h4 className="text-white text-xl font-bold">Our Class Day</h4>
        </div>
        
        {/* Schedule List */}
        <div className="relative z-10 space-y-3">
          {classDays.map((schedule, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-white font-medium">{schedule.day}</span>
              <span className="bg-blue-400/30 text-white px-3 py-1 rounded-full text-sm font-medium">
                {schedule.time}
              </span>
            </div>
          ))}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-10 translate-x-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
      </div>
    </div>
  );
}
