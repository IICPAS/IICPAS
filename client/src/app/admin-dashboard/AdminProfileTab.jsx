"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Upload, User, Save, Edit3, X } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminProfileTab() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    image: "",
  });

  const [originalData, setOriginalData] = useState({});

  // Fetch admin data on mount
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "",
        image: user.image || "",
      });
      setOriginalData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "",
        image: user.image || "",
      });
      setLoading(false);
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle image change
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

  // Handle profile image upload
  const handleImageUpload = async () => {
    if (!profileImage) {
      toast.error("Please select an image first");
      return;
    }

    setImageLoading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("image", profileImage);

      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const token = localStorage.getItem("adminToken");
      
      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        return;
      }

      const response = await fetch(`${API_BASE}/upload/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        handleInputChange("image", data.relativePath);
        setImagePreview(null);
        setProfileImage(null);
        toast.success("Profile image uploaded successfully!");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error("Error uploading image");
    } finally {
      setImageLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const token = localStorage.getItem("adminToken");
      
      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        return;
      }

      const response = await fetch(`${API_BASE}/admin/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Profile updated successfully!");
        setOriginalData({ ...formData });
        setEditing(false);
        // Update the user context if needed
        window.location.reload(); // Simple refresh to update user context
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setEditing(false);
    setImagePreview(null);
    setProfileImage(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen lg:flex-row gap-6 px-6 pt-4 pb-10 font-sans">
      {/* Left Sidebar */}
      <div className="w-full lg:w-1/4 bg-white border rounded-xl shadow-md p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : formData.image ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}${formData.image}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={32} className="text-gray-500" />
              )}
            </div>
            {/* Upload Button */}
            <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
              <Upload size={16} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Upload Image Button */}
          {profileImage && (
            <div className="w-full">
              <button
                onClick={handleImageUpload}
                disabled={imageLoading}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {imageLoading ? "Uploading..." : "Upload Image"}
              </button>
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold text-blue-700">{formData.name}</h2>
            <p className="text-sm text-gray-700">{formData.email}</p>
            <p className="text-sm text-gray-800 font-semibold">
              {formData.phone || "Not provided"}
            </p>
            <p className="text-sm text-blue-600 font-medium capitalize">
              {formData.role}
            </p>
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
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-semibold text-blue-800 mb-2">Profile Information</h3>
              <p className="text-sm text-blue-600">
                Manage your admin profile information. You can update all your details.
              </p>
            </div>
            
            <div className="flex gap-2">
              {editing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Save size={16} />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Edit3 size={16} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Full Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="w-full p-3 border rounded-lg bg-gray-50 text-gray-700">
                  {formData.name}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Email Address
              </label>
              {editing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              ) : (
                <div className="w-full p-3 border rounded-lg bg-gray-50 text-gray-700">
                  {formData.email}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Phone Number
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                />
              ) : (
                <div className="w-full p-3 border rounded-lg bg-gray-50 text-gray-700">
                  {formData.phone || "Not provided"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Role
              </label>
              {editing ? (
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="superadmin">Super Admin</option>
                  <option value="hr">HR</option>
                  <option value="sales">Sales</option>
                </select>
              ) : (
                <div className="w-full p-3 border rounded-lg bg-gray-50 text-gray-700 capitalize">
                  {formData.role}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-800 mb-1">Profile Management</h4>
            <p className="text-sm text-blue-700">
              As an admin, you have full control over your profile information. You can update your name, email, phone number, and role. 
              Changes will be saved immediately and reflected across the system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
