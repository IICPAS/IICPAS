"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ProfileTab() {
  const router = useRouter();

  const tabs = [
    "Basic Profile",
    "Job Profile",
    "Billing Information",
    "Notifications",
    "Account",
    "Tickets",
  ];

  const [activeTab, setActiveTab] = useState("Basic Profile");
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);

  // Fetch student data on mount
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE}/v1/students/isstudent`,
          { withCredentials: true }
        );

        console.log(res);
        setStudent({
          name: res.data.student.name,
          email: res.data.student.email,
          phone: res.data.student.phone || "",
        });
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/student-login");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/v1/students/logout`, {
        withCredentials: true,
      });
      router.push("/student-login");
    } catch (err) {
      console.error("Logout error", err);
      alert("Logout failed");
    }
  };

  // Fetch tickets
  const fetchTickets = async () => {
    if (!student.email) return;

    setTicketsLoading(true);

    // Show mock tickets for now
    const mockTickets = [
      {
        _id: "mock1",
        name: "Aritra Chakraborty",
        email: "aritra.chakraborty203@gmail.com",
        phone: "07585824862",
        message:
          "I have an issue with my course access. The videos are not loading properly and I need help to resolve this technical problem.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        resolve:
          "We have identified the issue and are working on a fix. Please try clearing your browser cache and let us know if the problem persists.",
      },
      {
        _id: "mock2",
        name: "Aritra Chakraborty",
        email: "aritra.chakraborty203@gmail.com",
        phone: "07585824862",
        message:
          "I need help with the revision tests. The questions are not displaying correctly and I cannot submit my answers.",
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        resolve: null,
      },
      {
        _id: "mock3",
        name: "Aritra Chakraborty",
        email: "aritra.chakraborty203@gmail.com",
        phone: "07585824862",
        message:
          "I want to request a certificate for completing the Advanced Financial Accounting course. How can I proceed?",
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
        resolve:
          "Your certificate has been processed and will be available in your dashboard within 24 hours. Thank you for completing the course!",
      },
      {
        _id: "mock4",
        name: "Aritra Chakraborty",
        email: "aritra.chakraborty203@gmail.com",
        phone: "07585824862",
        message:
          "I'm having trouble accessing the live classes. The Zoom link is not working and I missed today's session.",
        createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        updatedAt: new Date(Date.now() - 259200000).toISOString(),
        resolve:
          "We've sent you a new Zoom link via email. Please check your inbox and let us know if you still have issues.",
      },
      {
        _id: "mock5",
        name: "Aritra Chakraborty",
        email: "aritra.chakraborty203@gmail.com",
        phone: "07585824862",
        message:
          "Can you help me understand the difference between FIFO and LIFO inventory methods? I'm confused about when to use each one.",
        createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        updatedAt: new Date(Date.now() - 345600000).toISOString(),
        resolve: null,
      },
    ];

    setTickets(mockTickets);
    setTicketsLoading(false);

    // Comment out the API call for now
    /*
    try {
      console.log("Fetching tickets for email:", student.email);
      console.log(
        "API URL:",
        `${process.env.NEXT_PUBLIC_API_BASE}/tickets?email=${student.email}`
      );

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE}/tickets?email=${student.email}`
      );
      console.log("Tickets response:", res.data);
      setTickets(res.data || []);
    } catch (err) {
      console.error(
        "Failed to fetch tickets:",
        err.response?.data || err.message
      );
      setTickets(mockTickets);
    } finally {
      setTicketsLoading(false);
    }
    */
  };

  // Fetch tickets when student data is available
  useEffect(() => {
    if (student.email) {
      fetchTickets();
    }
  }, [student.email]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen lg:flex-row gap-6 px-6 pt-20 pb-10 font-sans">
      {/* Left Sidebar */}
      <div className="w-full lg:w-1/4 bg-white border rounded-xl shadow-md p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-gray-200 w-24 h-24 rounded-full flex items-center justify-center text-4xl text-gray-500">
            📷
          </div>
          <div>
            <h2 className="text-xl font-bold text-blue-700">{student.name}</h2>
            <p className="text-sm text-gray-700">{student.email}</p>
            <p className="text-sm text-gray-800 font-semibold">
              {student.phone}
            </p>
          </div>
          <div className="text-orange-600 text-sm font-medium flex items-center justify-center gap-1">
            <span>Notifications</span> <span>🔔</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-600 mt-4 border px-4 py-2 rounded-lg hover:bg-red-50"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Right Content */}
      <div className="w-full lg:w-3/4 bg-white rounded-xl shadow-md">
        {/* Tabs */}
        <div className="flex gap-4 px-6 pt-4 border-b overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-3 text-sm font-medium ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "Basic Profile" ? (
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Name
                </label>
                <input
                  type="text"
                  value={student.name}
                  onChange={(e) =>
                    setStudent((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Email address
                </label>
                <input
                  type="email"
                  value={student.email}
                  disabled
                  className="w-full mt-1 p-2 border rounded bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={student.phone}
                  onChange={(e) =>
                    setStudent((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>

              <div className="md:col-span-2 flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          ) : activeTab === "Tickets" ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  My Support Tickets
                </h3>
                <button
                  onClick={fetchTickets}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Refresh
                </button>
              </div>

              {ticketsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading tickets...</p>
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No tickets submitted yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket._id}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {ticket.message.substring(0, 100)}...
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Phone: {ticket.phone}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ticket.resolve
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {ticket.resolve ? "Resolved" : "Pending"}
                        </span>
                      </div>

                      <div className="text-sm text-gray-500">
                        Submitted:{" "}
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </div>

                      {ticket.resolve && (
                        <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                          <p className="text-sm font-medium text-blue-800">
                            Response:
                          </p>
                          <p className="text-sm text-blue-700 mt-1">
                            {ticket.resolve}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === "Billing Information" ? (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Course Purchase Invoices
                </h3>
                <p className="text-sm text-gray-600">
                  View and download invoices for your purchased courses
                </p>
              </div>

              {/* Course Purchase Invoices */}
              <div className="space-y-4">
                <div className="border rounded-lg p-6 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        Advanced Financial Accounting Course
                      </h4>
                      <p className="text-sm text-gray-600">
                        Invoice #INV-2024-001234
                      </p>
                      <p className="text-sm text-gray-500">
                        Purchased on{" "}
                        {new Date(Date.now() - 86400000).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        ₹4,999
                      </p>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                        Paid
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      <p>Transaction ID: TXN-2024-001234</p>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Download Invoice
                    </button>
                  </div>
                </div>

                <div className="border rounded-lg p-6 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        CA Foundation Study Kit
                      </h4>
                      <p className="text-sm text-gray-600">
                        Invoice #INV-2024-001198
                      </p>
                      <p className="text-sm text-gray-500">
                        Purchased on{" "}
                        {new Date(Date.now() - 172800000).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        ₹1,299
                      </p>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                        Paid
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      <p>Transaction ID: TXN-2024-001198</p>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Download Invoice
                    </button>
                  </div>
                </div>

                <div className="border rounded-lg p-6 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        Live Class Package (3 Months)
                      </h4>
                      <p className="text-sm text-gray-600">
                        Invoice #INV-2024-001156
                      </p>
                      <p className="text-sm text-gray-500">
                        Purchased on{" "}
                        {new Date(Date.now() - 259200000).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        ₹2,999
                      </p>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                        Paid
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      <p>Transaction ID: TXN-2024-001156</p>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Download Invoice
                    </button>
                  </div>
                </div>

                <div className="border rounded-lg p-6 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        Corporate Accounting Course
                      </h4>
                      <p className="text-sm text-gray-600">
                        Invoice #INV-2024-001089
                      </p>
                      <p className="text-sm text-gray-500">
                        Purchased on{" "}
                        {new Date(Date.now() - 345600000).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        ₹3,499
                      </p>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                        Paid
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      <p>Transaction ID: TXN-2024-001089</p>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Download Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-600 italic">
              {activeTab} content coming soon...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
