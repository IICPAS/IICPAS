import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaUserTie, FaChartBar, FaFileAlt, FaClipboardCheck, FaUsers, FaHandshake, FaPlus, FaEdit, FaTrash, FaSave } from "react-icons/fa";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const iconOptions = [
  { value: "FaUserTie", label: "User Tie", icon: <FaUserTie /> },
  { value: "FaChartBar", label: "Chart", icon: <FaChartBar /> },
  { value: "FaFileAlt", label: "File", icon: <FaFileAlt /> },
  { value: "FaClipboardCheck", label: "Clipboard", icon: <FaClipboardCheck /> },
  { value: "FaUsers", label: "Users", icon: <FaUsers /> },
  { value: "FaHandshake", label: "Handshake", icon: <FaHandshake /> },
];

export default function CareerGuidanceTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [newService, setNewService] = useState({
    icon: "FaUserTie",
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
      const response = await axios.get(`${API_BASE}/api/v1/website/career-guidance`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching career guidance data:", error);
      // Set default data if API fails
      setData({
        hero: {
          title: "Career Guidance",
          subtitle: "Get expert career guidance and counseling to make informed decisions about your professional future in finance and accounting.",
          button1: { text: "Book Consultation", link: "#consultation" },
          button2: { text: "Explore Career Paths", link: "#career-paths" },
          backgroundGradient: { from: "from-teal-200", via: "via-white", to: "to-blue-200" },
          textColor: "text-gray-800"
        },
        mainSection: {
          title: "Comprehensive Career Services",
          subtitle: "From career planning to job placement, we provide end-to-end support for your professional journey.",
          ctaTitle: "Ready to Advance Your Career?",
          ctaDescription: "Join thousands of professionals who have successfully advanced their careers with our expert guidance and support.",
          ctaButton1: { text: "Schedule Consultation", link: "/contact" },
          ctaButton2: { text: "View Success Stories", link: "#success-stories" }
        },
        services: [
          {
            icon: "FaUserTie",
            title: "Career Counseling",
            description: "One-on-one sessions with experienced career counselors to help you choose the right path.",
            feature: "Personalized Guidance",
            link: "#counseling"
          },
          {
            icon: "FaChartBar",
            title: "Industry Insights",
            description: "Stay updated with the latest trends, opportunities, and requirements in the finance industry.",
            feature: "Market Updates",
            link: "#insights"
          },
          {
            icon: "FaFileAlt",
            title: "Resume Building",
            description: "Professional resume writing services and interview preparation to land your dream job.",
            feature: "Professional Support",
            link: "#resume"
          },
          {
            icon: "FaClipboardCheck",
            title: "Skill Assessment",
            description: "Comprehensive skill assessments to identify your strengths and areas for improvement.",
            feature: "Detailed Analysis",
            link: "#assessment"
          },
          {
            icon: "FaUsers",
            title: "Networking Opportunities",
            description: "Connect with industry professionals and alumni through our networking events and platforms.",
            feature: "Industry Connections",
            link: "#networking"
          },
          {
            icon: "FaHandshake",
            title: "Job Placement Support",
            description: "Dedicated placement support with job matching, interview scheduling, and follow-up assistance.",
            feature: "End-to-End Support",
            link: "#placement"
          }
        ],
        seo: {
          title: "Career Guidance - IICPA Institute",
          description: "Get expert career guidance and counseling for finance and accounting professionals at IICPA Institute.",
          keywords: "career guidance, career counseling, finance careers, accounting careers, job placement, IICPA"
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
      await axios.put(`${API_BASE}/api/v1/website/career-guidance`, data);
      toast.success("Career Guidance updated successfully!");
    } catch (error) {
      console.error("Error saving career guidance:", error);
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

  const handleServiceChange = (index, field, value) => {
    setData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  const addService = () => {
    setData(prev => ({
      ...prev,
      services: [...prev.services, { ...newService }]
    }));
    setNewService({
      icon: "FaUserTie",
      title: "",
      description: "",
      feature: "",
      link: "#",
      isActive: true
    });
  };

  const removeService = (index) => {
    setData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
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
        <h2 className="text-2xl font-bold text-gray-900">Career Guidance Page Settings</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
            <textarea
              value={data.hero.subtitle}
              onChange={(e) => handleInputChange('hero', 'subtitle', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Button 1 Text</label>
            <input
              type="text"
              value={data.hero.button1.text}
              onChange={(e) => handleInputChange('hero', 'button1', { ...data.hero.button1, text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Button 2 Text</label>
            <input
              type="text"
              value={data.hero.button2.text}
              onChange={(e) => handleInputChange('hero', 'button2', { ...data.hero.button2, text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
            <textarea
              value={data.mainSection.subtitle}
              onChange={(e) => handleInputChange('mainSection', 'subtitle', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Career Services</h3>
          <button
            onClick={addService}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FaPlus />
            Add Service
          </button>
        </div>

        <div className="space-y-4">
          {data.services.map((service, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                  <select
                    value={service.icon}
                    onChange={(e) => handleServiceChange(index, 'icon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    value={service.title}
                    onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feature</label>
                  <input
                    type="text"
                    value={service.feature}
                    onChange={(e) => handleServiceChange(index, 'feature', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={service.description}
                    onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeService(index)}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
            <input
              type="text"
              value={data.seo.keywords}
              onChange={(e) => handleInputChange('seo', 'keywords', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">SEO Description</label>
            <textarea
              value={data.seo.description}
              onChange={(e) => handleInputChange('seo', 'description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
