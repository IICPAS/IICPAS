"use client";

import { useState } from "react";

const stats = {
  completedWithTest: 0,
  completedWithoutTest: 14,
  notCompleted: 1,
};

const certificates = []; // Replace with your actual data if available

export default function CertificateTab() {
  return (
    <div className="min-h-[calc(100vh-80px)] px-6 py-8 bg-[#0f1624] text-white overflow-y-auto">
      <h1 className="text-2xl font-semibold mb-8">Download Certificates</h1>

      {/* Stats */}
      <div className="space-y-2 mb-8">
        <p>Courses Completed with Test Taken: {stats.completedWithTest}</p>
        <p>
          Courses Completed with Test Not Taken: {stats.completedWithoutTest}
        </p>
        <p>Courses Not Completed: {stats.notCompleted}</p>
      </div>

      {/* Certificates Display */}
      {stats.completedWithTest > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, idx) => (
            <div
              key={idx}
              className="bg-white text-black p-4 rounded-xl shadow-md border"
            >
              <h3 className="font-semibold text-lg">{cert.courseTitle}</h3>
              <p className="text-sm mt-2 mb-4">
                Completed on: {cert.completedDate}
              </p>
              <a
                href={cert.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition"
              >
                Download Certificate
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-10">
          <p className="text-gray-300">No certificates available yet.</p>
          <button
            className="mt-6 px-6 py-2 border border-white rounded-full text-sm hover:bg-white hover:text-black transition"
            onClick={() => (window.location.href = "/student-dashboard")}
          >
            Back to Courses
          </button>
        </div>
      )}
    </div>
  );
}
