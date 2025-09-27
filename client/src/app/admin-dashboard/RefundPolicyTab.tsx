"use client";

import React, { useState, useEffect } from "react";
import { FaEdit, FaSave, FaPlus, FaTrash, FaEye, FaCheck, FaTimes, FaFileExcel } from "react-icons/fa";
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
    updatedSections[sectionIndex].subsections = updatedSections[sectionIndex].subsections?.filter((_, i) => i !== subsectionIndex);
    
    setCurrentPolicy({
      ...currentPolicy,
      sections: updatedSections
    });
  };

  const addListItem = (sectionIndex: number, subsectionIndex?: number) => {
    if (!currentPolicy) return;
    
    const updatedSections = [...currentPolicy.sections];
    
    if (subsectionIndex !== undefined) {
      // Add to subsection
      const subsections = [...(updatedSections[sectionIndex].subsections || [])];
      subsections[subsectionIndex].listItems = [
        ...(subsections[subsectionIndex].listItems || []),
        "New list item"
      ];
      updatedSections[sectionIndex].subsections = subsections;
    } else {
      // Add to section
      updatedSections[sectionIndex].listItems = [
        ...(updatedSections[sectionIndex].listItems || []),
        "New list item"
      ];
    }
    
    setCurrentPolicy({
      ...currentPolicy,
      sections: updatedSections
    });
  };

  const updateListItem = (sectionIndex: number, itemIndex: number, value: string, subsectionIndex?: number) => {
    if (!currentPolicy) return;
    
    const updatedSections = [...currentPolicy.sections];
    
    if (subsectionIndex !== undefined) {
      const subsections = [...(updatedSections[sectionIndex].subsections || [])];
      subsections[subsectionIndex].listItems = subsections[subsectionIndex].listItems?.map((item, i) => 
        i === itemIndex ? value : item
      );
      updatedSections[sectionIndex].subsections = subsections;
    } else {
      updatedSections[sectionIndex].listItems = updatedSections[sectionIndex].listItems?.map((item, i) => 
        i === itemIndex ? value : item
      );
    }
    
    setCurrentPolicy({
      ...currentPolicy,
      sections: updatedSections
    });
  };

  const deleteListItem = (sectionIndex: number, itemIndex: number, subsectionIndex?: number) => {
    if (!currentPolicy) return;
    
    const updatedSections = [...currentPolicy.sections];
    
    if (subsectionIndex !== undefined) {
      const subsections = [...(updatedSections[sectionIndex].subsections || [])];
      subsections[subsectionIndex].listItems = subsections[subsectionIndex].listItems?.filter((_, i) => i !== itemIndex);
      updatedSections[sectionIndex].subsections = subsections;
    } else {
      updatedSections[sectionIndex].listItems = updatedSections[sectionIndex].listItems?.filter((_, i) => i !== itemIndex);
    }
    
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

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Refund Policy Management</h1>
          <p className="text-gray-600 mt-2">Manage refund policy content and settings</p>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-4">
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
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <FaEdit />
              <span>{editing ? "Cancel Edit" : "Edit Policy"}</span>
            </button>
            {editing && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
              >
                <FaSave />
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            )}
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

        {/* Main Content */}
        {currentPolicy && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Editor */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Policy Editor</h2>
              
              {/* Basic Info */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={currentPolicy.title}
                    onChange={(e) => setCurrentPolicy({ ...currentPolicy, title: e.target.value })}
                    disabled={!editing}
                    placeholder="Enter policy title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
                  <input
                    type="text"
                    value={currentPolicy.lastUpdated}
                    onChange={(e) => setCurrentPolicy({ ...currentPolicy, lastUpdated: e.target.value })}
                    disabled={!editing}
                    placeholder="Enter last updated date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
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
                    disabled={!editing}
                    placeholder="Enter email address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
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
                    disabled={!editing}
                    placeholder="Enter phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
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
                    disabled={!editing}
                    rows={3}
                    placeholder="Enter address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
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
                    disabled={!editing}
                    placeholder="Enter business hours"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Sections</h3>
                  {editing && (
                    <button
                      onClick={addNewSection}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                    >
                      <FaPlus />
                      <span>Add Section</span>
                    </button>
                  )}
                </div>

                {currentPolicy.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                          disabled={!editing}
                          placeholder="Enter section title"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 font-medium"
                        />
                      </div>
                      {editing && (
                        <button
                          onClick={() => deleteSection(sectionIndex)}
                          className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-full"
                          title="Delete section"
                          aria-label="Delete section"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>

                    <div className="mb-4">
                      <textarea
                        value={section.content}
                        onChange={(e) => updateSection(sectionIndex, 'content', e.target.value)}
                        disabled={!editing}
                        rows={4}
                        placeholder="Enter section content"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      />
                    </div>

                    {/* Subsections */}
                    {section.subsections && section.subsections.length > 0 && (
                      <div className="ml-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-md font-medium text-gray-800">Subsections</h4>
                          {editing && (
                            <button
                              onClick={() => addSubsection(sectionIndex)}
                              className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-1"
                            >
                              <FaPlus />
                              <span>Add</span>
                            </button>
                          )}
                        </div>

                        {section.subsections.map((subsection, subsectionIndex) => (
                          <div key={subsectionIndex} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={subsection.title || ""}
                                  onChange={(e) => updateSubsection(sectionIndex, subsectionIndex, 'title', e.target.value)}
                                  disabled={!editing}
                                  placeholder="Enter subsection title"
                                  className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm font-medium"
                                />
                              </div>
                              {editing && (
                                <button
                                  onClick={() => deleteSubsection(sectionIndex, subsectionIndex)}
                                  className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded-full"
                                  title="Delete subsection"
                                  aria-label="Delete subsection"
                                >
                                  <FaTimes />
                                </button>
                              )}
                            </div>

                            <div className="mb-2">
                              <textarea
                                value={subsection.content || ""}
                                onChange={(e) => updateSubsection(sectionIndex, subsectionIndex, 'content', e.target.value)}
                                disabled={!editing}
                                rows={3}
                                placeholder="Enter subsection content"
                                className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm"
                              />
                            </div>

                            {/* Subsection List Items */}
                            {subsection.listItems && subsection.listItems.length > 0 && (
                              <div className="ml-4">
                                <div className="flex justify-between items-center mb-2">
                                  <h5 className="text-sm font-medium text-gray-700">List Items</h5>
                                  {editing && (
                                    <button
                                      onClick={() => addListItem(sectionIndex, subsectionIndex)}
                                      className="px-2 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-1"
                                    >
                                      <FaPlus />
                                      <span>Add</span>
                                    </button>
                                  )}
                                </div>
                                <ul className="space-y-1">
                                  {subsection.listItems.map((item, itemIndex) => (
                                    <li key={itemIndex} className="flex items-center space-x-2">
                                      <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => updateListItem(sectionIndex, itemIndex, e.target.value, subsectionIndex)}
                                        disabled={!editing}
                                        placeholder="Enter list item"
                                        className="flex-1 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm"
                                      />
                                      {editing && (
                                        <button
                                          onClick={() => deleteListItem(sectionIndex, itemIndex, subsectionIndex)}
                                          className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                                          title="Delete list item"
                                          aria-label="Delete list item"
                                        >
                                          <FaTimes />
                                        </button>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Section List Items */}
                    {section.listItems && section.listItems.length > 0 && (
                      <div className="ml-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium text-gray-700">List Items</h4>
                          {editing && (
                            <button
                              onClick={() => addListItem(sectionIndex)}
                              className="px-2 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-1"
                            >
                              <FaPlus />
                              <span>Add</span>
                            </button>
                          )}
                        </div>
                        <ul className="space-y-1">
                          {section.listItems.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => updateListItem(sectionIndex, itemIndex, e.target.value)}
                                disabled={!editing}
                                placeholder="Enter list item"
                                className="flex-1 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm"
                              />
                              {editing && (
                                <button
                                  onClick={() => deleteListItem(sectionIndex, itemIndex)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                                  title="Delete list item"
                                  aria-label="Delete list item"
                                >
                                  <FaTimes />
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Preview</h2>
                <div className="prose max-w-none">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{currentPolicy.title}</h1>
                  <p className="text-gray-600 mb-8">Last updated: {currentPolicy.lastUpdated}</p>

                  {currentPolicy.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-8">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-4">{section.title}</h2>
                      <p className="text-gray-600 leading-relaxed mb-4">{section.content}</p>

                      {section.subsections && section.subsections.map((subsection, subsectionIndex) => (
                        <div key={subsectionIndex} className="ml-4 mb-4">
                          {subsection.title && (
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{subsection.title}</h3>
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

                      {section.listItems && section.listItems.length > 0 && (
                        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                          {section.listItems.map((item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}

                  <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                    <p className="text-gray-600">
                      Email: {currentPolicy.contactInfo.email}<br />
                      Phone: {currentPolicy.contactInfo.phone}<br />
                      Address: {currentPolicy.contactInfo.address}<br />
                      Business Hours: {currentPolicy.contactInfo.businessHours}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RefundPolicyTab;
