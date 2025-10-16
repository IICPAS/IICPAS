"use client";

import { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaPlus,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

interface ContactInfo {
  _id: string;
  title: string;
  content: string;
  icon: string;
  bg: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const iconOptions = [
  { value: "FaMapMarkerAlt", label: "Address", icon: FaMapMarkerAlt },
  { value: "FaPhoneAlt", label: "Phone", icon: FaPhoneAlt },
  { value: "FaEnvelope", label: "Email", icon: FaEnvelope },
];

const bgOptions = [
  { value: "from-blue-50 to-blue-100", label: "Blue", color: "bg-blue-100" },
  {
    value: "from-green-50 to-green-100",
    label: "Green",
    color: "bg-green-100",
  },
  {
    value: "from-purple-50 to-purple-100",
    label: "Purple",
    color: "bg-purple-100",
  },
  { value: "from-red-50 to-red-100", label: "Red", color: "bg-red-100" },
  {
    value: "from-yellow-50 to-yellow-100",
    label: "Yellow",
    color: "bg-yellow-100",
  },
  {
    value: "from-indigo-50 to-indigo-100",
    label: "Indigo",
    color: "bg-indigo-100",
  },
];

export default function ContactInfoTab() {
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ContactInfo | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    icon: "FaMapMarkerAlt",
    bg: "from-blue-50 to-blue-100",
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch("/api/contact-info/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setContactInfo(data);
      }
    } catch (error) {
      console.error("Error fetching contact info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingItem
        ? `/api/contact-info/${editingItem._id}`
        : "/api/contact-info";

      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchContactInfo();
        setShowModal(false);
        setEditingItem(null);
        setFormData({
          title: "",
          content: "",
          icon: "FaMapMarkerAlt",
          bg: "from-blue-50 to-blue-100",
        });
      }
    } catch (error) {
      console.error("Error saving contact info:", error);
    }
  };

  const handleEdit = (item: ContactInfo) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content,
      icon: item.icon,
      bg: item.bg,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this contact information?")) {
      try {
        const response = await fetch(`/api/contact-info/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          await fetchContactInfo();
        }
      } catch (error) {
        console.error("Error deleting contact info:", error);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/contact-info/${id}/toggle`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        await fetchContactInfo();
      }
    } catch (error) {
      console.error("Error toggling contact info status:", error);
    }
  };

  const handleOrderChange = async (id: string, direction: "up" | "down") => {
    try {
      const response = await fetch(`/api/contact-info/${id}/order`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ direction }),
      });
      if (response.ok) {
        await fetchContactInfo();
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Contact Information Management
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus />
          Add Contact Info
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Icon & Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Background
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contactInfo.map((item, index) => {
                const IconComponent =
                  iconOptions.find((opt) => opt.value === item.icon)?.icon ||
                  FaMapMarkerAlt;
                const bgOption = bgOptions.find((opt) => opt.value === item.bg);

                return (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center">
                            <IconComponent className="text-lg text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {item.content}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`h-4 w-4 rounded-full ${
                            bgOption?.color || "bg-gray-200"
                          } mr-2`}
                        ></div>
                        <span className="text-sm text-gray-900">
                          {bgOption?.label || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(item._id)}
                        className={`text-2xl ${
                          item.isActive ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        {item.isActive ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOrderChange(item._id, "up")}
                          disabled={index === 0}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <FaArrowUp />
                        </button>
                        <span className="text-sm text-gray-900">
                          {item.order}
                        </span>
                        <button
                          onClick={() => handleOrderChange(item._id, "down")}
                          disabled={index === contactInfo.length - 1}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <FaArrowDown />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingItem
                  ? "Edit Contact Information"
                  : "Add Contact Information"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Icon
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {iconOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Background Color
                  </label>
                  <select
                    value={formData.bg}
                    onChange={(e) =>
                      setFormData({ ...formData, bg: e.target.value })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {bgOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingItem(null);
                      setFormData({
                        title: "",
                        content: "",
                        icon: "FaMapMarkerAlt",
                        bg: "from-blue-50 to-blue-100",
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {editingItem ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
