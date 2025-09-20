"use client";

import { useState, useEffect } from "react";
import { FaSave, FaEdit, FaTrash, FaCheck, FaTimes, FaPlus, FaMinus, FaEnvelope, FaRocket, FaCheckCircle, FaStar } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { authenticatedGet, authenticatedPost, authenticatedPut, authenticatedDelete } from "@/utils/api";

export default function NewsletterSectionTab() {
  const { user } = useAuth();
  const [newsletterSectionEntries, setNewsletterSectionEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    badge: {
      text: "",
      icon: "FaEnvelope"
    },
    title: {
      part1: "",
      part2: ""
    },
    description: "",
    features: [],
    form: {
      placeholder: "",
      buttonText: "",
      successText: "",
      buttonIcon: "FaRocket",
      successIcon: "FaCheckCircle"
    },
    stats: {
      rating: "",
      subscribers: ""
    },
    image: {
      src: "",
      alt: ""
    },
    colors: {
      badge: "text-[#3cd664]",
      badgeBg: "bg-[#3cd664]/10",
      title: "text-gray-900",
      titleAccent: "from-[#3cd664] to-[#22c55e]",
      description: "text-gray-600",
      background: "bg-gradient-to-br from-[#f8fffe] via-[#f0fdf4] to-[#ecfdf5]",
      button: "from-[#3cd664] to-[#22c55e]",
      buttonHover: "from-[#22c55e] to-[#16a34a]"
    }
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newFeature, setNewFeature] = useState({
    text: "",
    icon: "FaCheckCircle"
  });

  const iconOptions = [
    { value: "FaEnvelope", label: "Envelope", icon: FaEnvelope },
    { value: "FaRocket", label: "Rocket", icon: FaRocket },
    { value: "FaCheckCircle", label: "Check Circle", icon: FaCheckCircle },
    { value: "FaStar", label: "Star", icon: FaStar }
  ];

  const colorOptions = [
    { value: "text-[#3cd664]", label: "Green" },
    { value: "text-blue-500", label: "Blue" },
    { value: "text-purple-500", label: "Purple" },
    { value: "text-yellow-500", label: "Yellow" },
    { value: "text-red-500", label: "Red" },
    { value: "text-gray-900", label: "Dark Gray" },
    { value: "text-gray-600", label: "Gray" }
  ];

  const backgroundOptions = [
    { value: "bg-gradient-to-br from-[#f8fffe] via-[#f0fdf4] to-[#ecfdf5]", label: "Light Green Gradient" },
    { value: "bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200", label: "Light Blue Gradient" },
    { value: "bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200", label: "Light Purple Gradient" },
    { value: "bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200", label: "Light Yellow Gradient" },
    { value: "bg-white", label: "White" },
    { value: "bg-gray-50", label: "Light Gray" }
  ];

  const gradientOptions = [
    { value: "from-[#3cd664] to-[#22c55e]", label: "Green Gradient" },
    { value: "from-blue-500 to-blue-600", label: "Blue Gradient" },
    { value: "from-purple-500 to-purple-600", label: "Purple Gradient" },
    { value: "from-yellow-500 to-orange-500", label: "Yellow to Orange" },
    { value: "from-red-500 to-pink-500", label: "Red to Pink" },
    { value: "from-indigo-500 to-purple-500", label: "Indigo to Purple" }
  ];

  const badgeBgOptions = [
    { value: "bg-[#3cd664]/10", label: "Green Light" },
    { value: "bg-blue-500/10", label: "Blue Light" },
    { value: "bg-purple-500/10", label: "Purple Light" },
    { value: "bg-yellow-500/10", label: "Yellow Light" },
    { value: "bg-red-500/10", label: "Red Light" },
    { value: "bg-gray-500/10", label: "Gray Light" }
  ];

  useEffect(() => {
    if (user) {
      fetchNewsletterSectionEntries();
    }
  }, [user]);

  // Cleanup image preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const fetchNewsletterSectionEntries = async () => {
    try {
      const response = await authenticatedGet("/newsletter-section/all");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setNewsletterSectionEntries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching newsletter section entries:", error);
      toast.error("Failed to fetch NewsletterSection content");
      setNewsletterSectionEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child, subChild] = field.split(".");
      if (subChild) {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [subChild]: value
            }
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleFeatureAdd = () => {
    if (newFeature.text.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, { ...newFeature }]
      }));
      setNewFeature({ text: "", icon: "FaCheckCircle" });
    }
  };

  const handleFeatureRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleFeatureUpdate = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if image is selected (required for new entries)
    if (!selectedImage) {
      toast.error("Please select an image to upload");
      return;
    }
    
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add all form data
      formDataToSend.append("badge", JSON.stringify(formData.badge));
      formDataToSend.append("title", JSON.stringify(formData.title));
      formDataToSend.append("description", formData.description);
      formDataToSend.append("features", JSON.stringify(formData.features));
      formDataToSend.append("form", JSON.stringify(formData.form));
      formDataToSend.append("stats", JSON.stringify(formData.stats));
      formDataToSend.append("imageAlt", formData.image.alt); // Use different key for alt text
      formDataToSend.append("colors", JSON.stringify(formData.colors));
      
      // Add the image file
      formDataToSend.append("image", selectedImage);
      
      const response = await authenticatedPost("/newsletter-section", formDataToSend, true);

      if (response.ok) {
        toast.success("NewsletterSection content created successfully!");
        fetchNewsletterSectionEntries();
        resetForm();
      } else {
        toast.error("Failed to create NewsletterSection content");
      }
    } catch (error) {
      toast.error("Error creating NewsletterSection content");
    }
  };

  const handleUpdate = async (id) => {
    try {
      let response;
      
      if (selectedImage) {
        // If new image is selected, use FormData
        const formDataToSend = new FormData();
        
        // Add all form data
        formDataToSend.append("badge", JSON.stringify(formData.badge));
        formDataToSend.append("title", JSON.stringify(formData.title));
        formDataToSend.append("description", formData.description);
        formDataToSend.append("features", JSON.stringify(formData.features));
        formDataToSend.append("form", JSON.stringify(formData.form));
        formDataToSend.append("stats", JSON.stringify(formData.stats));
        formDataToSend.append("imageAlt", formData.image.alt); // Use different key for alt text
        formDataToSend.append("colors", JSON.stringify(formData.colors));
        
        // Add the new image file
        formDataToSend.append("image", selectedImage);
        
        response = await authenticatedPut(`/newsletter-section/${id}`, formDataToSend, true);
      } else {
        // If no new image, send JSON data (keep existing image)
        response = await authenticatedPut(`/newsletter-section/${id}`, formData);
      }

      if (response.ok) {
        toast.success("NewsletterSection content updated successfully!");
        fetchNewsletterSectionEntries();
        setEditingId(null);
        resetForm();
      } else {
        toast.error("Failed to update NewsletterSection content");
      }
    } catch (error) {
      toast.error("Error updating NewsletterSection content");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this NewsletterSection content?")) return;

    try {
      const response = await authenticatedDelete(`/newsletter-section/${id}`);

      if (response.ok) {
        toast.success("NewsletterSection content deleted successfully!");
        fetchNewsletterSectionEntries();
      } else {
        toast.error("Failed to delete NewsletterSection content");
      }
    } catch (error) {
      toast.error("Error deleting NewsletterSection content");
    }
  };

  const handleActivate = async (id) => {
    try {
      const response = await authenticatedPut(`/newsletter-section/activate/${id}`, {});

      if (response.ok) {
        toast.success("NewsletterSection content activated successfully!");
        fetchNewsletterSectionEntries();
      } else {
        toast.error("Failed to activate NewsletterSection content");
      }
    } catch (error) {
      toast.error("Error activating NewsletterSection content");
    }
  };

  const startEdit = (entry) => {
    setEditingId(entry._id);
    setFormData(entry);
    // Clear any existing image selection when editing
    setSelectedImage(null);
    setImagePreview(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      badge: {
        text: "",
        icon: "FaEnvelope"
      },
      title: {
        part1: "",
        part2: ""
      },
      description: "",
      features: [],
      form: {
        placeholder: "",
        buttonText: "",
        successText: "",
        buttonIcon: "FaRocket",
        successIcon: "FaCheckCircle"
      },
      stats: {
        rating: "",
        subscribers: ""
      },
      image: {
        src: "",
        alt: ""
      },
      colors: {
        badge: "text-[#3cd664]",
        badgeBg: "bg-[#3cd664]/10",
        title: "text-gray-900",
        titleAccent: "from-[#3cd664] to-[#22c55e]",
        description: "text-gray-600",
        background: "bg-gradient-to-br from-[#f8fffe] via-[#f0fdf4] to-[#ecfdf5]",
        button: "from-[#3cd664] to-[#22c55e]",
        buttonHover: "from-[#22c55e] to-[#16a34a]"
      }
    });
    setNewFeature({ text: "", icon: "FaCheckCircle" });
    setSelectedImage(null);
    setImagePreview(null);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Newsletter Section Management</h1>
        <p className="text-gray-600">Manage your website's newsletter section content and styling</p>
      </div>

      {/* Create New NewsletterSection Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Newsletter Section Content" : "Create New Newsletter Section Content"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Badge */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Badge</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={formData.badge.text}
                  onChange={(e) => handleInputChange("badge.text", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Stay Updated"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badge Icon
                </label>
                <select
                  value={formData.badge.icon}
                  onChange={(e) => handleInputChange("badge.icon", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {iconOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Title</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title Part 1
                </label>
                <input
                  type="text"
                  value={formData.title.part1}
                  onChange={(e) => handleInputChange("title.part1", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Never Miss Our"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title Part 2
                </label>
                <input
                  type="text"
                  value={formData.title.part2}
                  onChange={(e) => handleInputChange("title.part2", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Latest Updates"
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Get exclusive access to new courses, special offers, and educational content delivered straight to your inbox. Join thousands of learners who stay ahead."
              required
            />
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Features</h3>
            <div className="space-y-4">
              {formData.features.map((feature, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-700">Feature {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => handleFeatureRemove(index)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-md"
                    >
                      <FaMinus />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Feature Text
                      </label>
                      <input
                        type="text"
                        value={feature.text}
                        onChange={(e) => handleFeatureUpdate(index, "text", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Weekly Updates"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Feature Icon
                      </label>
                      <select
                        value={feature.icon}
                        onChange={(e) => handleFeatureUpdate(index, "icon", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {iconOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add New Feature */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-3">Add New Feature</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Feature Text
                    </label>
                    <input
                      type="text"
                      value={newFeature.text}
                      onChange={(e) => setNewFeature(prev => ({ ...prev, text: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Weekly Updates"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Feature Icon
                    </label>
                    <select
                      value={newFeature.icon}
                      onChange={(e) => setNewFeature(prev => ({ ...prev, icon: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {iconOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleFeatureAdd}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <FaPlus className="inline mr-2" />
                      Add Feature
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Form Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Placeholder Text
                </label>
                <input
                  type="text"
                  value={formData.form.placeholder}
                  onChange={(e) => handleInputChange("form.placeholder", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  value={formData.form.buttonText}
                  onChange={(e) => handleInputChange("form.buttonText", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Subscribe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Success Text
                </label>
                <input
                  type="text"
                  value={formData.form.successText}
                  onChange={(e) => handleInputChange("form.successText", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Done!"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Icon
                </label>
                <select
                  value={formData.form.buttonIcon}
                  onChange={(e) => handleInputChange("form.buttonIcon", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {iconOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Success Icon
                </label>
                <select
                  value={formData.form.successIcon}
                  onChange={(e) => handleInputChange("form.successIcon", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {iconOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <input
                  type="text"
                  value={formData.stats.rating}
                  onChange={(e) => handleInputChange("stats.rating", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="4.9/5 Rating"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subscribers
                </label>
                <input
                  type="text"
                  value={formData.stats.subscribers}
                  onChange={(e) => handleInputChange("stats.subscribers", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10,000+ Subscribers"
                />
              </div>
            </div>
          </div>

          {/* Image */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Image</h3>
            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {editingId ? "Upload New Image (Optional)" : "Upload Image"} 
                  {!editingId && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!editingId}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: JPG, PNG, GIF. Max size: 5MB
                  {editingId && " - Leave empty to keep current image"}
                </p>
              </div>
              
              {/* Image Preview */}
              {imagePreview && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Preview
                  </label>
                  <div className="border border-gray-300 rounded-md p-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full h-48 object-contain mx-auto"
                    />
                  </div>
                </div>
              )}
              
              {/* Image Alt Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Alt Text
                </label>
                <input
                  type="text"
                  value={formData.image.alt}
                  onChange={(e) => handleInputChange("image.alt", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Newsletter Student"
                />
              </div>
            </div>
          </div>

          {/* Color Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Color Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(formData.colors).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <select
                    value={value}
                    onChange={(e) => handleInputChange(`colors.${key}`, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {key === 'background' ? 
                      backgroundOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      )) :
                      key === 'badgeBg' ?
                      badgeBgOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      )) :
                      key.includes('Accent') || key.includes('button') ?
                      gradientOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      )) :
                      colorOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))
                    }
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
              {editingId ? "Update" : "Create"} Newsletter Section Content
            </button>
          </div>
        </form>
      </div>

      {/* Existing NewsletterSection Contents */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Existing Newsletter Section Contents</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {Array.isArray(newsletterSectionEntries) && newsletterSectionEntries.map((entry) => (
            <div key={entry._id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {entry.title.part1} {entry.title.part2}
                    </h3>
                    {entry.isActive && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  
                  <div className="text-gray-600 mb-2">
                    <span className="font-medium">Badge: </span>
                    {entry.badge.text}
                  </div>
                  
                  <div className="text-gray-600 mb-2">
                    <span className="font-medium">Features: </span>
                    {entry.features.length} items
                  </div>
                  
                  <div className="text-gray-600">
                    <span className="font-medium">Stats: </span>
                    {entry.stats.rating}, {entry.stats.subscribers}
                  </div>
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
