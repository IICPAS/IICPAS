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
} from "lucide-react";
import { FiImage, FiFile } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api";
const URL = process.env.NEXT_PUBLIC_URL || "http://localhost:8080";
const IndividualProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
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
  const [enquiries, setEnquiries] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile.email) {
      fetchEnquiries();
      fetchTrainings();
      fetchReceipts();
      fetchDeposits();
      fetchDocuments();
    }
  }, [profile.email]);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API + "/v1/individual/profile-valid", {
        credentials: "include",
      });
      const data = await res.json();
      console.log("Profile data received:", data); // Debug log
      if (data.success && data.user) {
        setProfile({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          image: data.user.image || "",
        });
        console.log("Profile image path:", data.user.image); // Debug log

        // Prefetch image if it exists
        if (data.user.image) {
          const img = new Image();
          img.onload = () => {
            console.log(
              "Profile image prefetched successfully:",
              data.user.image
            );
          };
          img.onerror = () => {
            console.log("Profile image failed to prefetch:", data.user.image);
          };
          img.src = `${URL}/${data.user.image}`;
        }

        setForm({
          name: data.user.name || "",
          phone: data.user.phone || "",
          password: "",
          confirmPassword: "",
        });
      } else {
        setError(data.message || "Failed to fetch profile");
      }
    } catch (err) {
      setError("Error fetching profile");
    }
    setLoading(false);
  };

  const fetchEnquiries = async () => {
    try {
      if (!profile.email) {
        console.log("No email available, skipping enquiries fetch");
        return;
      }

      const res = await axios.get(`${API}/tickets?email=${profile.email}`);
      setEnquiries(res.data || []);
    } catch (error) {
      console.error("Failed to fetch enquiries:", error);
    }
  };

  const fetchTrainings = async () => {
    try {
      if (!profile.email) {
        console.log("No email available, skipping trainings fetch");
        return;
      }

      const res = await axios.get(`${API}/bookings?by=${profile.email}`);
      setTrainings(res.data || []);
    } catch (error) {
      console.error("Failed to fetch trainings:", error);
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

  const fetchDeposits = async () => {
    try {
      if (!profile.email) {
        console.log("No email available, skipping deposits fetch");
        return;
      }

      const res = await axios.get(
        `${API}/payments/transactions?email=${profile.email}`
      );
      setDeposits(res.data || []);
    } catch (error) {
      console.error("Failed to fetch deposits:", error);
    }
  };

  const fetchDocuments = async () => {
    try {
      if (!profile.email) {
        console.log("No email available, skipping documents fetch");
        return;
      }

      const res = await axios.post(`${API}/v1/individual/documents`, {
        email: profile.email,
      });
      setDocuments(res.data.documents || []);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      // Don't show error if it's just that email is not available yet
      if (error.response?.status !== 400 || profile.email) {
        console.error("Documents fetch error details:", error.response?.data);
      }
    }
  };

  const testServerConnection = async () => {
    try {
      console.log("Testing server connection...");
      const res = await fetch(`${API}/v1/individual/test`);
      const data = await res.json();
      console.log("Server test response:", data);
      alert("Server is accessible! Response: " + JSON.stringify(data));
    } catch (error) {
      console.error("Server test failed:", error);
      alert("Server test failed: " + error.message);
    }
  };

  const testAuthentication = async () => {
    try {
      console.log("Testing authentication...");
      const res = await fetch(`${API}/v1/individual/profile-valid`, {
        credentials: "include",
      });
      const data = await res.json();
      console.log("Auth test response:", data);
      alert("Auth test response: " + JSON.stringify(data));
    } catch (error) {
      console.error("Auth test failed:", error);
      alert("Auth test failed: " + error.message);
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
        console.log("Adding profile image to form data:", profileImage.name);
      }

      // Debug: Log form data
      console.log("Form data being sent:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const res = await fetch(`${API}/v1/individual/profile`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      if (res.ok) {
        setMessage(data.message || "Profile updated successfully");
        setProfile({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          image: data.user.image || profile.image,
        });
        setForm({ ...form, password: "", confirmPassword: "" });
        setShowCheck(true);
        setTimeout(() => setShowCheck(false), 1800);

        // If token was updated, force a complete profile refresh
        if (data.tokenUpdated) {
          console.log("Token updated, refreshing profile data...");
          setTimeout(() => {
            fetchProfile();
          }, 500);
        }

        // If image was uploaded, force refresh the image display
        if (data.user.image && data.user.image !== profile.image) {
          console.log("New image uploaded, refreshing image display...");
          setImagePreview(null); // Clear any preview
          setProfileImage(null); // Clear selected file

          // Force refresh the image after a short delay
          setTimeout(() => {
            refreshProfileImage();
          }, 1000);
        }

        // Refresh documents to show updated image
        if (profile.email) {
          fetchDocuments();
        }
      } else {
        setError(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Error updating profile");
    }
    setLoading(false);
  };

  const tabs = [
    { id: "profile", label: "Profile Update", icon: Settings },
    { id: "tickets", label: "Tickets", icon: FileText },
    { id: "trainings", label: "Trainings", icon: GraduationCap },
    { id: "receipts", label: "Receipts", icon: Receipt },
    { id: "deposits", label: "Deposits", icon: CreditCard },
    { id: "documents", label: "Documents", icon: FileText },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);

    // Refresh profile data when profile tab is clicked
    if (tabId === "profile") {
      fetchProfile();
    }
  };

  const forceRefreshImage = () => {
    if (profile.image) {
      setImageLoading(true);
      // Force browser to reload the image by adding a timestamp
      const img = new Image();
      img.onload = () => {
        console.log("Image force refreshed successfully");
        setImageLoading(false);
      };
      img.onerror = () => {
        console.log("Image force refresh failed");
        setImageLoading(false);
      };
      img.src = `${URL}/${profile.image}?t=${Date.now()}`;
    }
  };

  const testImageLoad = () => {
    // Test with the known image path from the database
    const testImagePath = "uploads/individual_images/1754239585173-a2.avif";
    const testImageUrl = `${URL}/${testImagePath}`;
    console.log("Testing image load with URL:", testImageUrl);

    const img = new Image();
    img.onload = () => {
      console.log("Test image loaded successfully!");
      alert("Test image loaded successfully! URL: " + testImageUrl);
    };
    img.onerror = () => {
      console.log("Test image failed to load");
      alert("Test image failed to load. URL: " + testImageUrl);
    };
    img.src = testImageUrl;
  };

  const refreshProfileImage = () => {
    if (profile.image) {
      console.log("Refreshing profile image:", profile.image);
      setImageLoading(true);

      // Force browser to reload the image by adding a timestamp
      const img = new Image();
      img.onload = () => {
        console.log("Profile image refreshed successfully");
        setImageLoading(false);
        // Trigger a re-render by updating the profile state
        setProfile((prev) => ({ ...prev }));
      };
      img.onerror = () => {
        console.log("Profile image refresh failed");
        setImageLoading(false);
      };
      img.src = `${URL}/${profile.image}?t=${Date.now()}`;
    }
  };

  const renderProfileTab = () => (
    <div className="bg-white rounded-xl p-8 shadow-sm">
      <div className="flex items-start gap-8">
        {/* Left Column - Profile Image */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden relative">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/images/placeholder.jpg";
                  }}
                />
              ) : profile.image ? (
                <img
                  src={`${URL}/${profile.image}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onLoadStart={() => {
                    console.log(
                      "Image loading started:",
                      `${URL}/${profile.image}`
                    );
                    setImageLoading(true);
                  }}
                  onLoad={(e) => {
                    console.log(
                      "Image loaded successfully:",
                      `${URL}/${profile.image}`
                    );
                    setImageLoading(false);
                    // Hide fallback icon when image loads successfully
                    const fallbackIcon = e.target.nextElementSibling;
                    if (fallbackIcon) {
                      fallbackIcon.style.display = "none";
                    }
                  }}
                  onError={(e) => {
                    console.log(
                      "Image failed to load:",
                      `${URL}/${profile.image}`
                    );
                    setImageLoading(false);
                    e.target.style.display = "none";
                    // Show fallback icon when image fails to load
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
                <User size={64} className="text-white" />
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
              {profile.name || "User"}
            </h3>
            <p className="text-sm text-gray-600">{profile.email}</p>
            {profile.image && (
              <p className="text-xs text-gray-500 mt-1">
                Image: {profile.image}
              </p>
            )}
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name
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
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone
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

            {showCheck && (
              <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                <CheckCircle2 size={20} />
                Profile Updated Successfully!
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const renderEnquiriesTab = () => (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Support Enquiries</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search enquiries..."
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
                Ticket ID
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
            {enquiries.map((enquiry) => (
              <tr key={enquiry._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{enquiry._id.slice(-6)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {enquiry.message}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {enquiry.resolve ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle2 size={12} className="mr-1" />
                      Resolved
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Clock size={12} className="mr-1" />
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(enquiry.createdAt).toLocaleDateString()}
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

  const renderTrainingsTab = () => (
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
            {trainings.map((training) => (
              <tr key={training._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {training.trainingTitle || "Training"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {training.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      training.status === "booked"
                        ? "bg-green-100 text-green-800"
                        : training.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {training.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(training.createdAt).toLocaleDateString()}
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

  const renderDepositsTab = () => (
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
            {deposits.map((deposit) => (
              <tr key={deposit._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #
                  {deposit.razorpay_payment_id?.slice(-6) ||
                    deposit._id.slice(-6)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {deposit.for}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{deposit.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      deposit.status === "success"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {deposit.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(deposit.createdAt).toLocaleDateString()}
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
        <h3 className="text-xl font-bold text-gray-800">
          Uploaded Documents & Images
        </h3>
      </div>

      <div className="p-6">
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No documents uploaded
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by uploading your documents and images.
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
      case "tickets":
        return renderEnquiriesTab();
      case "trainings":
        return renderTrainingsTab();
      case "receipts":
        return renderReceiptsTab();
      case "deposits":
        return renderDepositsTab();
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
            Individual Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {profile.name || "User"}! Manage your profile,
            trainings, and transactions.
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

export default IndividualProfile;
