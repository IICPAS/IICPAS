"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import {
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  Award,
  MessageSquare,
  Building,
  Briefcase,
  DollarSign,
} from "lucide-react";

const URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const CompanyDashboardOverview = () => {
  const [metrics, setMetrics] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    totalMessages: 0,
    repliedMessages: 0,
    totalSpent: 0,
  });

  // Add debugging for metrics state changes
  useEffect(() => {
    console.log("Metrics state updated:", metrics);
  }, [metrics]);

  // Remove unused ref
  const [loading, setLoading] = useState(true);
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyProfile, setCompanyProfile] = useState({
    name: "",
    email: "",
    image: "",
  });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchCompanyAndMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Remove this useEffect as it's causing conflicts

  const fetchCompanyAndMetrics = async () => {
    try {
      console.log("Starting fetchCompanyAndMetrics...");

      // Fetch company profile
      console.log("Attempting to fetch company profile...");
      const companyRes = await axios.get(`${URL}/api/companies/iscompany`, {
        withCredentials: true,
      });

      console.log("Company response:", companyRes.data);
      console.log("Company response status:", companyRes.status);

      if (companyRes.data.company) {
        const company = companyRes.data.company;
        const email = company.email || "";
        console.log("Company email set to:", email);

        setCompanyProfile({
          name: company.name || company.companyName || "",
          email: email,
          image: company.image || company.logo || "",
        });
        setCompanyEmail(email);
        console.log("Company email set to:", email);

        // Only fetch metrics if we have an email
        if (email) {
          console.log("Email found, fetching metrics...");
          console.log("About to call fetchAllJobs with email:", email);

          // Call functions sequentially for better debugging
          await fetchAllJobs(email);
          console.log("fetchAllJobs completed");

          await fetchAllApplications(email);
          console.log("fetchAllApplications completed");

          await fetchAllBookings(email);
          console.log("fetchAllBookings completed");

          await fetchAllMessages(email);
          console.log("fetchAllMessages completed");

          await fetchAllTransactions(email);
          console.log("fetchAllTransactions completed");

          console.log("All fetch functions completed");
          console.log("Final metrics state:", metrics);
        } else {
          console.log("No email found, skipping metrics fetch");
        }
      } else {
        console.log("No company data found in response");
      }
    } catch (error) {
      console.error("Error fetching company dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllJobs = async (email?: string) => {
    try {
      console.log("=== fetchAllJobs START ===");
      console.log("Fetching all jobs (internal + external)");

      // Fetch both internal and external jobs
      const [internalJobsRes, externalJobsRes] = await Promise.all([
        axios.get(`${URL}/api/jobs-internal`),
        axios.get(`${URL}/api/jobs-external`)
      ]);

      // Combine both job types
      const internalJobs = internalJobsRes.data || [];
      const externalJobs = externalJobsRes.data || [];
      const allJobs = [...internalJobs, ...externalJobs];
      
      console.log("Internal jobs:", internalJobs);
      console.log("External jobs:", externalJobs);
      console.log("All jobs combined:", allJobs);

      // Calculate metrics from all jobs (both internal and external)
      console.log("All jobs for metrics calculation:", allJobs);

      // Count active jobs (both internal and external)
      const activeJobs = allJobs.filter(
        (job: { status?: string }) => job.status === "active" || job.status === undefined
      ).length;

      // Count remote jobs (jobs with location containing "remote" or similar)
      const remoteJobs = allJobs.filter(
        (job: { location?: string }) => 
          job.location && job.location.toLowerCase().includes("remote")
      ).length;

      console.log("Active jobs count:", activeJobs);
      console.log("Remote jobs count:", remoteJobs);

      setMetrics((prevMetrics) => {
        const newMetrics = {
          ...prevMetrics,
          totalJobs: allJobs.length,
          activeJobs: activeJobs,
          remoteJobs: remoteJobs,
        };
        console.log("Setting job metrics:", newMetrics);
        return newMetrics;
      });
      console.log("=== fetchAllJobs END ===");
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const fetchAllApplications = async (email?: string) => {
    try {
      const targetEmail = email || companyEmail;
      console.log("Fetching applications for company email:", targetEmail);
      console.log("Company email from state:", companyEmail);
      console.log("Target email:", targetEmail);
      
      // First try with the company's email
      let companyApplications = [];
      try {
        const res = await axios.get(`${URL}/api/apply/jobs-external/company/${targetEmail}`);
        companyApplications = res.data || [];
        console.log("Company applications received:", companyApplications.length);
      } catch (primaryError) {
        console.log("Primary email failed, trying fallback...");
      }
      
      // Always try fallback with admin@iicpa.com to get all applications
      try {
        console.log("Trying fallback with admin@iicpa.com...");
        const fallbackRes = await axios.get(`${URL}/api/apply/jobs-external/company/admin@iicpa.com`);
        const fallbackApplications = fallbackRes.data || [];
        console.log("Fallback applications received:", fallbackApplications.length);
        
        // Combine applications and remove duplicates
        const allApplications = [...companyApplications];
        fallbackApplications.forEach(app => {
          if (!allApplications.find(existing => existing._id === app._id)) {
            allApplications.push(app);
          }
        });
        
        console.log("Total unique applications:", allApplications.length);

        const pendingApplications = allApplications.filter(
          (app: { status: string }) => app.status === "pending"
        ).length;
        const approvedApplications = allApplications.filter(
          (app: { status: string }) => app.status === "approved" || app.status === "shortlisted"
        ).length;

        setMetrics((prevMetrics) => ({
          ...prevMetrics,
          totalApplications: allApplications.length,
          pendingApplications: pendingApplications,
          approvedApplications: approvedApplications,
        }));
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
        // Use only company applications if fallback fails
        const pendingApplications = companyApplications.filter(
          (app: { status: string }) => app.status === "pending"
        ).length;
        const approvedApplications = companyApplications.filter(
          (app: { status: string }) => app.status === "approved" || app.status === "shortlisted"
        ).length;

        setMetrics((prevMetrics) => ({
          ...prevMetrics,
          totalApplications: companyApplications.length,
          pendingApplications: pendingApplications,
          approvedApplications: approvedApplications,
        }));
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      // Set applications to 0 if all attempts fail
      setMetrics((prevMetrics) => ({
        ...prevMetrics,
        totalApplications: 0,
        pendingApplications: 0,
        approvedApplications: 0,
      }));
    }
  };

  const fetchAllBookings = async (email?: string) => {
    try {
      const targetEmail = email || companyEmail;
      console.log("Fetching bookings for company email:", targetEmail);
      const res = await axios.get(`${URL}/api/bookings`);
      const allBookings = res.data || [];

      console.log("All bookings received:", allBookings);

      // Filter bookings by company email
      const companyBookings = allBookings.filter((booking: { by: string }) => {
        console.log("Checking booking:", booking.by, "against:", targetEmail);
        return booking.by === targetEmail;
      });

      console.log("Filtered company bookings:", companyBookings);

      const completedBookings = companyBookings.filter(
        (booking: { status: string; start?: string }) =>
          booking.status === "booked" ||
          booking.status === "completed" ||
          (booking.start && new Date(booking.start) < new Date())
      ).length;

      const pendingBookings = companyBookings.filter(
        (booking: { status: string }) => booking.status === "pending"
      ).length;

      console.log("Completed bookings:", completedBookings);
      console.log("Pending bookings:", pendingBookings);

      setMetrics((prevMetrics) => {
        const newMetrics = {
          ...prevMetrics,
          totalBookings: companyBookings.length,
          completedBookings: completedBookings,
          pendingBookings: pendingBookings,
        };
        console.log("Setting booking metrics:", newMetrics);
        return newMetrics;
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchAllMessages = async (email?: string) => {
    try {
      const targetEmail = email || companyEmail;
      const res = await axios.get(`${URL}/api/messages/all`);
      const allMessages = res.data.data || [];

      // Filter messages by company email
      const companyMessages = allMessages.filter(
        (message: { email: string }) => message.email === targetEmail
      );

      const repliedMessages = companyMessages.filter(
        (message: { status: string }) => message.status === "replied"
      ).length;

      setMetrics((prevMetrics) => {
        const newMetrics = {
          ...prevMetrics,
          totalMessages: companyMessages.length,
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
      const targetEmail = email || companyEmail;
      console.log("Fetching transactions for company email:", targetEmail);
      const res = await axios.get(`${URL}/api/payments/all-transactions`);
      const allTransactions = res.data || [];

      console.log("All transactions received:", allTransactions);

      // Filter transactions by company email
      const companyTransactions = allTransactions.filter(
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

      console.log("Filtered company transactions:", companyTransactions);
      setTransactions(companyTransactions);

      const totalSpent = companyTransactions.reduce(
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

  const metricCards = [
    {
      title: "Total Jobs Posted",
      value: metrics.totalJobs,
      icon: Briefcase,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Jobs",
      value: metrics.activeJobs,
      icon: Building,
      color: "bg-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Applications",
      value: metrics.totalApplications,
      icon: Users,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "Pending Applications",
      value: metrics.pendingApplications,
      icon: Clock,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Approved Applications",
      value: metrics.approvedApplications,
      icon: CheckCircle2,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Total Bookings",
      value: metrics.totalBookings,
      icon: Calendar,
      color: "bg-indigo-500",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Confirmed Bookings",
      value: metrics.completedBookings,
      icon: Award,
      color: "bg-teal-500",
      bgColor: "bg-teal-50",
    },
    {
      title: "Total Spent",
      value: `₹${(metrics.totalSpent && typeof metrics.totalSpent === 'number') ? metrics.totalSpent.toLocaleString() : "0"}`,
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
                Company Dashboard Overview
              </h1>
              <p className="text-gray-600">
                Welcome back! Here&lsquo;s your company activity summary and key
                metrics.
              </p>
            </div>

            {/* Company Profile Section */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  {companyProfile.name || "Company"}
                </p>
                <p className="text-sm text-gray-500">{companyProfile.email}</p>
              </div>

              {/* Company Logo/Image */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center overflow-hidden">
                  {companyProfile.image ? (
                    <Image
                      src={`${URL}/${companyProfile.image}`}
                      alt="Company Logo"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      onError={() => {
                        console.log(
                          "Company image failed to load:",
                          `${URL}/${companyProfile.image}`
                        );
                      }}
                    />
                  ) : null}

                  {/* Fallback icon - shown when no image or image fails to load */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center ${
                      companyProfile.image ? "hidden" : ""
                    }`}
                  >
                    <Building size={24} className="text-white" />
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
                <p className="text-blue-100 text-sm font-medium">Active Jobs</p>
                <p className="text-2xl font-bold">{metrics.activeJobs}</p>
              </div>
              <Briefcase size={32} className="text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">
                  Pending Applications
                </p>
                <p className="text-2xl font-bold">
                  {metrics.pendingApplications}
                </p>
              </div>
              <Users size={32} className="text-green-200" />
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
                <Briefcase size={16} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {metrics.totalJobs} jobs posted
                </p>
                <p className="text-xs text-gray-500">
                  {metrics.activeJobs} active,{" "}
                  {metrics.totalJobs - metrics.activeJobs} inactive
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="bg-green-100 p-2 rounded-full">
                <Users size={16} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {metrics.totalApplications} applications received
                </p>
                <p className="text-xs text-gray-500">
                  {metrics.approvedApplications} approved,{" "}
                  {metrics.pendingApplications} pending
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="bg-orange-100 p-2 rounded-full">
                <Calendar size={16} className="text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {metrics.totalBookings} bookings made
                </p>
                <p className="text-xs text-gray-500">
                  {metrics.completedBookings} confirmed,{" "}
                  {metrics.pendingBookings} pending
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
                          ₹{(transaction.amount && typeof transaction.amount === 'number') ? transaction.amount.toLocaleString() : "0"}
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

export default CompanyDashboardOverview;
