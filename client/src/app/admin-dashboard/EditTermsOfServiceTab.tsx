"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FaArrowLeft, FaSave, FaPlus, FaTrash, FaTimes } from "react-icons/fa";

interface Subsection {
  title?: string;
  content?: string;
  listItems?: string[];
}

interface Section {
  title: string;
  content: string;
  subsections: Subsection[];
}

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  businessHours: string;
}

interface TermsOfServiceData {
  _id: string;
  title: string;
  lastUpdated: string;
  sections: Section[];
  contactInfo: ContactInfo;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EditTermsOfServiceTabProps {
  onBack: () => void;
  policyId?: string;
}

const EditTermsOfServiceTab = ({ onBack, policyId }: EditTermsOfServiceTabProps) => {
  const [termsOfService, setTermsOfService] = useState<TermsOfServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newListItem, setNewListItem] = useState("");
  const [newSubsectionTitle, setNewSubsectionTitle] = useState("");
  const [newSubsectionContent, setNewSubsectionContent] = useState("");

  useEffect(() => {
    if (policyId && policyId !== "new") {
      fetchTermsOfService();
    } else {
      setLoading(false);
    }
  }, [policyId]);

  const fetchTermsOfService = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const response = await fetch(`${API_BASE}/terms-of-service/admin/${policyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setTermsOfService(data.data);
      } else {
        toast.error("Failed to fetch terms of service");
      }
    } catch (error) {
      console.error("Error fetching terms of service:", error);
      toast.error("Error fetching terms of service");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!termsOfService) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const response = await fetch(`${API_BASE}/terms-of-service/admin/${termsOfService._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(termsOfService),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Terms of service updated successfully");
        onBack();
      } else {
        toast.error(data.message || "Failed to update terms of service");
      }
    } catch (error) {
      console.error("Error updating terms of service:", error);
      toast.error("Error updating terms of service");
    } finally {
      setSaving(false);
    }
  };

  const addListItem = (sectionIndex: number, subsectionIndex: number) => {
    if (!newListItem.trim()) return;

    const updatedPolicy = { ...termsOfService! };
    if (!updatedPolicy.sections[sectionIndex].subsections[subsectionIndex].listItems) {
      updatedPolicy.sections[sectionIndex].subsections[subsectionIndex].listItems = [];
    }
    updatedPolicy.sections[sectionIndex].subsections[subsectionIndex].listItems!.push(newListItem);
    setTermsOfService(updatedPolicy);
    setNewListItem("");
  };

  const removeListItem = (sectionIndex: number, subsectionIndex: number, itemIndex: number) => {
    const updatedPolicy = { ...termsOfService! };
    updatedPolicy.sections[sectionIndex].subsections[subsectionIndex].listItems!.splice(itemIndex, 1);
    setTermsOfService(updatedPolicy);
  };

  const addSubsection = (sectionIndex: number) => {
    if (!newSubsectionTitle.trim()) return;

    const updatedPolicy = { ...termsOfService! };
    updatedPolicy.sections[sectionIndex].subsections.push({
      title: newSubsectionTitle,
      content: newSubsectionContent,
      listItems: [],
    });
    setTermsOfService(updatedPolicy);
    setNewSubsectionTitle("");
    setNewSubsectionContent("");
  };

  const removeSubsection = (sectionIndex: number, subsectionIndex: number) => {
    const updatedPolicy = { ...termsOfService! };
    updatedPolicy.sections[sectionIndex].subsections.splice(subsectionIndex, 1);
    setTermsOfService(updatedPolicy);
  };

  const addSection = () => {
    const updatedPolicy = { ...termsOfService! };
    updatedPolicy.sections.push({
      title: "New Section",
      content: "",
      subsections: [],
    });
    setTermsOfService(updatedPolicy);
  };

  const removeSection = (sectionIndex: number) => {
    const updatedPolicy = { ...termsOfService! };
    updatedPolicy.sections.splice(sectionIndex, 1);
    setTermsOfService(updatedPolicy);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!termsOfService) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Terms of Service Not Found</h2>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back to Terms of Service
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Terms of Service</h2>
            <p className="text-gray-600">Edit and manage your terms of service content</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center"
          >
            <FaSave className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={termsOfService.title}
                onChange={(e) => setTermsOfService({ ...termsOfService, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter terms of service title"
              />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
              <input
                type="text"
                value={termsOfService.lastUpdated}
                onChange={(e) => setTermsOfService({ ...termsOfService, lastUpdated: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter last updated date"
              />
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={termsOfService.contactInfo.email}
              onChange={(e) => setTermsOfService({
                ...termsOfService,
                contactInfo: { ...termsOfService.contactInfo, email: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter contact email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="text"
              value={termsOfService.contactInfo.phone}
              onChange={(e) => setTermsOfService({
                ...termsOfService,
                contactInfo: { ...termsOfService.contactInfo, phone: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter contact phone"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              value={termsOfService.contactInfo.address}
              onChange={(e) => setTermsOfService({
                ...termsOfService,
                contactInfo: { ...termsOfService.contactInfo, address: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter contact address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
            <input
              type="text"
              value={termsOfService.contactInfo.businessHours}
              onChange={(e) => setTermsOfService({
                ...termsOfService,
                contactInfo: { ...termsOfService.contactInfo, businessHours: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter business hours"
            />
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Sections</h3>
          <button
            onClick={addSection}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            <FaPlus className="w-3 h-3 mr-1" />
            Add Section
          </button>
        </div>

        <div className="space-y-6">
          {termsOfService.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-900">Section {sectionIndex + 1}</h4>
                <button
                  onClick={() => removeSection(sectionIndex)}
                  className="text-red-600 hover:text-red-800"
                  title="Remove section"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => {
                      const updatedPolicy = { ...termsOfService };
                      updatedPolicy.sections[sectionIndex].title = e.target.value;
                      setTermsOfService(updatedPolicy);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter section title"
                  />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Content</label>
                  <textarea
                    value={section.content}
                    onChange={(e) => {
                      const updatedPolicy = { ...termsOfService };
                      updatedPolicy.sections[sectionIndex].content = e.target.value;
                      setTermsOfService(updatedPolicy);
                    }}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter section content"
                  />
              </div>

              {/* Subsections */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-medium text-gray-700">Subsections</h5>
                  <button
                    onClick={() => addSubsection(sectionIndex)}
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    <FaPlus className="w-3 h-3 mr-1" />
                    Add Subsection
                  </button>
                </div>

                {section.subsections.map((subsection, subsectionIndex) => (
                  <div key={subsectionIndex} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h6 className="text-sm font-medium text-gray-600">Subsection {subsectionIndex + 1}</h6>
                      <button
                        onClick={() => removeSubsection(sectionIndex, subsectionIndex)}
                        className="text-red-600 hover:text-red-800"
                        title="Remove subsection"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="mb-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Subsection Title</label>
                      <input
                        type="text"
                        value={subsection.title || ""}
                        onChange={(e) => {
                          const updatedPolicy = { ...termsOfService };
                          updatedPolicy.sections[sectionIndex].subsections[subsectionIndex].title = e.target.value;
                          setTermsOfService(updatedPolicy);
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter subsection title"
                      />
                    </div>

                    <div className="mb-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Subsection Content</label>
                      <textarea
                        value={subsection.content || ""}
                        onChange={(e) => {
                          const updatedPolicy = { ...termsOfService };
                          updatedPolicy.sections[sectionIndex].subsections[subsectionIndex].content = e.target.value;
                          setTermsOfService(updatedPolicy);
                        }}
                        rows={3}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter subsection content"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">List Items</label>
                      {subsection.listItems?.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-2 mb-1">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const updatedPolicy = { ...termsOfService };
                              updatedPolicy.sections[sectionIndex].subsections[subsectionIndex].listItems![itemIndex] = e.target.value;
                              setTermsOfService(updatedPolicy);
                            }}
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter list item"
                          />
                          <button
                            onClick={() => removeListItem(sectionIndex, subsectionIndex, itemIndex)}
                            className="text-red-600 hover:text-red-800"
                            title="Remove list item"
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={newListItem}
                          onChange={(e) => setNewListItem(e.target.value)}
                          placeholder="Add new list item"
                          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => addListItem(sectionIndex, subsectionIndex)}
                          className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                          title="Add list item"
                        >
                          <FaPlus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Subsection Form */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h6 className="text-sm font-medium text-gray-700 mb-2">Add New Subsection</h6>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={newSubsectionTitle}
                      onChange={(e) => setNewSubsectionTitle(e.target.value)}
                      placeholder="Subsection title"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <textarea
                      value={newSubsectionContent}
                      onChange={(e) => setNewSubsectionContent(e.target.value)}
                      placeholder="Subsection content"
                      rows={2}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => addSubsection(sectionIndex)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      <FaPlus className="w-3 h-3 mr-1" />
                      Add Subsection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditTermsOfServiceTab;
