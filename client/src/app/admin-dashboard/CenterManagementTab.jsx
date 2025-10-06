"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUser,
} from "react-icons/fa";
import toast from "react-hot-toast";

const API_BASE = "http://localhost:8080";

export default function CenterManagementTab() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCenter, setEditingCenter] = useState(null);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
    manager: {
      name: "",
      phone: "",
      email: "",
    },
    facilities: [],
    courses: [],
    capacity: 50,
    description: "",
    status: "active",
    timings: {
      monday: { open: "09:00", close: "18:00" },
      tuesday: { open: "09:00", close: "18:00" },
      wednesday: { open: "09:00", close: "18:00" },
      thursday: { open: "09:00", close: "18:00" },
      friday: { open: "09:00", close: "18:00" },
      saturday: { open: "09:00", close: "18:00" },
      sunday: { open: "10:00", close: "16:00" },
    },
  });

  useEffect(() => {
    fetchCenters();
    fetchAvailableCourses();
  }, []);

  const fetchCenters = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem("adminToken");

      if (!adminToken) {
        // Use public API as fallback
        const response = await axios.get(`${API_BASE}/v1/centers/public`);
        setCenters(response.data.data || []);
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE}/v1/centers`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      });

      setCenters(response.data.data || []);
    } catch (error) {
      console.error("Error fetching centers:", error);
      if (error.response?.status === 401) {
        // Fallback to public API
        try {
          const response = await axios.get(`${API_BASE}/v1/centers/public`);
          setCenters(response.data.data || []);
        } catch (fallbackError) {
          toast.error("Failed to fetch centers");
          setCenters([]);
        }
      } else {
        toast.error("Failed to fetch centers");
        setCenters([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      const response = await axios.get(`${API_BASE}/v1/centers/courses`);
      setAvailableCourses(response.data.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("manager.")) {
      const managerField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        manager: {
          ...prev.manager,
          [managerField]: value,
        },
      }));
    } else if (name.startsWith("timings.")) {
      const [day, timeField] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        timings: {
          ...prev.timings,
          [day]: {
            ...prev.timings[day],
            [timeField]: value,
          },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFacilityChange = (facility) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const handleCourseChange = (courseId) => {
    setFormData((prev) => ({
      ...prev,
      courses: prev.courses.includes(courseId)
        ? prev.courses.filter((id) => id !== courseId)
        : [...prev.courses, courseId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const adminToken = localStorage.getItem("adminToken");

      if (editingCenter) {
        await axios.put(
          `${API_BASE}/api/v1/centers/${editingCenter._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Center updated successfully!");
      } else {
        await axios.post(`${API_BASE}/api/v1/centers`, formData, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Center created successfully!");
      }

      setShowModal(false);
      setEditingCenter(null);
      resetForm();
      fetchCenters();
    } catch (error) {
      console.error("Error saving center:", error);
      toast.error("Failed to save center");
    }
  };

  const handleEdit = (center) => {
    setEditingCenter(center);
    setFormData({
      ...center,
      facilities: center.facilities || [],
      courses: center.courses || [],
    });
    setShowModal(true);
  };

  const handleDelete = async (centerId) => {
    if (!confirm("Are you sure you want to delete this center?")) return;

    try {
      const adminToken = localStorage.getItem("adminToken");

      await axios.delete(`${API_BASE}/api/v1/centers/${centerId}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Center deleted successfully!");
      fetchCenters();
    } catch (error) {
      console.error("Error deleting center:", error);
      toast.error("Failed to delete center");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      email: "",
      manager: {
        name: "",
        phone: "",
        email: "",
      },
      facilities: [],
      courses: [],
      capacity: 50,
      description: "",
      status: "active",
      timings: {
        monday: { open: "09:00", close: "18:00" },
        tuesday: { open: "09:00", close: "18:00" },
        wednesday: { open: "09:00", close: "18:00" },
        thursday: { open: "09:00", close: "18:00" },
        friday: { open: "09:00", close: "18:00" },
        saturday: { open: "09:00", close: "18:00" },
        sunday: { open: "10:00", close: "16:00" },
      },
    });
  };

  const commonFacilities = [
    "Air Conditioning",
    "WiFi",
    "Projector",
    "Whiteboard",
    "Parking",
    "Cafeteria",
    "Library",
    "Computer Lab",
    "Auditorium",
    "Meeting Rooms",
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Center Management</h2>
        <button
          onClick={() => {
            resetForm();
            setEditingCenter(null);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FaPlus /> Add New Center
        </button>
      </div>

      {/* Add/Edit Center Form - Show at top when modal is open */}
      {showModal && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {editingCenter ? "Edit Center" : "Add New Center"}
            </h3>
            <button
              onClick={() => {
                setShowModal(false);
                setEditingCenter(null);
                resetForm();
              }}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  Basic Information
                </h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Center Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              {/* Manager Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  Manager Information
                </h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manager Name *
                  </label>
                  <input
                    type="text"
                    name="manager.name"
                    value={formData.manager.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manager Phone *
                  </label>
                  <input
                    type="tel"
                    name="manager.phone"
                    value={formData.manager.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manager Email *
                  </label>
                  <input
                    type="email"
                    name="manager.email"
                    value={formData.manager.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Facilities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facilities
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {commonFacilities.map((facility) => (
                      <label key={facility} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.facilities.includes(facility)}
                          onChange={() => handleFacilityChange(facility)}
                          className="mr-2"
                        />
                        <span className="text-sm">{facility}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Courses */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Courses
                  </label>
                  <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                    {availableCourses.map((course) => (
                      <label
                        key={course._id}
                        className="flex items-center mb-2"
                      >
                        <input
                          type="checkbox"
                          checked={formData.courses.includes(course._id)}
                          onChange={() => handleCourseChange(course._id)}
                          className="mr-2"
                        />
                        <span className="text-sm">
                          {course.title} - {course.category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditingCenter(null);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingCenter ? "Update Center" : "Create Center"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Centers List - Only show when modal is closed */}
      {!showModal && (
        <>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading centers...</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {centers.map((center) => (
                <div
                  key={center._id}
                  className="bg-white rounded-lg shadow-md p-6 border"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {center.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        center.status === "active"
                          ? "bg-green-100 text-green-800"
                          : center.status === "inactive"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {center.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMapMarkerAlt className="text-blue-500" />
                      <span className="text-sm">
                        {center.address}, {center.city}, {center.state} -{" "}
                        {center.pincode}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaPhone className="text-green-500" />
                      <span className="text-sm">{center.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaEnvelope className="text-purple-500" />
                      <span className="text-sm">{center.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaUser className="text-orange-500" />
                      <span className="text-sm">{center.manager?.name}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Courses ({center.courses?.length || 0})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {center.courses?.slice(0, 3).map((course) => (
                        <span
                          key={course._id}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {course.title}
                        </span>
                      ))}
                      {center.courses?.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{center.courses.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(center)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-1"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(center._id)}
                      className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
