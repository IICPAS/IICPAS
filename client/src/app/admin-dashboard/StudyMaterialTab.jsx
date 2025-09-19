import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaBook, FaPlay, FaCalculator, FaFileAlt, FaChartLine, FaClipboardList, FaPlus, FaEdit, FaTrash, FaSave } from "react-icons/fa";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const iconOptions = [
  { value: "FaBook", label: "Book", icon: <FaBook /> },
  { value: "FaPlay", label: "Play", icon: <FaPlay /> },
  { value: "FaCalculator", label: "Calculator", icon: <FaCalculator /> },
  { value: "FaFileAlt", label: "File", icon: <FaFileAlt /> },
  { value: "FaChartLine", label: "Chart", icon: <FaChartLine /> },
  { value: "FaClipboardList", label: "Clipboard", icon: <FaClipboardList /> },
];

export default function StudyMaterialTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [newMaterial, setNewMaterial] = useState({
    icon: "FaBook",
    title: "",
    description: "",
    feature: "",
    link: "#",
    isActive: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/v1/website/study-material`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching study material data:", error);
      // Set default data if API fails
      setData({
        hero: {
          title: "Study Materials",
          subtitle: "Access comprehensive study materials, notes, and resources to excel in your finance and accounting journey.",
          button1: { text: "Browse Materials", link: "#materials" },
          button2: { text: "Download Resources", link: "#download" },
          backgroundGradient: { from: "from-teal-200", via: "via-white", to: "to-blue-200" },
          textColor: "text-gray-800"
        },
        mainSection: {
          title: "Comprehensive Study Resources",
          subtitle: "Everything you need to succeed in your finance and accounting studies, all in one place.",
          ctaTitle: "Ready to Start Learning?",
          ctaDescription: "Join thousands of students who have successfully completed their finance and accounting journey with our comprehensive study materials.",
          ctaButton1: { text: "Get Started Today", link: "/student-login" },
          ctaButton2: { text: "View Sample Materials", link: "#samples" }
        },
        materials: [
          {
            icon: "FaBook",
            title: "Course Notes",
            description: "Detailed notes covering all major topics in finance, accounting, taxation, and auditing.",
            feature: "Available for all courses",
            link: "#notes"
          },
          {
            icon: "FaPlay",
            title: "Video Lectures",
            description: "High-quality video content with expert instructors explaining complex concepts.",
            feature: "HD Quality Videos",
            link: "#videos"
          },
          {
            icon: "FaCalculator",
            title: "Practice Problems",
            description: "Extensive collection of practice problems with step-by-step solutions.",
            feature: "1000+ Problems",
            link: "#problems"
          },
          {
            icon: "FaFileAlt",
            title: "Reference Books",
            description: "Curated list of recommended textbooks and reference materials.",
            feature: "Expert Recommended",
            link: "#books"
          },
          {
            icon: "FaChartLine",
            title: "Case Studies",
            description: "Real-world case studies to apply theoretical knowledge in practical scenarios.",
            feature: "Industry Cases",
            link: "#cases"
          },
          {
            icon: "FaClipboardList",
            title: "Formula Sheets",
            description: "Quick reference guides with all important formulas and calculations.",
            feature: "Quick Reference",
            link: "#formulas"
          }
        ],
        seo: {
          title: "Study Materials - IICPA Institute",
          description: "Access comprehensive study materials, notes, and resources for finance and accounting courses at IICPA Institute.",
          keywords: "study materials, finance, accounting, notes, resources, IICPA"
        }
      });
      toast.error("Using default data - API connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_BASE}/api/v1/website/study-material`, data);
      toast.success("Study Material updated successfully!");
    } catch (error) {
      console.error("Error saving study material:", error);
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleMaterialChange = (index, field, value) => {
    setData(prev => ({
      ...prev,
      materials: prev.materials.map((material, i) => 
        i === index ? { ...material, [field]: value } : material
      )
    }));
  };

  const addMaterial = () => {
    setData(prev => ({
      ...prev,
      materials: [...prev.materials, { ...newMaterial }]
    }));
    setNewMaterial({
      icon: "FaBook",
      title: "",
      description: "",
      feature: "",
      link: "#",
      isActive: true
    });
  };

  const removeMaterial = (index) => {
    setData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600">Failed to load data</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Study Material Page Settings</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
        >
          <FaSave />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Hero Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={data.hero.title}
              onChange={(e) => handleInputChange('hero', 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
            <textarea
              value={data.hero.subtitle}
              onChange={(e) => handleInputChange('hero', 'subtitle', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Button 1 Text</label>
            <input
              type="text"
              value={data.hero.button1.text}
              onChange={(e) => handleInputChange('hero', 'button1', { ...data.hero.button1, text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Button 2 Text</label>
            <input
              type="text"
              value={data.hero.button2.text}
              onChange={(e) => handleInputChange('hero', 'button2', { ...data.hero.button2, text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Main Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={data.mainSection.title}
              onChange={(e) => handleInputChange('mainSection', 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
            <textarea
              value={data.mainSection.subtitle}
              onChange={(e) => handleInputChange('mainSection', 'subtitle', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Materials */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Study Materials</h3>
          <button
            onClick={addMaterial}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FaPlus />
            Add Material
          </button>
        </div>

        <div className="space-y-4">
          {data.materials.map((material, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                  <select
                    value={material.icon}
                    onChange={(e) => handleMaterialChange(index, 'icon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {iconOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={material.title}
                    onChange={(e) => handleMaterialChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feature</label>
                  <input
                    type="text"
                    value={material.feature}
                    onChange={(e) => handleMaterialChange(index, 'feature', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={material.description}
                    onChange={(e) => handleMaterialChange(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeMaterial(index)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">SEO Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SEO Title</label>
            <input
              type="text"
              value={data.seo.title}
              onChange={(e) => handleInputChange('seo', 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
            <input
              type="text"
              value={data.seo.keywords}
              onChange={(e) => handleInputChange('seo', 'keywords', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">SEO Description</label>
            <textarea
              value={data.seo.description}
              onChange={(e) => handleInputChange('seo', 'description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
