// pages/college/certification-requests.tsx
"use client";

import React, { useState } from "react";

export default function CertificationRequests() {
  const [requests, setRequests] = useState([
    { id: 1, partner: "TechCorp", status: "Pending" },
    { id: 2, partner: "SkillEdge", status: "Approved" },
  ]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Partner Certification Requests
      </h2>
      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white p-4 rounded shadow flex items-center justify-between"
          >
            <div>
              <p className="text-gray-800 font-medium">
                Partner: {req.partner}
              </p>
              <p className="text-sm text-gray-500">Status: {req.status}</p>
            </div>
            <button className="text-blue-600 hover:underline text-sm">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
