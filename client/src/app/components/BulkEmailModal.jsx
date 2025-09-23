"use client";

import React, { useState, useEffect } from "react";
import { 
  FaTimes, 
  FaPaperPlane, 
  FaUsers, 
  FaCalendarAlt,
  FaEye,
  FaSave,
  FaSpinner
} from "react-icons/fa";
import RichTextEditor from "./RichTextEditor";
import { toast } from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";

const BulkEmailModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    content: "",
    htmlContent: "",
    targetAudience: "all",
    customFilters: {
      status: [],
      source: [],
      tags: []
    },
    template: "newsletter",
    scheduledAt: ""
  });

  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audienceStats, setAudienceStats] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchAudienceStats();
    }
  }, [isOpen]);

  const fetchAudienceStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE}/newsletter-subscriptions/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAudienceStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching audience stats:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCustomFilterChange = (filterType, value) => {
    setFormData(prev => ({
      ...prev,
      customFilters: {
        ...prev.customFilters,
        [filterType]: value
      }
    }));
  };

  const getTargetCount = () => {
    switch (formData.targetAudience) {
      case "all":
        return audienceStats.active || 0;
      case "recent":
        return audienceStats.recent || 0;
      case "custom":
        return "Custom selection";
      default:
        return 0;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subject || !formData.htmlContent) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE}/newsletter-subscriptions/send-bulk-email`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message);
        onSuccess && onSuccess(data.campaign);
        onClose();
        // Reset form
        setFormData({
          title: "",
          subject: "",
          content: "",
          htmlContent: "",
          targetAudience: "all",
          customFilters: {
            status: [],
            source: [],
            tags: []
          },
          template: "newsletter",
          scheduledAt: ""
        });
      } else {
        toast.error(data.message || "Failed to send bulk email");
      }
    } catch (error) {
      console.error("Error sending bulk email:", error);
      toast.error("Failed to send bulk email");
    } finally {
      setIsLoading(false);
    }
  };

  const emailTemplates = [
    {
      id: "newsletter",
      name: "Newsletter",
      subject: "IICPA Institute Newsletter - {{date}}",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">IICPA Institute</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Professional Development & Training</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <h2 style="color: #333; margin-bottom: 20px;">Dear Subscriber,</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              We hope this newsletter finds you well. Here are the latest updates from IICPA Institute:
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">📚 Latest Courses</h3>
              <p style="color: #666; margin-bottom: 0;">Discover our newest professional development courses designed to enhance your skills and career prospects.</p>
            </div>
            
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">🎯 Upcoming Events</h3>
              <p style="color: #666; margin-bottom: 0;">Join our upcoming workshops and seminars to stay ahead in your professional journey.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">View All Courses</a>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>© 2024 IICPA Institute. All rights reserved.</p>
            <p><a href="#" style="color: #667eea;">Unsubscribe</a> | <a href="#" style="color: #667eea;">Privacy Policy</a></p>
          </div>
        </div>
      `
    },
    {
      id: "announcement",
      name: "Announcement",
      subject: "Important Announcement from IICPA Institute",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #ff6b6b; color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">📢 Important Announcement</h1>
          </div>
          
          <div style="padding: 30px; background: white;">
            <h2 style="color: #333; margin-bottom: 20px;">Dear Valued Member,</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              We have an important update to share with you regarding our services and upcoming changes.
            </p>
            
            <div style="border-left: 4px solid #ff6b6b; padding-left: 20px; margin: 20px 0;">
              <p style="color: #333; font-weight: bold; margin-bottom: 10px;">Key Points:</p>
              <ul style="color: #666; line-height: 1.6;">
                <li>New course offerings starting next month</li>
                <li>Updated certification requirements</li>
                <li>Enhanced online learning platform</li>
              </ul>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              For more details, please visit our website or contact our support team.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Learn More</a>
            </div>
          </div>
        </div>
      `
    },
    {
      id: "promotion",
      name: "Promotion",
      subject: "Special Offer - Limited Time Only!",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); color: #333; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Special Offer!</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: bold;">Limited Time Only</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
              <h2 style="color: #856404; margin: 0; font-size: 24px;">50% OFF</h2>
              <p style="color: #856404; margin: 10px 0 0 0;">All Professional Development Courses</p>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Don't miss this incredible opportunity to advance your career with our premium courses at half the price!
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">✨ What's Included:</h3>
              <ul style="color: #666; line-height: 1.6;">
                <li>Access to all course materials</li>
                <li>Expert instructor support</li>
                <li>Certificate of completion</li>
                <li>Lifetime access to updates</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background: #ff6b6b; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px; font-weight: bold;">Claim Your Discount</a>
            </div>
            
            <p style="color: #999; font-size: 14px; text-align: center; margin-top: 20px;">
              Offer expires in 7 days. Terms and conditions apply.
            </p>
          </div>
        </div>
      `
    }
  ];

  const applyTemplate = (template) => {
    setFormData(prev => ({
      ...prev,
      subject: template.subject,
      htmlContent: template.htmlContent,
      template: template.id
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Send Bulk Email</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter campaign title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Subject *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email subject"
                required
              />
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: "all", label: "All Active", count: audienceStats.active },
                { value: "recent", label: "Recent (30 days)", count: audienceStats.recent },
                { value: "custom", label: "Custom Selection", count: "Custom" }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="targetAudience"
                    value={option.value}
                    checked={formData.targetAudience === option.value}
                    onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                    className="text-blue-600"
                  />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-500">({option.count})</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Filters */}
          {formData.targetAudience === "custom" && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Custom Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    multiple
                    value={formData.customFilters.status}
                    onChange={(e) => handleCustomFilterChange("status", Array.from(e.target.selectedOptions, option => option.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="unsubscribed">Unsubscribed</option>
                    <option value="bounced">Bounced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                  <select
                    multiple
                    value={formData.customFilters.source}
                    onChange={(e) => handleCustomFilterChange("source", Array.from(e.target.selectedOptions, option => option.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="newsletter">Newsletter</option>
                    <option value="contact">Contact</option>
                    <option value="course">Course</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Email Templates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Templates
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {emailTemplates.map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => applyTemplate(template)}
                >
                  <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{template.subject}</p>
                  <button
                    type="button"
                    className="text-blue-600 text-sm hover:text-blue-800"
                  >
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Email Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Content *
            </label>
            <RichTextEditor
              value={formData.htmlContent}
              onChange={(content) => handleInputChange("htmlContent", content)}
              placeholder="Compose your email content here..."
              height="300px"
            />
          </div>

          {/* Scheduling */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule Email (Optional)
            </label>
            <input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => handleInputChange("scheduledAt", e.target.value)}
              className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Leave empty to send immediately
            </p>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Campaign Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Recipients:</span>
                <div className="text-blue-900">{getTargetCount()}</div>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Template:</span>
                <div className="text-blue-900 capitalize">{formData.template}</div>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Status:</span>
                <div className="text-blue-900">
                  {formData.scheduledAt ? "Scheduled" : "Send Now"}
                </div>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Subject:</span>
                <div className="text-blue-900 truncate">{formData.subject}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  <span>{formData.scheduledAt ? "Schedule Email" : "Send Now"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkEmailModal;
