"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import {
  Users,
  Clock,
  CheckCircle2,
  MessageSquare,
  DollarSign,
  GraduationCap,
  BookOpen,
  FileText,
} from "lucide-react";

const URL = process.env.NEXT_PUBLIC_URL || "http://localhost:8080";

const CollegeDashboardOverview = () => {
  const [metrics, setMetrics] = useState({
    totalCertifications: 0,
    pendingCertifications: 0,
    approvedCertifications: 0,
    totalTickets: 0,
    totalMessages: 0,
    repliedMessages: 0,
    totalSpent: 0,
    pendingTrainings: 0,
    confirmedTrainings: 0,
  });

  // Add debugging for metrics state changes
  useEffect(() => {
    console.log("College metrics state updated:", metrics);
  }, [metrics]);

  const [loading, setLoading] = useState(true);
  const [collegeEmail, setCollegeEmail] = useState("");
  const [collegeProfile, setCollegeProfile] = useState({
    name: "",
    email: "",
    image: "",
  });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchCollegeAndMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCollegeAndMetrics = async () => {
    try {
      console.log("Starting fetchCollegeAndMetrics...");

      // Fetch college profile
      console.log("Attempting to fetch college profile...");
      const collegeRes = await axios.get(`${URL}/api/college/isCollege`, {
        withCredentials: true,
      });

      console.log("College response:", collegeRes.data);
      console.log("College response status:", collegeRes.status);

      if (collegeRes.data.user || collegeRes.data.college) {
        const college = collegeRes.data.user || collegeRes.data.college;
        const email = college.email || "";
        console.log("College email set to:", email);

        setCollegeProfile({
          name:
            college.name ||
            college.collegeName ||
            college.institutionName ||
            "",
          email: email,
          image: college.image || college.logo || "",
        });
        setCollegeEmail(email);
        console.log("College email set to:", email);

        // Only fetch metrics if we have an email
        if (email) {
          console.log("Email found, fetching metrics...");
          console.log("About to call fetch functions with email:", email);

          // Call functions sequentially for better debugging
          await fetchAllCertifications(email);
          console.log("fetchAllCertifications completed");

          await fetchAllTickets(email);
          console.log("fetchAllTickets completed");

          await fetchAllMessages(email);
          console.log("fetchAllMessages completed");

          await fetchAllTransactions(email);
          console.log("fetchAllTransactions completed");

          await fetchAllTrainings(email);
          console.log("fetchAllTrainings completed");

          console.log("All fetch functions completed");
          console.log("Final metrics state:", metrics);
        } else {
          console.log("No email found, skipping metrics fetch");
        }
      } else {
        console.log("No college data found in response");
      }
    } catch (error) {
      console.error("Error fetching college dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCertifications = async (email?: string) => {
    try {
      const targetEmail = email || collegeEmail;
      console.log("=== fetchAllCertifications START ===");
      console.log("Fetching certifications for college email:", targetEmail);

      if (!targetEmail) {
        console.log("No email provided, skipping certification fetch");
        return;
      }

      // Fetch all certifications
      const res = await axios.get(`${URL}/api/certification-requests`);
      const allCertifications = res.data || [];
      console.log("All certifications received:", allCertifications);

      // Filter certifications by college email
      const collegeCertifications = allCertifications.filter(
        (cert: { collegeEmail?: string; email?: string; college?: string }) => {
          console.log(
            "Checking certification:",
            cert.collegeEmail || cert.email || cert.college,
            "targetEmail:",
            targetEmail,
            "match:",
            cert.collegeEmail === targetEmail ||
              cert.email === targetEmail ||
              cert.college === targetEmail
          );
          return (
            cert.collegeEmail === targetEmail ||
            cert.email === targetEmail ||
            cert.college === targetEmail
          );
        }
      );

      console.log("Filtered college certifications:", collegeCertifications);

      const pendingCertifications = collegeCertifications.filter(
        (cert: { status?: string }) => !cert.status || cert.status === "pending"
      ).length;

      const approvedCertifications = collegeCertifications.filter(
        (cert: { status?: string }) => cert.status === "approved"
      ).length;

      console.log("Pending certifications:", pendingCertifications);
      console.log("Approved certifications:", approvedCertifications);

      setMetrics((prevMetrics) => {
        const newMetrics = {
          ...prevMetrics,
          totalCertifications: collegeCertifications.length,
          pendingCertifications: pendingCertifications,
          approvedCertifications: approvedCertifications,
        };
        console.log("Setting certification metrics:", newMetrics);
        return newMetrics;
      });
      console.log("=== fetchAllCertifications END ===");
    } catch (error) {
      console.error("Error fetching certifications:", error);
    }
  };

  const fetchAllTickets = async (email?: string) => {
    try {
      const targetEmail = email || collegeEmail;
      console.log("Fetching tickets for college email:", targetEmail);
      const res = await axios.get(
        `${URL}/api/messages/by-email/${targetEmail}`
      );
      const allTickets = res.data.data || [];

      console.log("All tickets received:", allTickets);

      // Filter tickets by college email
      const collegeTickets = allTickets.filter((ticket: { email: string }) => {
        console.log("Checking ticket:", ticket.email, "against:", targetEmail);
        return ticket.email === targetEmail;
      });

      console.log("Filtered college tickets:", collegeTickets);

      setMetrics((prevMetrics) => {
        const newMetrics = {
          ...prevMetrics,
          totalTickets: collegeTickets.length,
        };
        console.log("Setting ticket metrics:", newMetrics);
        return newMetrics;
      });
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const fetchAllMessages = async (email?: string) => {
    try {
      const targetEmail = email || collegeEmail;
      const res = await axios.get(`${URL}/api/messages/all`);
      const allMessages = res.data.data || [];

      // Filter messages by college email
      const collegeMessages = allMessages.filter(
        (message: { email: string }) => message.email === targetEmail
      );

      const repliedMessages = collegeMessages.filter(
        (message: { status: string }) => message.status === "replied"
      ).length;

      setMetrics((prevMetrics) => {
        const newMetrics = {
          ...prevMetrics,
          totalMessages: collegeMessages.length,
          repliedMessages: repliedMessages,
        };
        console.log("Setting message metrics:", newMetrics);
        return newMetrics;
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchAllTransactions = async (email?: string) => {
    try {
      const targetEmail = email || collegeEmail;
      console.log("Fetching transactions for college email:", targetEmail);
      const res = await axios.get(`${URL}/api/payments/all-transactions`);
      const allTransactions = res.data || [];

      console.log("All transactions received:", allTransactions);

      // Filter transactions by college email
      const collegeTransactions = allTransactions.filter(
        (transaction: { email: string }) => {
          console.log(
            "Checking transaction:",
            transaction.email,
            "against:",
            targetEmail
          );
          return transaction.email === targetEmail;
        }
      );

      console.log("Filtered college transactions:", collegeTransactions);
      setTransactions(collegeTransactions);

      const totalSpent = collegeTransactions.reduce(
        (sum: number, transaction: { amount?: number }) => {
          return sum + (transaction.amount || 0);
        },
        0
      );

      console.log("Total spent calculated:", totalSpent);

      setMetrics((prevMetrics) => {
        const newMetrics = {
          ...prevMetrics,
          totalSpent: totalSpent,
        };
        console.log("Setting transaction metrics:", newMetrics);
        return newMetrics;
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchAllTrainings = async (email?: string) => {
    try {
      console.log("Fetching all available trainings...");

      // Fetch all trainings/topics
      const res = await axios.get(`${URL}/api/v1/topics-trainings`);
      const allTrainings = res.data || [];

      console.log("All trainings received:", allTrainings);

      // Show all available trainings (not filtered by email since trainings are general)
      const availableTrainings = allTrainings.filter(
        (training: { status?: string }) => training.status === "active"
      );

      console.log("Available active trainings:", availableTrainings);

      // For college dashboard, show:
      // - Pending trainings: trainings that are active but not yet booked by this college
      // - Confirmed trainings: trainings that have been booked by this college
      const pendingTrainings = availableTrainings.length; // All available trainings are pending until booked
      const confirmedTrainings = 0; // This would need to be calculated from bookings

      setMetrics((prevMetrics) => {
        const newMetrics = {
          ...prevMetrics,
          pendingTrainings: pendingTrainings,
          confirmedTrainings: confirmedTrainings,
        };
        console.log("Setting training metrics:", newMetrics);
        return newMetrics;
      });
    } catch (error) {
      console.error("Error fetching trainings:", error);
    }
  };

  const metricCards = [
    {
      title: "Total Certifications",
      value: metrics.totalCertifications,
      icon: FileText,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Certifications",
      value: metrics.pendingCertifications,
      icon: Clock,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Approved Certifications",
      value: metrics.approvedCertifications,
      icon: CheckCircle2,
      color: "bg-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Tickets",
      value: metrics.totalTickets,
      icon: MessageSquare,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Messages",
      value: metrics.totalMessages,
      icon: Users,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Upcoming Trainings",
      value: metrics.pendingTrainings,
      icon: BookOpen,
      color: "bg-indigo-500",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Booked Trainings",
      value: metrics.confirmedTrainings,
      icon: GraduationCap,
      color: "bg-teal-500",
      bgColor: "bg-teal-50",
    },
    {
      title: "Total Spent",
      value: `₹${metrics.totalSpent.toLocaleString()}`,
      icon: DollarSign,
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
    <div className="min-h-screen bg-gray-50 p-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                College Dashboard Overview
              </h1>
              <p className="text-gray-600">
                Welcome back! Here&lsquo;s your college activity summary and key
                metrics.
              </p>
            </div>

            {/* College Profile Section */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  {collegeProfile.name || "College"}
                </p>
                <p className="text-sm text-gray-500">{collegeProfile.email}</p>
              </div>

              {/* College Logo/Image */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden">
                  {collegeProfile.image ? (
                    <Image
                      src={`${URL}/${collegeProfile.image}`}
                      alt="College Logo"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      onError={() => {
                        console.log(
                          "College image failed to load:",
                          `${URL}/${collegeProfile.image}`
                        );
                      }}
                    />
                  ) : null}

                  {/* Fallback icon - shown when no image or image fails to load */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center ${
                      collegeProfile.image ? "hidden" : ""
                    }`}
                  >
                    <GraduationCap size={24} className="text-white" />
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
                    {Icon ? (
                      <Icon className={`${card.color} text-white`} size={24} />
                    ) : (
                      <div
                        className={`${card.color} text-white w-6 h-6 rounded-full flex items-center justify-center`}
                      >
                        ?
                      </div>
                    )}
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
                  Pending Certifications
                </p>
                <p className="text-2xl font-bold">
                  {metrics.pendingCertifications}
                </p>
              </div>
              <FileText size={32} className="text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">
                  Total Messages
                </p>
                <p className="text-2xl font-bold">{metrics.totalMessages}</p>
              </div>
              <MessageSquare size={32} className="text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">
                  Response Rate
                </p>
                <p className="text-2xl font-bold">
                  {metrics.totalMessages > 0
                    ? Math.round(
                        (metrics.repliedMessages / metrics.totalMessages) * 100
                      )
                    : 0}
                  %
                </p>
              </div>
              <MessageSquare size={32} className="text-purple-200" />
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
                <FileText size={16} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {metrics.totalCertifications} certification requests
                </p>
                <p className="text-xs text-gray-500">
                  {metrics.approvedCertifications} approved,{" "}
                  {metrics.pendingCertifications} pending
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="bg-green-100 p-2 rounded-full">
                <MessageSquare size={16} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {metrics.totalTickets} tickets raised
                </p>
                <p className="text-xs text-gray-500">
                  {metrics.totalMessages} messages sent
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="bg-orange-100 p-2 rounded-full">
                <BookOpen size={16} className="text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {metrics.pendingTrainings} upcoming trainings
                </p>
                <p className="text-xs text-gray-500">
                  {metrics.confirmedTrainings} booked
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Recent Transactions
          </h3>
          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions
                .slice(0, 5)
                .map(
                  (transaction: {
                    _id: string;
                    for: string;
                    createdAt: string;
                    amount?: number;
                    status: string;
                  }) => (
                    <div
                      key={transaction._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <DollarSign size={16} className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.for}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(
                              transaction.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600">
                          ₹{transaction.amount?.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                  )
                )}
            </div>
          ) : (
            <div className="text-center py-8">
              <DollarSign size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollegeDashboardOverview;
