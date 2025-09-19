"use client";

import { useState, useEffect } from "react";
import {
  FaSave,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaImage,
  FaVideo,
  FaUpload,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function AboutUsTab() {
  const { user } = useAuth();
  const [aboutEntries, setAboutEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mainImage: "/images/about.jpeg",
    testimonialImage: "/images/young-woman.jpg",
    video: {
      type: "file",
      url: "/videos/aboutus.mp4",
      poster: "/images/video-poster.jpg",
      autoplay: true,
      loop: true,
      muted: true,
    },
    testimonial: {
      text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
      author: "Alisa Oliva",
      position: "Web Designer",
    },
    classSchedule: {
      title: "Our Class Day",
      days: [
        { day: "Saturday", time: "10:00-16:00" },
        { day: "Sunday", time: "10:00-16:00" },
        { day: "Monday", time: "10:00-16:00" },
        { day: "Tuesday", time: "10:00-16:00" },
        { day: "Wednesday", time: "10:00-16:00" },
      ],
    },
    button: {
      text: "",
      link: "",
    },
    colors: {
      title: "text-green-600",
      content: "text-gray-700",
      background: "bg-white",
    },
  });
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const colorOptions = [
    { value: "text-white", label: "White" },
    { value: "text-green-600", label: "Green" },
    { value: "text-blue-600", label: "Blue" },
    { value: "text-purple-600", label: "Purple" },
    { value: "text-yellow-600", label: "Yellow" },
    { value: "text-red-600", label: "Red" },
    { value: "text-gray-700", label: "Gray" },
    { value: "text-gray-800", label: "Dark Gray" },
    { value: "text-gray-900", label: "Black" },
  ];

  const backgroundOptions = [
    { value: "bg-white", label: "White" },
    { value: "bg-gray-50", label: "Light Gray" },
    { value: "bg-blue-50", label: "Light Blue" },
    { value: "bg-green-50", label: "Light Green" },
    { value: "bg-purple-50", label: "Light Purple" },
    {
      value: "bg-gradient-to-br from-blue-50 to-green-50",
      label: "Blue to Green Gradient",
    },
    {
      value: "bg-gradient-to-br from-purple-50 to-pink-50",
      label: "Purple to Pink Gradient",
    },
  ];

  useEffect(() => {
    if (user) {
      fetchAboutEntries();
    }
  }, [user]);

  const fetchAboutEntries = async () => {
    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_BASE}/about/all`, {
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
      setAboutEntries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching about entries:", error);
      toast.error("Failed to fetch About content");
      setAboutEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child, subChild] = field.split(".");
      if (subChild) {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [subChild]: value,
            },
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file");
      return;
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Video file size must be less than 50MB");
      return;
    }

    setUploadingVideo(true);

    try {
      const formData = new FormData();
      formData.append("video", file);

      const API_BASE =
        process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_BASE}/upload/video`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setFormData((prev) => ({
          ...prev,
          video: {
            ...prev.video,
            url: result.filePath,
            type: "file",
          },
        }));
        toast.success("Video uploaded successfully!");
      } else {
        toast.error("Failed to upload video");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Error uploading video");
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_BASE}/about`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("About content created successfully!");
        fetchAboutEntries();
        resetForm();
      } else {
        toast.error("Failed to create About content");
      }
    } catch (error) {
      toast.error("Error creating About content");
    }
  };

  const handleUpdate = async (id) => {
    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_BASE}/about/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("About content updated successfully!");
        fetchAboutEntries();
        setEditingId(null);
        resetForm();
      } else {
        toast.error("Failed to update About content");
      }
    } catch (error) {
      toast.error("Error updating About content");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this About content?"))
      return;

    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_BASE}/about/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        toast.success("About content deleted successfully!");
        fetchAboutEntries();
      } else {
        toast.error("Failed to delete About content");
      }
    } catch (error) {
      toast.error("Error deleting About content");
    }
  };

  const handleActivate = async (id) => {
    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_BASE}/about/activate/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        toast.success("About content activated successfully!");
        fetchAboutEntries();
      } else {
        toast.error("Failed to activate About content");
      }
    } catch (error) {
      toast.error("Error activating About content");
    }
  };

  const startEdit = (entry) => {
    setEditingId(entry._id);
    setFormData(entry);
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      mainImage: "/images/about.jpeg",
      testimonialImage: "/images/young-woman.jpg",
      video: {
        type: "file",
        url: "/videos/aboutus.mp4",
        poster: "/images/video-poster.jpg",
        autoplay: true,
        loop: true,
        muted: true,
      },
      testimonial: {
        text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        author: "Alisa Oliva",
        position: "Web Designer",
      },
      classSchedule: {
        title: "Our Class Day",
        days: [
          { day: "Saturday", time: "10:00-16:00" },
          { day: "Sunday", time: "10:00-16:00" },
          { day: "Monday", time: "10:00-16:00" },
          { day: "Tuesday", time: "10:00-16:00" },
          { day: "Wednesday", time: "10:00-16:00" },
        ],
      },
      button: {
        text: "",
        link: "",
      },
      colors: {
        title: "text-green-600",
        content: "text-gray-700",
        background: "bg-white",
      },
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
          About Us Section Management
        </h1>
        <p className="text-gray-600">
          Manage your website's About Us section content and styling
        </p>
      </div>

      {/* Create New About Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit About Us Content" : "Create New About Us Content"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="About Us"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="6"
              placeholder="Enter about us content"
              required
            />
          </div>

          {/* Image Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Image Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Image URL
                </label>
                <input
                  type="text"
                  value={formData.mainImage}
                  onChange={(e) =>
                    handleInputChange("mainImage", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/images/about.jpeg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Testimonial Image URL
                </label>
                <input
                  type="text"
                  value={formData.testimonialImage}
                  onChange={(e) =>
                    handleInputChange("testimonialImage", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/images/young-woman.jpg"
                  required
                />
              </div>
            </div>
          </div>

          {/* Testimonial Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Testimonial Settings
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Testimonial Text
                </label>
                <textarea
                  value={formData.testimonial.text}
                  onChange={(e) =>
                    handleInputChange("testimonial.text", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Enter testimonial text"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={formData.testimonial.author}
                    onChange={(e) =>
                      handleInputChange("testimonial.author", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Alisa Oliva"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author Position
                  </label>
                  <input
                    type="text"
                    value={formData.testimonial.position}
                    onChange={(e) =>
                      handleInputChange("testimonial.position", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Web Designer"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Class Schedule Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Class Schedule Settings
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Title
                </label>
                <input
                  type="text"
                  value={formData.classSchedule.title}
                  onChange={(e) =>
                    handleInputChange("classSchedule.title", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Our Class Day"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Days & Times
                </label>
                <div className="space-y-2">
                  {formData.classSchedule.days.map((day, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={day.day}
                        onChange={(e) => {
                          const newDays = [...formData.classSchedule.days];
                          newDays[index].day = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            classSchedule: {
                              ...prev.classSchedule,
                              days: newDays,
                            },
                          }));
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Day"
                        required
                      />
                      <input
                        type="text"
                        value={day.time}
                        onChange={(e) => {
                          const newDays = [...formData.classSchedule.days];
                          newDays[index].time = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            classSchedule: {
                              ...prev.classSchedule,
                              days: newDays,
                            },
                          }));
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Time"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Video Management Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Video Settings
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              {/* Video Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Type
                </label>
                <select
                  value={formData.video.type}
                  onChange={(e) =>
                    handleInputChange("video.type", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="file">Upload Video File</option>
                  <option value="url">External Video URL</option>
                </select>
              </div>

              {/* Video Upload or URL Input */}
              {formData.video.type === "file" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Video File
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      id="video-upload"
                      disabled={uploadingVideo}
                    />
                    <label
                      htmlFor="video-upload"
                      className={`flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 ${
                        uploadingVideo ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <FaUpload className="mr-2" />
                      {uploadingVideo ? "Uploading..." : "Choose Video File"}
                    </label>
                    {formData.video.url && (
                      <span className="text-sm text-gray-600">
                        Current: {formData.video.url}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: MP4, WebM, AVI. Max size: 50MB
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL
                  </label>
                  <input
                    type="url"
                    value={formData.video.url}
                    onChange={(e) =>
                      handleInputChange("video.url", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/video.mp4"
                  />
                </div>
              )}

              {/* Video Poster */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Poster/Thumbnail URL
                </label>
                <input
                  type="text"
                  value={formData.video.poster}
                  onChange={(e) =>
                    handleInputChange("video.poster", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/images/video-poster.jpg"
                />
              </div>

              {/* Video Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoplay"
                    checked={formData.video.autoplay}
                    onChange={(e) =>
                      handleInputChange("video.autoplay", e.target.checked)
                    }
                    className="mr-2"
                  />
                  <label htmlFor="autoplay" className="text-sm text-gray-700">
                    Auto Play
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="loop"
                    checked={formData.video.loop}
                    onChange={(e) =>
                      handleInputChange("video.loop", e.target.checked)
                    }
                    className="mr-2"
                  />
                  <label htmlFor="loop" className="text-sm text-gray-700">
                    Loop Video
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="muted"
                    checked={formData.video.muted}
                    onChange={(e) =>
                      handleInputChange("video.muted", e.target.checked)
                    }
                    className="mr-2"
                  />
                  <label htmlFor="muted" className="text-sm text-gray-700">
                    Muted
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Button */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Button Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  value={formData.button.text}
                  onChange={(e) =>
                    handleInputChange("button.text", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Learn More About Us"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Link
                </label>
                <input
                  type="text"
                  value={formData.button.link}
                  onChange={(e) =>
                    handleInputChange("button.link", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/about"
                />
              </div>
            </div>
          </div>

          {/* Color Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Color Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(formData.colors).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <select
                    value={value}
                    onChange={(e) =>
                      handleInputChange(`colors.${key}`, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {key === "background"
                      ? backgroundOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))
                      : colorOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                  </select>
                </div>
              ))}
            </div>
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
              {editingId ? "Update" : "Create"} About Content
            </button>
          </div>
        </form>
      </div>

      {/* Existing About Contents */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Existing About Contents</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {Array.isArray(aboutEntries) &&
            aboutEntries.map((entry) => (
              <div key={entry._id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {entry.title}
                      </h3>
                      {entry.isActive && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Active
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Content: </span>
                      {entry.content.substring(0, 100)}...
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEdit(entry)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>

                    {!entry.isActive && (
                      <button
                        onClick={() => handleActivate(entry._id)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                        title="Activate"
                      >
                        <FaCheck />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(entry._id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
