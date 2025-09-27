"use client";

import React, { useState, useEffect } from "react";
import { FaEdit, FaSave, FaPlus, FaTrash, FaEye, FaTimes, FaFileExcel } from "react-icons/fa";
import toast from "react-hot-toast";
import * as XLSX from 'xlsx';

interface Subsection {
  title?: string;
  content?: string;
  listItems?: string[];
}

interface Section {
  title: string;
  content: string;
  subsections?: Subsection[];
  listItems?: string[];
}

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  businessHours: string;
}

interface RefundPolicyData {
  _id?: string;
  title: string;
  lastUpdated: string;
  sections: Section[];
  contactInfo: ContactInfo;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const RefundPolicyTab = () => {
  const [refundPolicies, setRefundPolicies] = useState<RefundPolicyData[]>([]);
  const [currentPolicy, setCurrentPolicy] = useState<RefundPolicyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showEditPage, setShowEditPage] = useState(false);

  useEffect(() => {
    fetchRefundPolicies();
  }, []);

  const fetchRefundPolicies = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const response = await fetch(`${API_BASE}/refund-policy/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setRefundPolicies(data.data);
        if (data.data.length > 0) {
          setCurrentPolicy(data.data[0]);
        }
      } else {
        toast.error("Failed to fetch refund policies");
      }
    } catch (error) {
      console.error("Error fetching refund policies:", error);
      toast.error("Error fetching refund policies");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentPolicy) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      let response;

      if (currentPolicy._id) {
        // Update existing policy
        response = await fetch(`${API_BASE}/refund-policy/admin/update/${currentPolicy._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(currentPolicy),
        });
      } else {
        // Create new policy
        response = await fetch(`${API_BASE}/refund-policy/admin/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(currentPolicy),
        });
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success("Refund policy saved successfully");
        setEditing(false);
        setShowEditPage(false);
        fetchRefundPolicies();
      } else {
        toast.error(data.message || "Failed to save refund policy");
      }
    } catch (error) {
      console.error("Error saving refund policy:", error);
      toast.error("Error saving refund policy");
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = async (policyId: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const response = await fetch(`${API_BASE}/refund-policy/admin/activate/${policyId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success("Refund policy activated successfully");
        fetchRefundPolicies();
      } else {
        toast.error(data.message || "Failed to activate refund policy");
      }
    } catch (error) {
      console.error("Error activating refund policy:", error);
      toast.error("Error activating refund policy");
    }
  };

  const handleDelete = async (policyId: string) => {
    if (!confirm("Are you sure you want to delete this refund policy?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const response = await fetch(`${API_BASE}/refund-policy/admin/delete/${policyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success("Refund policy deleted successfully");
        fetchRefundPolicies();
      } else {
        toast.error(data.message || "Failed to delete refund policy");
      }
    } catch (error) {
      console.error("Error deleting refund policy:", error);
      toast.error("Error deleting refund policy");
    }
  };

  const exportToExcel = () => {
    if (!currentPolicy) return;

    const data = [
      ["Refund Policy Export"],
      ["Title", currentPolicy.title],
      ["Last Updated", currentPolicy.lastUpdated],
      ["Created At", new Date(currentPolicy.createdAt || "").toLocaleDateString()],
      ["Updated At", new Date(currentPolicy.updatedAt || "").toLocaleDateString()],
      ["Is Active", currentPolicy.isActive ? "Yes" : "No"],
      [""],
      ["Contact Information"],
      ["Email", currentPolicy.contactInfo.email],
      ["Phone", currentPolicy.contactInfo.phone],
      ["Address", currentPolicy.contactInfo.address],
      ["Business Hours", currentPolicy.contactInfo.businessHours],
      [""],
      ["Sections"]
    ];

    currentPolicy.sections.forEach((section, index) => {
      data.push([`Section ${index + 1}: ${section.title}`]);
      data.push(["Content", section.content]);
      
      if (section.subsections && section.subsections.length > 0) {
        section.subsections.forEach((subsection, subIndex) => {
          data.push([`Subsection ${subIndex + 1}: ${subsection.title || "Untitled"}`]);
          if (subsection.content) {
            data.push(["Content", subsection.content]);
          }
          if (subsection.listItems && subsection.listItems.length > 0) {
            data.push(["List Items"]);
            subsection.listItems.forEach((item, itemIndex) => {
              data.push([`${itemIndex + 1}.`, item]);
            });
          }
        });
      }
      
      if (section.listItems && section.listItems.length > 0) {
        data.push(["List Items"]);
        section.listItems.forEach((item, itemIndex) => {
          data.push([`${itemIndex + 1}.`, item]);
        });
      }
      data.push([""]);
    });

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Refund Policy");
    XLSX.writeFile(wb, `refund-policy-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const addNewSection = () => {
    if (!currentPolicy) return;
    
    const newSection: Section = {
      title: "New Section",
      content: "Section content here...",
      subsections: [],
      listItems: []
    };

    setCurrentPolicy({
      ...currentPolicy,
      sections: [...currentPolicy.sections, newSection]
    });
  };

  const updateSection = (index: number, field: keyof Section, value: any) => {
    if (!currentPolicy) return;
    
    const updatedSections = [...currentPolicy.sections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    
    setCurrentPolicy({
      ...currentPolicy,
      sections: updatedSections
    });
  };

  const deleteSection = (index: number) => {
    if (!currentPolicy) return;
    
    const updatedSections = currentPolicy.sections.filter((_, i) => i !== index);
    setCurrentPolicy({
      ...currentPolicy,
      sections: updatedSections
    });
  };

  const addSubsection = (sectionIndex: number) => {
    if (!currentPolicy) return;
    
    const newSubsection: Subsection = {
      title: "New Subsection",
      content: "Subsection content here...",
      listItems: []
    };

    const updatedSections = [...currentPolicy.sections];
    updatedSections[sectionIndex].subsections = [
      ...(updatedSections[sectionIndex].subsections || []),
      newSubsection
    ];

    setCurrentPolicy({
      ...currentPolicy,
      sections: updatedSections
    });
  };

  const updateSubsection = (sectionIndex: number, subsectionIndex: number, field: keyof Subsection, value: any) => {
    if (!currentPolicy) return;
    
    const updatedSections = [...currentPolicy.sections];
    const subsections = [...(updatedSections[sectionIndex].subsections || [])];
    subsections[subsectionIndex] = { ...subsections[subsectionIndex], [field]: value };
    updatedSections[sectionIndex].subsections = subsections;
    
    setCurrentPolicy({
      ...currentPolicy,
      sections: updatedSections
    });
  };

  const deleteSubsection = (sectionIndex: number, subsectionIndex: number) => {
    if (!currentPolicy) return;
    
    const updatedSections = [...currentPolicy.sections];
      const subsections = [...(updatedSections[sectionIndex].subsections || [])];
    subsections.splice(subsectionIndex, 1);
      updatedSections[sectionIndex].subsections = subsections;
    
    setCurrentPolicy({
      ...currentPolicy,
      sections: updatedSections
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading refund policies...</p>
        </div>
      </div>
    );
  }

  // Edit Page View
  if (showEditPage && currentPolicy) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Edit Page Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Refund Policy</h1>
                <p className="text-gray-600 mt-2">Modify refund policy content and settings</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowEditPage(false);
                    setEditing(false);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
                >
                  <FaTimes />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
                >
                  <FaSave />
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Policy Editor</h2>
            
            {/* Basic Info */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={currentPolicy.title}
                  onChange={(e) => setCurrentPolicy({ ...currentPolicy, title: e.target.value })}
                  placeholder="Enter policy title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
                <input
                  type="text"
                  value={currentPolicy.lastUpdated}
                  onChange={(e) => setCurrentPolicy({ ...currentPolicy, lastUpdated: e.target.value })}
                  placeholder="Enter last updated date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={currentPolicy.contactInfo.email}
                  onChange={(e) => setCurrentPolicy({
                    ...currentPolicy,
                    contactInfo: { ...currentPolicy.contactInfo, email: e.target.value }
                  })}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  value={currentPolicy.contactInfo.phone}
                  onChange={(e) => setCurrentPolicy({
                    ...currentPolicy,
                    contactInfo: { ...currentPolicy.contactInfo, phone: e.target.value }
                  })}
                  placeholder="Enter phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={currentPolicy.contactInfo.address}
                  onChange={(e) => setCurrentPolicy({
                    ...currentPolicy,
                    contactInfo: { ...currentPolicy.contactInfo, address: e.target.value }
                  })}
                  rows={3}
                  placeholder="Enter address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
                <input
                  type="text"
                  value={currentPolicy.contactInfo.businessHours}
                  onChange={(e) => setCurrentPolicy({
                    ...currentPolicy,
                    contactInfo: { ...currentPolicy.contactInfo, businessHours: e.target.value }
                  })}
                  placeholder="Enter business hours"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Sections</h3>
                <button
                  onClick={addNewSection}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <FaPlus />
                  <span>Add Section</span>
                </button>
              </div>

              {currentPolicy.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                      placeholder="Section title"
                      className="text-lg font-medium text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={() => deleteSection(sectionIndex)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      title="Delete section"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  
                  <textarea
                    value={section.content}
                    onChange={(e) => updateSection(sectionIndex, 'content', e.target.value)}
                    placeholder="Section content..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                  />

                  {/* Subsections */}
                  {section.subsections && section.subsections.length > 0 && (
                    <div className="ml-4 space-y-3">
                      <h4 className="font-medium text-gray-800">Subsections</h4>
                      {section.subsections.map((subsection, subsectionIndex) => (
                        <div key={subsectionIndex} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <input
                              type="text"
                              value={subsection.title || ''}
                              onChange={(e) => updateSubsection(sectionIndex, subsectionIndex, 'title', e.target.value)}
                              placeholder="Subsection title"
                              className="font-medium text-gray-800 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                            />
                            <button
                              onClick={() => deleteSubsection(sectionIndex, subsectionIndex)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                              title="Delete subsection"
                            >
                              <FaTrash />
                            </button>
                          </div>
                          <textarea
                            value={subsection.content || ''}
                            onChange={(e) => updateSubsection(sectionIndex, subsectionIndex, 'content', e.target.value)}
                            placeholder="Subsection content..."
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => addSubsection(sectionIndex)}
                    className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 flex items-center space-x-2"
                  >
                    <FaPlus />
                    <span>Add Subsection</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Refund Policy Management</h1>
              <p className="text-gray-600 mt-2">Manage refund policy content and settings</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <FaEye />
                <span>{showPreview ? "Hide Preview" : "Show Preview"}</span>
              </button>
              <button
                onClick={exportToExcel}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center space-x-2"
              >
                <FaFileExcel />
                <span>Export Excel</span>
              </button>
              <button
                onClick={() => {
                  setEditing(true);
                  setShowEditPage(true);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <FaEdit />
                <span>Edit Policy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Policy Versions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Refund Policy Versions</h2>
          <div className="space-y-4">
            {refundPolicies.map((policy) => (
              <div
                key={policy._id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{policy.title}</h3>
                    <p className="text-sm text-gray-600">
                      Last updated: {policy.lastUpdated} | Created: {new Date(policy.createdAt || "").toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {policy.isActive && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Active
                      </span>
                    )}
                    {!policy.isActive && (
                      <button
                        onClick={() => policy._id && handleActivate(policy._id)}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full hover:bg-blue-200"
                      >
                        Activate
                      </button>
                    )}
                    <button
                      onClick={() => policy._id && handleDelete(policy._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      disabled={policy.isActive}
                      title="Delete policy"
                      aria-label="Delete policy"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Read Only View */}
        {currentPolicy && (
            <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Refund Policy</h2>
              
              {/* Basic Info */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <p className="text-lg font-medium text-gray-900">{currentPolicy.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
                <p className="text-gray-900">{currentPolicy.lastUpdated}</p>
              </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{currentPolicy.contactInfo.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{currentPolicy.contactInfo.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <p className="text-gray-900">{currentPolicy.contactInfo.address}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Hours</label>
                  <p className="text-gray-900">{currentPolicy.contactInfo.businessHours}</p>
                </div>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Policy Sections</h3>
                {currentPolicy.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">{section.title}</h4>
                  <p className="text-gray-600 leading-relaxed mb-4">{section.content}</p>

                    {/* Subsections */}
                    {section.subsections && section.subsections.length > 0 && (
                    <div className="ml-4 space-y-3">
                        {section.subsections.map((subsection, subsectionIndex) => (
                        <div key={subsectionIndex} className="border-l-2 border-gray-300 pl-4">
                          {subsection.title && (
                            <h5 className="font-medium text-gray-800 mb-2">{subsection.title}</h5>
                          )}
                          {subsection.content && (
                            <p className="text-gray-600 leading-relaxed mb-2">{subsection.content}</p>
                          )}
                          {subsection.listItems && subsection.listItems.length > 0 && (
                            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                              {subsection.listItems.map((item, itemIndex) => (
                                <li key={itemIndex}>{item}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                      {section.listItems && section.listItems.length > 0 && (
                        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                          {section.listItems.map((item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
            </div>
          </div>
        )}

        {/* Preview Section */}
        {currentPolicy && showPreview && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Policy Preview</h2>
            <div className="prose max-w-none">
              {/* Policy Header */}
              <div className="text-center mb-8 pb-6 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{currentPolicy.title}</h1>
                <p className="text-gray-600 text-lg">Last updated: {currentPolicy.lastUpdated}</p>
              </div>
              
              {/* Policy Sections */}
              {currentPolicy.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">{section.title}</h2>
                  <p className="text-gray-600 leading-relaxed mb-6 text-lg">{section.content}</p>
                  
                  {/* Subsections */}
                  {section.subsections && section.subsections.length > 0 && (
                    <div className="ml-4 space-y-4">
                      {section.subsections.map((subsection, subsectionIndex) => (
                        <div key={subsectionIndex} className="border-l-4 border-blue-200 pl-6">
                          {subsection.title && (
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">{subsection.title}</h3>
                          )}
                          {subsection.content && (
                            <p className="text-gray-600 leading-relaxed mb-4 text-lg">{subsection.content}</p>
                          )}
                          {subsection.listItems && subsection.listItems.length > 0 && (
                            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 text-lg">
                              {subsection.listItems.map((item, itemIndex) => (
                                <li key={itemIndex} className="leading-relaxed">{item}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Section List Items */}
                  {section.listItems && section.listItems.length > 0 && (
                    <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 text-lg">
                      {section.listItems.map((item, itemIndex) => (
                        <li key={itemIndex} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {/* Contact Information */}
              <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
                    <p className="text-gray-600 text-lg">{currentPolicy.contactInfo.email}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Phone</h3>
                    <p className="text-gray-600 text-lg">{currentPolicy.contactInfo.phone}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Address</h3>
                    <p className="text-gray-600 text-lg">{currentPolicy.contactInfo.address}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Business Hours</h3>
                    <p className="text-gray-600 text-lg">{currentPolicy.contactInfo.businessHours}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-gray-500 text-sm">
                  This policy is effective as of {currentPolicy.lastUpdated} and applies to all refund requests.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RefundPolicyTab;