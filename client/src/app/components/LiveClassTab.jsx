"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function LiveClassTab() {
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLiveClasses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/live-sessions`
        );
        setLiveClasses(response.data);
      } catch (err) {
        console.error("Error fetching live classes:", err);
        setError("Failed to load live classes");
      } finally {
        setLoading(false);
      }
    };

    fetchLiveClasses();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getSessionStatus = (session) => {
    const now = new Date();
    const sessionDate = new Date(session.date);
    const sessionTime = new Date(`2000-01-01T${session.time}`);

    // Combine date and time
    const sessionDateTime = new Date(sessionDate);
    sessionDateTime.setHours(sessionTime.getHours(), sessionTime.getMinutes());

    // Check if session is within 1 hour of now (live)
    const oneHourBefore = new Date(sessionDateTime.getTime() - 60 * 60 * 1000);
    const oneHourAfter = new Date(sessionDateTime.getTime() + 60 * 60 * 1000);

    if (now >= oneHourBefore && now <= oneHourAfter) {
      return "live";
    } else if (now < sessionDateTime) {
      return "upcoming";
    } else {
      return "completed";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] px-6 py-8 bg-white text-black overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-8">Live Classes</h1>
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500 text-lg">Loading live classes...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-80px)] px-6 py-8 bg-white text-black overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-8">Live Classes</h1>
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] px-6 py-8 bg-white text-black overflow-y-auto">
      <h1 className="text-2xl font-semibold mb-8">Live Classes</h1>

      {liveClasses.length === 0 ? (
        <p className="text-center text-gray-500">
          No live sessions available right now.
        </p>
      ) : (
        <div className="space-y-6">
          {liveClasses.map((cls) => {
            const status = getSessionStatus(cls);

            return (
              <div
                key={cls._id}
                className="bg-[#f8f9fa] p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <h3 className="text-lg font-bold text-blue-800">
                    {cls.title}
                  </h3>
                  <p className="text-sm mt-1 text-gray-700">
                    {formatDate(cls.date)} at {formatTime(cls.time)}
                  </p>
                  {cls.price > 0 && (
                    <p className="text-sm mt-1 text-green-600 font-medium">
                      Price: ₹{cls.price}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {/* Status Tag */}
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      status === "live"
                        ? "bg-red-100 text-red-600"
                        : status === "upcoming"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>

                  {/* Actions */}
                  {status === "live" && (
                    <a
                      href={cls.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium"
                    >
                      Join Now
                    </a>
                  )}

                  {status === "upcoming" && (
                    <button
                      disabled
                      className="bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-medium cursor-not-allowed"
                    >
                      Not Started
                    </button>
                  )}

                  {status === "completed" && cls.link && (
                    <a
                      href={cls.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium"
                    >
                      Watch Recording
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
