"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FaCheckCircle,
  FaUserGraduate,
  FaUsers,
  FaChalkboardTeacher,
} from "react-icons/fa";

const HiristTab = () => {
  const [stats] = useState({
    shortlisted: 38,
    hired: 14,
    trainingRequested: 22,
    studentsTrained: 18,
  });

  const chartData = [
    { name: "Shortlisted", value: stats.shortlisted },
    { name: "Hired", value: stats.hired },
    { name: "Training Req.", value: stats.trainingRequested },
    { name: "Trained", value: stats.studentsTrained },
  ];

  const cards = [
    {
      label: "Students Shortlisted",
      value: stats.shortlisted,
      icon: <FaUsers className="text-blue-500 text-2xl" />,
      bg: "bg-blue-50",
    },
    {
      label: "Students Hired",
      value: stats.hired,
      icon: <FaCheckCircle className="text-green-500 text-2xl" />,
      bg: "bg-green-50",
    },
    {
      label: "Training Requests",
      value: stats.trainingRequested,
      icon: <FaChalkboardTeacher className="text-yellow-500 text-2xl" />,
      bg: "bg-yellow-50",
    },
    {
      label: "Students Trained",
      value: stats.studentsTrained,
      icon: <FaUserGraduate className="text-purple-500 text-2xl" />,
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        📊 Hirist Dashboard
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`rounded-lg shadow-md p-4 flex items-center gap-4 ${card.bg}`}
          >
            <div className="p-2 rounded-full bg-white shadow">{card.icon}</div>
            <div>
              <div className="text-lg font-semibold text-gray-800">
                {card.value}
              </div>
              <div className="text-sm text-gray-600">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Analytics Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HiristTab;
