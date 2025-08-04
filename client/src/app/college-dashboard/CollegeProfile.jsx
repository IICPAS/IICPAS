"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  User,
  FileText,
  GraduationCap,
  Receipt,
  CreditCard,
  Settings,
  Upload,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Download,
  Plus,
  Search,
  Filter,
  Building,
} from "lucide-react";
import { FiImage, FiFile } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api";
const URL = process.env.NEXT_PUBLIC_URL || "http://localhost:8080";

const CollegeProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    image: "",
    document: "",
    _id: "",
  });
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [focus, setFocus] = useState("");
  const [showCheck, setShowCheck] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [messages, setMessages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  // Prefetch college details when profile tab is active
  useEffect(() => {
    if (activeTab === "profile" && profile.email) {
      console.log("Profile tab active, prefetching college details...");
      fetchProfile();
      // Generate documents from profile data instead of API call
      const generatedDocs = generateDocumentsFromProfile();
      setDocuments(generatedDocs);
    }
  }, [activeTab, profile.email]);

  useEffect(() => {
    if (profile.email) {
      fetchMessages();
      fetchBookings();
      fetchReceipts();
      fetchTransactions();
      // Generate documents from profile data instead of API call
      const generatedDocs = generateDocumentsFromProfile();
      setDocuments(generatedDocs);
    }
  }, [profile.email]);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Fetching college profile...");
      const res = await axios.get(`${API}/college/isCollege`, {
        withCredentials: true,
      });
      const data = res.data;
      console.log("College profile data received:", data);

      if (data.user) {
        const collegeData = {
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          image: data.user.image || "",
          document: data.user.document || "",
          _id: data.user._id || "",
        };

        console.log("Setting college profile:", collegeData);
        console.log("Document path from API:", data.user.document);
        setProfile(collegeData);
        console.log("College profile image path:", data.user.image);

        // Prefetch image if it exists
        if (data.user.image) {
          console.log("Prefetching college profile image...");
          const img = new Image();
          img.onload = () => {
            console.log(
              "College profile image prefetched successfully:",
              data.user.image
            );
          };
          img.onerror = () => {
            console.log(
              "College profile image failed to prefetch:",
              data.user.image
            );
          };
          img.src = `${URL}/${data.user.image}?t=${Date.now()}`;
        }

        setForm({
          name: data.user.name || "",
          phone: data.user.phone || "",
          password: "",
          confirmPassword: "",
        });

        console.log("College profile fetch completed successfully");
      } else {
        setError("Failed to fetch college profile");
      }
    } catch (err) {
      setError("Error fetching college profile");
      console.error("College profile fetch error:", err);
    }
    setLoading(false);
  };

  const fetchMessages = async () => {
    try {
      if (!profile.email) {
        console.log("No email available, skipping messages fetch");
        return;
      }

      const res = await axios.get(`${API}/messages/by-email/${profile.email}`);
      setMessages(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      if (!profile.email) {
        console.log("No email available, skipping bookings fetch");
        return;
      }

      const res = await axios.get(`${API}/bookings?by=${profile.email}`);
      setBookings(res.data || []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    }
  };

  const fetchReceipts = async () => {
    try {
      if (!profile.email) {
        console.log("No email available, skipping receipts fetch");
        return;
      }

      const res = await axios.get(
        `${API}/payments/receipts?email=${profile.email}`
      );
      setReceipts(res.data || []);
    } catch (error) {
      console.error("Failed to fetch receipts:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      if (!profile.email) {
        console.log("No email available, skipping transactions fetch");
        return;
      }

      const res = await axios.get(
        `${API}/payments/transactions?email=${profile.email}`
      );
      setTransactions(res.data || []);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  const generateDocumentsFromProfile = () => {
    try {
      if (!profile._id) {
        console.log("No college ID available, skipping documents generation");
        return [];
      }

      console.log("Generating documents for college ID:", profile._id);
      console.log("Profile data:", profile);
      console.log("Profile image:", profile.image);
      console.log("Profile document:", profile.document);

      const documents = [];

      // Add profile image if exists
      if (profile.image) {
        documents.push({
          name: "Profile Image",
          filename: profile.image.split("/").pop(),
          path: profile.image,
          type: "image",
          uploadedAt: new Date(),
        });
      }

      // Add registration document if exists
      if (profile.document) {
        documents.push({
          name: "Registration Document",
          filename: profile.document.split("/").pop(),
          path: profile.document,
          type: "document",
          uploadedAt: new Date(),
        });
      }

      console.log("Generated documents:", documents);
      return documents;
    } catch (error) {
      console.error("Failed to generate documents:", error);
      return [];
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFocus = (field) => setFocus(field);
  const handleBlur = () => setFocus("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    setShowCheck(false);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("phone", form.phone);
      if (form.password) {
        formData.append("password", form.password);
        formData.append("confirmPassword", form.confirmPassword);
      }
      if (profileImage) {
        formData.append("profileImage", profileImage);
        console.log(
          "Adding college profile image to form data:",
          profileImage.name
        );
      }

      // Debug: Log form data
      console.log("College form data being sent:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const res = await fetch(`${API}/college/profile`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      console.log("College profile response status:", res.status);
      const data = await res.json();
      console.log("College profile response data:", data);

      if (res.ok) {
        setMessage(data.message || "College profile updated successfully");

        // Update profile with new data
        const updatedProfile = {
          name: data.college.name,
          email: data.college.email,
          phone: data.college.phone,
          image: data.college.image || profile.image,
        };
        setProfile(updatedProfile);

        setForm({ ...form, password: "", confirmPassword: "" });
        setShowCheck(true);
        setTimeout(() => setShowCheck(false), 1800);

        // If image was uploaded, force refresh the image display and documents
        if (data.college.image && data.college.image !== profile.image) {
          console.log(
            "New college image uploaded, refreshing image display..."
          );
          setImagePreview(null);
          setProfileImage(null);

          // Force refresh the image immediately
          setTimeout(() => {
            refreshProfileImage();
          }, 500);

          // Refresh documents to show updated image
          setTimeout(() => {
            const generatedDocs = generateDocumentsFromProfile();
            setDocuments(generatedDocs);
          }, 1000);
        } else {
          // Refresh documents even if no image was uploaded
          setTimeout(() => {
            const generatedDocs = generateDocumentsFromProfile();
            setDocuments(generatedDocs);
          }, 500);
        }
      } else {
        setError(data.error || "Failed to update college profile");
      }
    } catch (err) {
      console.error("College profile update error:", err);
      setError("Error updating college profile");
    }
    setLoading(false);
  };

  const tabs = [
    { id: "profile", label: "Profile Update", icon: Settings },
    { id: "messages", label: "Messages", icon: FileText },
    { id: "bookings", label: "Bookings", icon: GraduationCap },
    { id: "receipts", label: "Receipts", icon: Receipt },
    { id: "transactions", label: "Transactions", icon: CreditCard },
    { id: "documents", label: "Documents", icon: FileText },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);

    // Refresh data when specific tabs are clicked
    if (tabId === "profile") {
      console.log("Profile tab selected, prefetching college details...");
      fetchProfile();
      // Generate documents from profile data instead of API call
      const generatedDocs = generateDocumentsFromProfile();
      setDocuments(generatedDocs);
    } else if (tabId === "documents") {
      // Generate documents from profile data instead of API call
      const generatedDocs = generateDocumentsFromProfile();
      setDocuments(generatedDocs);
    }
  };

  const refreshProfileImage = () => {
    if (profile.image) {
      console.log("Refreshing college profile image:", profile.image);
      setImageLoading(true);

      const img = new Image();
      img.onload = () => {
        console.log("College profile image refreshed successfully");
        setImageLoading(false);
        // Force re-render by updating profile state
        setProfile((prev) => ({ ...prev }));
      };
      img.onerror = () => {
        console.log("College profile image refresh failed");
        setImageLoading(false);
      };
      img.src = `${URL}/${profile.image}?t=${Date.now()}`;
    }
  };

  const renderProfileTab = () => (
    <div className="bg-white rounded-xl p-8 shadow-sm">
      {/* Profile Header with College Details */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          College Profile
        </h2>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>
            <strong>Email:</strong> {profile.email || "Loading..."}
          </span>
          <span>
            <strong>Status:</strong> Active
          </span>
          <span>
            <strong>Last Updated:</strong>{" "}
            {profile.updatedAt
              ? new Date(profile.updatedAt).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-8">
        {/* Left Column - Profile Image */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden relative">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="College Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : profile.image ? (
                <img
                  src={`${URL}/${profile.image}?t=${Date.now()}`}
                  alt="College Profile"
                  className="w-full h-full object-cover"
                  onLoadStart={() => {
                    console.log(
                      "College image loading started:",
                      `${URL}/${profile.image}`
                    );
                    setImageLoading(true);
                  }}
                  onLoad={(e) => {
                    console.log(
                      "College image loaded successfully:",
                      `${URL}/${profile.image}`
                    );
                    setImageLoading(false);
                    const fallbackIcon = e.target.nextElementSibling;
                    if (fallbackIcon) {
                      fallbackIcon.style.display = "none";
                    }
                  }}
                  onError={(e) => {
                    console.log(
                      "College image failed to load:",
                      `${URL}/${profile.image}`
                    );
                    setImageLoading(false);
                    e.target.style.display = "none";
                    e.target.nextElementSibling.style.display = "flex";
                  }}
                />
              ) : null}

              {/* Fallback icon - shown when no image or image fails to load */}
              <div
                className={`absolute inset-0 flex items-center justify-center ${
                  profile.image ? "hidden" : ""
                }`}
              >
                <GraduationCap size={64} className="text-white" />
              </div>

              {/* Loading spinner - shown when image is loading */}
              {imageLoading && profile.image && (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-400 bg-opacity-75 rounded-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
              <Upload size={16} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <div className="mt-4 text-center">
            <h3 className="font-bold text-lg text-gray-800">
              {profile.name || "College"}
            </h3>
            <p className="text-sm text-gray-600">{profile.email}</p>
            {profile.image && (
              <p className="text-xs text-gray-500 mt-1">
                Image: {profile.image.split("/").pop()}
              </p>
            )}
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="flex-1">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Update College Information
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Update your college contact details and profile image.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                College Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                onFocus={() => handleFocus("name")}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border rounded-lg transition-all ${
                  focus === "name"
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-300"
                }`}
                placeholder="Enter college name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                onFocus={() => handleFocus("phone")}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border rounded-lg transition-all ${
                  focus === "phone"
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-300"
                }`}
                placeholder="Enter phone number"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => handleFocus("password")}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg transition-all ${
                      focus === "password"
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-300"
                    }`}
                    placeholder="Leave blank to keep current"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => handleFocus("confirmPassword")}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg transition-all ${
                      focus === "confirmPassword"
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-300"
                    }`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Image Upload Section */}
            <div className="border-t pt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Profile Image
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : profile.image ? (
                    <img
                      src={`${URL}/${profile.image}?t=${Date.now()}`}
                      alt="Current"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <GraduationCap size={24} className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <Upload size={16} />
                    {imagePreview ? "Change Image" : "Upload Image"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    {imagePreview
                      ? "New image selected"
                      : "Click to upload a new profile image"}
                  </p>
                </div>
              </div>
            </div>

            {showCheck && (
              <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                <CheckCircle2 size={20} />
                College Profile Updated Successfully!
              </div>
            )}

            {message && !showCheck && (
              <div className="text-green-600 text-center font-semibold">
                {message}
              </div>
            )}

            {error && (
              <div className="text-red-600 text-center font-semibold">
                {error}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm({
                    name: profile.name || "",
                    phone: profile.phone || "",
                    password: "",
                    confirmPassword: "",
                  });
                  setImagePreview(null);
                  setProfileImage(null);
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderMessagesTab = () => (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Support Messages</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search messages..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {messages.map((msg) => (
              <tr key={msg._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{msg._id.slice(-6)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {msg.message}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {msg.status === "replied" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle2 size={12} className="mr-1" />
                      Replied
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Clock size={12} className="mr-1" />
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900">
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBookingsTab = () => (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Training Bookings</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Plus size={16} />
            Book Training
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Training
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {booking.title || "Training"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      booking.status === "booked"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReceiptsTab = () => (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-800">Payment Receipts</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Receipt ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                For
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {receipts.map((receipt) => (
              <tr key={receipt._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{receipt._id.slice(-6)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {receipt.for}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{receipt.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(receipt.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Eye size={16} />
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTransactionsTab = () => (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-800">Transaction History</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #
                  {transaction.razorpay_payment_id?.slice(-6) ||
                    transaction._id.slice(-6)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {transaction.for}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{transaction.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.status === "success"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Uploaded Documents & Images
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              College: {profile.email}
            </p>
          </div>
          <button
            onClick={() => {
              const generatedDocs = generateDocumentsFromProfile();
              setDocuments(generatedDocs);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Download size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="p-6">
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No documents available
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              College ID: {profile._id || "Not available"}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Document Path: {profile.document || "Not available"}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Documents will appear here when profile image or registration
              documents are uploaded.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {doc.type === "image" ? (
                      <FiImage className="h-8 w-8 text-blue-500" />
                    ) : (
                      <FiFile className="h-8 w-8 text-green-500" />
                    )}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {doc.name}
                      </h4>
                      <p className="text-xs text-gray-500">{doc.filename}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      doc.type === "image"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {doc.type}
                  </span>
                </div>

                {/* Show image preview for image documents */}
                {doc.type === "image" && (
                  <div className="mt-3">
                    <img
                      src={`${URL}/${doc.path}?t=${Date.now()}`}
                      alt={doc.name}
                      className="w-full h-32 object-cover rounded border"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        window.open(`${URL}/${doc.path}`, "_blank")
                      }
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = `${URL}/${doc.path}`;
                        link.download = doc.filename;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="text-green-600 hover:text-green-800 p-1"
                      title="Download"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab();
      case "messages":
        return renderMessagesTab();
      case "bookings":
        return renderBookingsTab();
      case "receipts":
        return renderReceiptsTab();
      case "transactions":
        return renderTransactionsTab();
      case "documents":
        return renderDocumentsTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            College Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {profile.name || "College"}! Manage your college
            profile, bookings, and transactions.
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default CollegeProfile;
