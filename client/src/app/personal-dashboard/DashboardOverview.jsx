"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  GraduationCap,
  Calendar,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BookOpen,
  Award,
  MessageSquare,
  Ticket,
  User,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api";
const URL = process.env.NEXT_PUBLIC_URL || "http://localhost:8080";

const DashboardOverview = () => {
  const [metrics, setMetrics] = useState({
    enquiries: 0,
    pastTrainings: 0,
    scheduleTrainings: 0,
    tickets: 0,
    totalSpent: 0,
    completedTrainings: 0,
    pendingTrainings: 0,
    resolvedTickets: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    image: "",
  });

  useEffect(() => {
    fetchUserAndMetrics();
  }, []);

  const fetchUserAndMetrics = async () => {
    try {
      // Fetch user profile
      const userRes = await axios.get(`${API}/v1/individual/profile-valid`, {
        withCredentials: true,
      });

      if (userRes.data.success && userRes.data.user) {
        const user = userRes.data.user;
        setUserProfile({
          name: user.name || "",
          email: user.email || "",
          image: user.image || "",
        });
        setUserEmail(user.email || "");
      }

      if (userEmail) {
        await Promise.all([
          fetchEnquiries(userEmail),
          fetchTrainings(userEmail),
          fetchTickets(userEmail),
        ]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnquiries = async (email) => {
    try {
      const res = await axios.get(`${API}/tickets?email=${email}`);
      const enquiries = res.data || [];
      setMetrics((prev) => ({
        ...prev,
        enquiries: enquiries.length,
        resolvedTickets: enquiries.filter((t) => t.resolve).length,
      }));
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    }
  };

  const fetchTrainings = async (email) => {
    try {
      const res = await axios.get(`${API}/v1/bookings?email=${email}`);
      const trainings = res.data || [];

      const pastTrainings = trainings.filter(
        (t) => new Date(t.createdAt) < new Date() && t.status === "booked"
      ).length;

      const scheduleTrainings = trainings.filter(
        (t) => new Date(t.createdAt) >= new Date() && t.status === "booked"
      ).length;

      const completedTrainings = trainings.filter(
        (t) => t.status === "completed"
      ).length;
      const pendingTrainings = trainings.filter(
        (t) => t.status === "pending"
      ).length;

      setMetrics((prev) => ({
        ...prev,
        pastTrainings,
        scheduleTrainings,
        completedTrainings,
        pendingTrainings,
      }));
    } catch (error) {
      console.error("Error fetching trainings:", error);
    }
  };

  const fetchTickets = async (email) => {
    try {
      const res = await axios.get(`${API}/tickets?email=${email}`);
      const tickets = res.data || [];
      setMetrics((prev) => ({
        ...prev,
        tickets: tickets.length,
      }));
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const metricCards = [
    {
      title: "Total Enquiries",
      value: metrics.enquiries,
      icon: MessageSquare,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Past Trainings",
      value: metrics.pastTrainings,
      icon: BookOpen,
      color: "bg-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Schedule Trainings",
      value: metrics.scheduleTrainings,
      icon: Calendar,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Tickets",
      value: metrics.tickets,
      icon: Ticket,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      title: "Completed Trainings",
      value: metrics.completedTrainings,
      icon: CheckCircle2,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Pending Trainings",
      value: metrics.pendingTrainings,
      icon: Clock,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Resolved Tickets",
      value: metrics.resolvedTickets,
      icon: Award,
      color: "bg-indigo-500",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Total Spent",
      value: `₹${metrics.totalSpent.toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-red-500",
      bgColor: "bg-red-50",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard Overview
              </h1>
              <p className="text-gray-600">
                Welcome back! Here's your activity summary and key metrics.
              </p>
            </div>

            {/* User Profile Section */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  {userProfile.name || "User"}
                </p>
                <p className="text-sm text-gray-500">{userProfile.email}</p>
              </div>

              {/* Profile Image */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden">
                  {userProfile.image ? (
                    <img
                      src={`${URL}/${userProfile.image}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log(
                          "Profile image failed to load:",
                          `${URL}/${userProfile.image}`
                        );
                        e.target.style.display = "none";
                        e.target.nextElementSibling.style.display = "flex";
                      }}
                    />
                  ) : null}

                  {/* Fallback icon - shown when no image or image fails to load */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center ${
                      userProfile.image ? "hidden" : ""
                    }`}
                  >
                    <User size={24} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {card.value}
                    </p>
                  </div>
                  <div className={`${card.bgColor} p-3 rounded-full`}>
                    <Icon className={`${card.color} text-white`} size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">
                  Active Enquiries
                </p>
                <p className="text-2xl font-bold">
                  {metrics.enquiries - metrics.resolvedTickets}
                </p>
              </div>
              <MessageSquare size={32} className="text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">
                  Upcoming Trainings
                </p>
                <p className="text-2xl font-bold">
                  {metrics.scheduleTrainings}
                </p>
              </div>
              <Calendar size={32} className="text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">
                  Success Rate
                </p>
                <p className="text-2xl font-bold">
                  {metrics.pastTrainings > 0
                    ? Math.round(
                        (metrics.completedTrainings / metrics.pastTrainings) *
                          100
                      )
                    : 0}
                  %
                </p>
              </div>
              <TrendingUp size={32} className="text-purple-200" />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-full">
                <MessageSquare size={16} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {metrics.enquiries} enquiries submitted
                </p>
                <p className="text-xs text-gray-500">
                  {metrics.resolvedTickets} resolved,{" "}
                  {metrics.enquiries - metrics.resolvedTickets} pending
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="bg-green-100 p-2 rounded-full">
                <GraduationCap size={16} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {metrics.pastTrainings + metrics.scheduleTrainings} training
                  sessions
                </p>
                <p className="text-xs text-gray-500">
                  {metrics.completedTrainings} completed,{" "}
                  {metrics.pendingTrainings} pending
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="bg-orange-100 p-2 rounded-full">
                <Ticket size={16} className="text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {metrics.tickets} support tickets
                </p>
                <p className="text-xs text-gray-500">
                  {metrics.resolvedTickets} resolved,{" "}
                  {metrics.tickets - metrics.resolvedTickets} open
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
