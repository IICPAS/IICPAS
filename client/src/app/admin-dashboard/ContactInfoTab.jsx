"use client";

import { useState, useEffect } from "react";
import {
  FaSave,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaPlus,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function ContactInfoTab() {
  const { user } = useAuth();
  const [contactInfo, setContactInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    icon: "FaMapMarkerAlt",
    bg: "from-purple-100 to-white",
    isActive: true,
  });

  const iconOptions = [
    { value: "FaMapMarkerAlt", label: "Map Marker", icon: <FaMapMarkerAlt /> },
    { value: "FaPhoneAlt", label: "Phone", icon: <FaPhoneAlt /> },
    { value: "FaEnvelope", label: "Envelope", icon: <FaEnvelope /> },
    { value: "FaClock", label: "Clock", icon: <FaClock /> },
  ];

  const backgroundOptions = [
    { value: "from-purple-100 to-white", label: "Purple" },
    { value: "from-pink-100 to-white", label: "Pink" },
    { value: "from-yellow-100 to-white", label: "Yellow" },
    { value: "from-green-100 to-white", label: "Green" },
    { value: "from-blue-100 to-white", label: "Blue" },
    { value: "from-indigo-100 to-white", label: "Indigo" },
    { value: "from-red-100 to-white", label: "Red" },
    { value: "from-gray-100 to-white", label: "Gray" },
  ];

  const iconMap = {
    FaMapMarkerAlt: FaMapMarkerAlt,
    FaPhoneAlt: FaPhoneAlt,
    FaEnvelope: FaEnvelope,
    FaClock: FaClock,
  };

  useEffect(() => {
    if (user) {
      fetchContactInfo();
    }
  }, [user]);

  const fetchContactInfo = async () => {
    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_BASE}/contact-info/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setContactInfo(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching contact info:", error);
      toast.error("Failed to fetch contact information");
      setContactInfo([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_BASE}/contact-info`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Contact information created successfully!");
        fetchContactInfo();
        resetForm();
      } else {
        toast.error("Failed to create contact information");
      }
    } catch (error) {
      toast.error("Error creating contact information");
    }
  };

  const handleUpdate = async (id) => {
    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_BASE}/contact-info/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Contact information updated successfully!");
        fetchContactInfo();
        setEditingId(null);
        resetForm();
      } else {
        toast.error("Failed to update contact information");
      }
    } catch (error) {
      toast.error("Error updating contact information");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact information?"))
      return;

    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_BASE}/contact-info/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Contact information deleted successfully!");
        fetchContactInfo();
      } else {
        toast.error("Failed to delete contact information");
      }
    } catch (error) {
      toast.error("Error deleting contact information");
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_BASE}/contact-info/${id}/toggle`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        toast.success(`Contact information ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
        fetchContactInfo();
      } else {
        toast.error("Failed to update contact information status");
      }
    } catch (error) {
      toast.error("Error updating contact information status");
    }
  };

  const startEdit = (contact) => {
    setEditingId(contact._id);
    setFormData(contact);
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      icon: "FaMapMarkerAlt",
      bg: "from-purple-100 to-white",
      isActive: true,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Contact Information Management
        </h1>
        <p className="text-gray-600">
          Manage your website's contact information displayed on the Contact Us page
        </p>
      </div>

      {/* Create New Contact Info Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Contact Information" : "Add New Contact Information"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (e.g., "Our Address", "Contact Number")
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter title"
                required
              />
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <select
                value={formData.icon}
                onChange={(e) => handleInputChange("icon", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content (Use &lt;br /&gt; for line breaks)
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Enter content (e.g., 3149 New Creek Road, &lt;br /&gt;Huntsville, Alabama, USA)"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Use &lt;br /&gt; to create line breaks in the content
            </p>
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Color
            </label>
            <select
              value={formData.bg}
              onChange={(e) => handleInputChange("bg", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {backgroundOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Active Status */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleInputChange("isActive", e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Active (visible on website)
              </span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                <FaTimes className="inline mr-2" />
                Cancel
              </button>
            )}
            <button
              type={editingId ? "button" : "submit"}
              onClick={editingId ? () => handleUpdate(editingId) : undefined}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FaSave className="inline mr-2" />
              {editingId ? "Update" : "Create"} Contact Information
            </button>
          </div>
        </form>
      </div>

      {/* Existing Contact Information */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Existing Contact Information</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {Array.isArray(contactInfo) &&
            contactInfo.map((contact) => {
              const IconComponent = iconMap[contact.icon];
              return (
                <div key={contact._id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`bg-gradient-to-br ${contact.bg} rounded-lg p-3 shadow-sm`}>
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow">
                            <IconComponent className="text-lg text-gray-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {contact.title}
                          </h3>
                          {contact.isActive && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-gray-600 mb-2">
                        <span className="font-medium">Content: </span>
                        <span dangerouslySetInnerHTML={{ __html: contact.content }} />
                      </div>

                      <div className="text-gray-600">
                        <span className="font-medium">Background: </span>
                        <span className="capitalize">{contact.bg.split('-')[1]}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEdit(contact)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => handleToggleActive(contact._id, contact.isActive)}
                        className={`p-2 rounded-md transition-colors ${
                          contact.isActive
                            ? "text-yellow-600 hover:bg-yellow-100"
                            : "text-green-600 hover:bg-green-100"
                        }`}
                        title={contact.isActive ? "Deactivate" : "Activate"}
                      >
                        <FaCheck />
                      </button>

                      <button
                        onClick={() => handleDelete(contact._id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
