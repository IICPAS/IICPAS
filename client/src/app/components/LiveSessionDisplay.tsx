"use client";

import React, { useState, useEffect } from "react";

interface LiveSession {
  _id: string;
  title: string;
  subtitle?: string;
  instructor?: string;
  instructorBio?: string;
  description?: string;
  time: string;
  date: string;
  link: string;
  price: number;
  category?: string;
  maxParticipants?: number;
  enrolledCount?: number;
  thumbnail?: string;
  imageUrl?: string;
  status: string;
  duration?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.iicpa.in";

export default function LiveSessionDisplay() {
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLiveSessions();
  }, []);

  const fetchLiveSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/live-sessions`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Raw API data:", data);

      // Filter sessions (include all statuses except inactive)
      const activeSessions = data.filter(
        (session: LiveSession) =>
          session.status === "active" ||
          session.status === "upcoming" ||
          session.status === "live" ||
          session.status === "completed"
      );

      console.log("Filtered sessions:", activeSessions);
      setLiveSessions(activeSessions);
    } catch (error) {
      console.error("Error fetching live sessions:", error);
      setError("Failed to load live sessions");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "Time TBD";
    return timeString;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-100 text-red-800 border-red-200";
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3cd664]"></div>
        <span className="ml-2 text-gray-600">Loading live sessions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchLiveSessions}
          className="px-4 py-2 bg-[#3cd664] text-white rounded-lg hover:bg-[#33bb58] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (liveSessions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Live Sessions Available
        </h3>
        <p className="text-gray-600">
          Check back later for upcoming live sessions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Live Sessions</h3>
        <span className="text-sm text-gray-500">
          {liveSessions.length} session{liveSessions.length !== 1 ? "s" : ""}{" "}
          available
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {liveSessions.map((session) => (
          <div
            key={session._id}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 relative"
          >
            {/* Status Badge */}
            <div className="absolute top-3 right-3 z-10">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                  session.status
                )}`}
              >
                {session.status.charAt(0).toUpperCase() +
                  session.status.slice(1)}
              </span>
            </div>

            {/* Session Content */}
            <div className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {session.title}
              </h4>

              {session.subtitle && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {session.subtitle}
                </p>
              )}

              {/* Instructor */}
              {session.instructor && (
                <div className="flex items-center mb-3">
                  <svg
                    className="w-4 h-4 text-gray-400 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">
                    Instructor: {session.instructor}
                  </span>
                </div>
              )}

              {/* Date & Time */}
              <div className="flex items-center mb-3">
                <svg
                  className="w-4 h-4 text-gray-400 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-gray-600">
                  {formatDate(session.date)} at {formatTime(session.time)}
                </span>
              </div>

              {/* Category */}
              {session.category && (
                <div className="flex items-center mb-3">
                  <svg
                    className="w-4 h-4 text-gray-400 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">
                    Category: {session.category}
                  </span>
                </div>
              )}

              {/* Participants */}
              {session.maxParticipants && (
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 text-gray-400 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                  <span className="text-sm text-gray-600">
                    Max Participants: {session.maxParticipants}
                    {session.enrolledCount && (
                      <span className="text-gray-500 ml-1">
                        ({session.enrolledCount} enrolled)
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
