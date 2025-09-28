"use client";

import React, { useState, useEffect } from "react";
import { 
  FaBell, 
  FaCheck, 
  FaTimes, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaCheckCircle,
  FaCalendarAlt,
  FaBook,
  FaVideo,
  FaCertificate,
  FaTrash,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Mock data - replace with actual API call
      const mockNotifications = [
        {
          id: 1,
          title: "New Course Available",
          message: "Advanced Accounting Course is now available for enrollment",
          type: "course",
          priority: "high",
          timestamp: "2024-01-15T10:30:00Z",
          read: false,
          actionUrl: "/courses/advanced-accounting"
        },
        {
          id: 2,
          title: "Live Class Reminder",
          message: "Your live class 'GST Fundamentals' starts in 30 minutes",
          type: "live",
          priority: "high",
          timestamp: "2024-01-15T09:00:00Z",
          read: false,
          actionUrl: "/live-class/gst-fundamentals"
        },
        {
          id: 3,
          title: "Certificate Ready",
          message: "Your Basic Accounting certificate is ready for download",
          type: "certificate",
          priority: "medium",
          timestamp: "2024-01-14T16:45:00Z",
          read: true,
          actionUrl: "/certificates/basic-accounting"
        },
        {
          id: 4,
          title: "Assignment Due Soon",
          message: "Your assignment for 'Financial Reporting' is due tomorrow",
          type: "assignment",
          priority: "high",
          timestamp: "2024-01-14T14:20:00Z",
          read: false,
          actionUrl: "/assignments/financial-reporting"
        },
        {
          id: 5,
          title: "System Maintenance",
          message: "Scheduled maintenance on Sunday, 2 AM - 4 AM",
          type: "system",
          priority: "low",
          timestamp: "2024-01-13T11:15:00Z",
          read: true,
          actionUrl: null
        },
        {
          id: 6,
          title: "Welcome to IICPA!",
          message: "Thank you for joining our platform. Explore your dashboard to get started",
          type: "welcome",
          priority: "medium",
          timestamp: "2024-01-12T08:00:00Z",
          read: true,
          actionUrl: "/dashboard"
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
    toast.success("Notification marked as read");
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    toast.success("Notification deleted");
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "course":
        return <FaBook className="text-blue-600" />;
      case "live":
        return <FaVideo className="text-red-600" />;
      case "certificate":
        return <FaCertificate className="text-green-600" />;
      case "assignment":
        return <FaExclamationTriangle className="text-orange-600" />;
      case "system":
        return <FaInfoCircle className="text-gray-600" />;
      case "welcome":
        return <FaCheckCircle className="text-purple-600" />;
      default:
        return <FaBell className="text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-gray-400";
      default:
        return "border-l-gray-400";
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600">Stay updated with your learning progress and important announcements</p>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaCheck />
                Mark All Read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaBell className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <FaExclamationTriangle className="text-red-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Read</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.length - unreadCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FaCalendarAlt className="text-purple-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          {[
            { id: "all", name: "All Notifications" },
            { id: "unread", name: "Unread" },
            { id: "course", name: "Courses" },
            { id: "live", name: "Live Classes" },
            { id: "certificate", name: "Certificates" },
            { id: "assignment", name: "Assignments" }
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === filterOption.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filterOption.name}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm border">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-gray-50 transition-colors border-l-4 ${getPriorityColor(notification.priority)} ${
                  !notification.read ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-lg font-semibold ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-2">{notification.message}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="text-xs" />
                        {new Date(notification.timestamp).toLocaleDateString()} at{" "}
                        {new Date(notification.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        notification.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : notification.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {notification.priority}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="Mark as read"
                      >
                        <FaEye />
                      </button>
                    )}
                    
                    {notification.actionUrl && (
                      <button
                        onClick={() => window.open(notification.actionUrl, '_blank')}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        View
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete notification"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <FaBell className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">
              {filter === "unread" 
                ? "You're all caught up! No unread notifications."
                : "No notifications found for the selected filter."
              }
            </p>
          </div>
        )}
      </div>

      {/* Notification Settings */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-gray-700">Email notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-gray-700">Push notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded" />
              <span className="text-gray-700">SMS notifications</span>
            </label>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-gray-700">Course updates</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-gray-700">Live class reminders</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded" />
              <span className="text-gray-700">Marketing emails</span>
            </label>
          </div>
        </div>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );
}
