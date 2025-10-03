"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Video, Clock, User, Play, CheckCircle } from "lucide-react";
import axios from "axios";

interface LiveClass {
  _id: string;
  title: string;
  subtitle?: string;
  instructor: string;
  instructorBio?: string;
  description: string;
  startTime: string;
  endTime: string;
  date: string;
  duration: number;
  maxParticipants: number;
  enrolledCount?: number;
  status: "upcoming" | "live" | "completed" | "active" | "inactive";
  meetingLink?: string;
  thumbnail?: string;
  imageUrl?: string;
  price: number;
  category: string;
  isEnrolled?: boolean;
}

interface User {
  _id: string;
  name?: string;
  email?: string;
}

export default function LiveClassesDisplay() {
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [selectedTab, setSelectedTab] = useState<
    "upcoming" | "live" | "completed"
  >("upcoming");
  const [user, setUser] = useState<User | null>(null);

  const API = process.env.NEXT_PUBLIC_API_URL;

  const getUser = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/api/v1/students/isstudent`, {
        withCredentials: true,
      });
      if (response.data?.student) {
        setUser(response.data.student);
        return response.data.student;
      }
      return null;
    } catch (error) {
      console.log("Not logged in or not a student");
      setUser(null);
      return null;
    }
  }, [API]);

  useEffect(() => {
    const fetchData = async () => {
      await getUser();

      try {
        const response = await fetch(`${API}/api/live-sessions`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();

          const transformedClasses = data.map((session: any) => ({
            _id: session._id,
            title: session.title,
            subtitle: session.subtitle || session.category,
            instructor: session.instructor || "CA Instructor",
            instructorBio: session.instructorBio || "Expert CA Instructor",
            description: session.description || "Live class session",
            startTime: session.time ? session.time.split(" - ")[0] : "10:00",
            endTime: session.time ? session.time.split(" - ")[1] : "12:00",
            date: session.date,
            duration: session.duration || 120,
            maxParticipants: session.maxParticipants || 50,
            enrolledCount: session.enrolledCount || 0,
            status: session.status,
            meetingLink: session.link,
            thumbnail: session.thumbnail || "/images/live-class.jpg",
            imageUrl:
              session.imageUrl || session.thumbnail || "/images/live-class.jpg",
            price: session.price || 0,
            category: session.category || "CA Foundation",
            isEnrolled: user
              ? session.enrolledStudents?.some(
                  (student: any) => student._id === user._id
                )
              : false,
          }));

          setLiveClasses(transformedClasses);
        } else {
          console.error("API request failed with status:", response.status);
          setLiveClasses([
            {
              _id: "1",
              title: "GST Updates & Compliance",
              instructor: "CA Rajesh Kumar",
              description: "Learn about the latest GST updates",
              startTime: "11:00 AM",
              endTime: "12:00 PM",
              date: "2025-01-15T00:00:00.000Z",
              duration: 60,
              maxParticipants: 50,
              enrolledCount: 0,
              status: "upcoming",
              price: 1500,
              category: "Taxation",
              isEnrolled: false,
            },
            {
              _id: "2",
              title: "TDS Computation Masterclass",
              instructor: "CA Priya Sharma",
              description: "Master TDS computation with practical examples",
              startTime: "2:00 PM",
              endTime: "3:30 PM",
              date: "2025-01-20T00:00:00.000Z",
              duration: 90,
              maxParticipants: 40,
              enrolledCount: 0,
              status: "upcoming",
              price: 2000,
              category: "Taxation",
              isEnrolled: false,
            },
          ]);
        }
      } catch (error: any) {
        console.error("Error fetching live classes:", error);
        setLiveClasses([
          {
            _id: "1",
            title: "Sample Live Session",
            instructor: "CA Expert",
            description: "Interactive live session",
            startTime: "10:00 AM",
            endTime: "11:00 AM",
            date: "2025-01-15T00:00:00.000Z",
            duration: 60,
            maxParticipants: 50,
            enrolledCount: 0,
            status: "upcoming",
            price: 1500,
            category: "General",
            isEnrolled: false,
          },
        ]);
      }
    };

    fetchData();
  }, [API, getUser]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "Time TBD";
    const [hour, minute] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "live":
        return (
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        );
      case "upcoming":
        return <Clock className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "active":
        return <Play className="w-4 h-4" />;
      default:
        return <AlertOctagon className="w-4 h-4" />;
    }
  };

  const filteredClasses = liveClasses.filter((session) => {
    if (selectedTab === "upcoming") {
      return session.status === "upcoming" || session.status === "active";
    }
    return session.status === selectedTab;
  });

  return (
    <div className="py-8 px-4">
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mx-auto mb-8">
        {(["upcoming", "live", "completed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
              selectedTab === tab
                ? "bg-white text-[#3cd664] shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className="ml-1 text-xs">
              (
              {
                liveClasses.filter((s) => {
                  if (tab === "upcoming")
                    return s.status === "upcoming" || s.status === "active";
                  return s.status === tab;
                }).length
              }
              )
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
        {filteredClasses.map((session) => (
          <motion.div
            key={session._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex justify-between items-start mb-3">
              <div
                className={`flex items-center space-x-1 px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(
                  session.status
                )}`}
              >
                {getStatusIcon(session.status)}
                <span>
                  {session.status.charAt(0).toUpperCase() +
                    session.status.slice(1)}
                </span>
              </div>

              {session.price > 0 && (
                <span className="bg-[#3cd664] text-white px-2 py-1 rounded-md text-sm font-semibold">
                  ₹{session.price.toLocaleString()}
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
                  {session.title}
                </h3>
              </div>

              {session.instructor && (
                <div className="flex items-center">
                  <User className="w-3 h-3 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-600">
                    {session.instructor}
                  </span>
                </div>
              )}

              <div>
                <div className="text-xs text-gray-600">
                  {formatDate(session.date)}
                </div>
                <div className="text-xs font-medium text-gray-700">
                  {formatTime(session.startTime)} -{" "}
                  {formatTime(session.endTime)}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600">
                <div>
                  {session.enrolledCount || 0}/{session.maxParticipants}{" "}
                  enrolled
                </div>
                <div>{session.duration || 120}min</div>
              </div>

              {session.category && (
                <div className="mb-3">
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                    {session.category}
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-gray-100">
                <button className="w-full bg-[#3cd664] text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#33bb58] transition-colors duration-200 flex items-center justify-center space-x-1">
                  {session.status === "live" ? (
                    <>
                      <Video className="w-3 h-3" />
                      <span>Join Session</span>
                    </>
                  ) : session.isEnrolled ? (
                    <>
                      <CheckCircle className="w-3 h-3" />
                      <span>Enrolled</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      <span>Enroll Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center text-xs text-gray-500 flex items-center justify-center space-x-2 mt-6">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
        <span>Live updates enabled</span>
      </div>
    </div>
  );
}
