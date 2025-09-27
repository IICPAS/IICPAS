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
}

interface PrivacyPolicyData {
  _id?: string;
  title: string;
  lastUpdated: string;
  sections: Section[];
  contactInfo: ContactInfo;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const PrivacyPolicyTab = () => {
  const [privacyPolicies, setPrivacyPolicies] = useState<PrivacyPolicyData[]>([]);
  const [currentPolicy, setCurrentPolicy] = useState<PrivacyPolicyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [newListItem, setNewListItem] = useState("");
  const [newSubsectionTitle, setNewSubsectionTitle] = useState("");
  const [newSubsectionContent, setNewSubsectionContent] = useState("");

  useEffect(() => {
    fetchPrivacyPolicies();
  }, []);

  const fetchPrivacyPolicies = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const response = await fetch(`${API_BASE}/privacy-policy/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setPrivacyPolicies(data.data);
        if (data.data.length > 0) {
          setCurrentPolicy(data.data[0]);
        }
      } else {
        toast.error("Failed to fetch privacy policies");
      }
    } catch (error) {
      console.error("Error fetching privacy policies:", error);
      toast.error("Error fetching privacy policies");
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
        response = await fetch(`${API_BASE}/privacy-policy/admin/update/${currentPolicy._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(currentPolicy),
        });
      } else {
        // Create new policy
        response = await fetch(`${API_BASE}/privacy-policy/admin/create`, {
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
        toast.success("Privacy policy saved successfully");
        setEditing(false);
        fetchPrivacyPolicies();
      } else {
        toast.error(data.message || "Failed to save privacy policy");
      }
    } catch (error) {
      console.error("Error saving privacy policy:", error);
      toast.error("Error saving privacy policy");
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = async (policyId: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const response = await fetch(`${API_BASE}/privacy-policy/admin/activate/${policyId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success("Privacy policy activated successfully");
        fetchPrivacyPolicies();
      } else {
        toast.error(data.message || "Failed to activate privacy policy");
      }
    } catch (error) {
      console.error("Error activating privacy policy:", error);
      toast.error("Error activating privacy policy");
    }
  };

  const handleDelete = async (policyId: string) => {
    if (!confirm("Are you sure you want to delete this privacy policy?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const response = await fetch(`${API_BASE}/privacy-policy/admin/delete/${policyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success("Privacy policy deleted successfully");
        fetchPrivacyPolicies();
      } else {
        toast.error(data.message || "Failed to delete privacy policy");
      }
    } catch (error) {
      console.error("Error deleting privacy policy:", error);
      toast.error("Error deleting privacy policy");
    }
  };

  const addSection = () => {
    if (!currentPolicy) return;
    
    const newSection: Section = {
      title: "New Section",
      content: "",
      subsections: [],
      listItems: []
    };
    
    setCurrentPolicy({
      ...currentPolicy,
      sections: [...currentPolicy.sections, newSection]
    });
  };

  const updateSection = (index: number, field: string, value: any) => {
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
      title: newSubsectionTitle,
      content: newSubsectionContent,
      listItems: []
    };
    
    const updatedSections = [...currentPolicy.sections];
    if (!updatedSections[sectionIndex].subsections) {
      updatedSections[sectionIndex].subsections = [];
    }
    updatedSections[sectionIndex].subsections!.push(newSubsection);
    
    setCurrentPolicy({
      ...currentPolicy,
      sections: updatedSections
    });
    
    setNewSubsectionTitle("");
    setNewSubsectionContent("");
  };

  const addListItem = (sectionIndex: number, subsectionIndex?: number) => {
    if (!currentPolicy || !newListItem.trim()) return;
    
    const updatedSections = [...currentPolicy.sections];
    
    if (subsectionIndex !== undefined) {
      // Add to subsection
      if (!updatedSections[sectionIndex].subsections) {
        updatedSections[sectionIndex].subsections = [];
      }
      if (!updatedSections[sectionIndex].subsections![subsectionIndex].listItems) {
        updatedSections[sectionIndex].subsections![subsectionIndex].listItems = [];
      }
      updatedSections[sectionIndex].subsections![subsectionIndex].listItems!.push(newListItem);
    } else {
      // Add to section
      if (!updatedSections[sectionIndex].listItems) {
        updatedSections[sectionIndex].listItems = [];
      }
      updatedSections[sectionIndex].listItems!.push(newListItem);
    }
    
    setCurrentPolicy({
      ...currentPolicy,
      sections: updatedSections
    });
    
    setNewListItem("");
  };

  const removeListItem = (sectionIndex: number, itemIndex: number, subsectionIndex?: number) => {
    if (!currentPolicy) return;
    
    const updatedSections = [...currentPolicy.sections];
    
    if (subsectionIndex !== undefined) {
      updatedSections[sectionIndex].subsections![subsectionIndex].listItems!.splice(itemIndex, 1);
    } else {
      updatedSections[sectionIndex].listItems!.splice(itemIndex, 1);
    }
    
    setCurrentPolicy({
      ...currentPolicy,
      sections: updatedSections
    });
  };

  const exportToExcel = () => {
    if (!currentPolicy) {
      toast.error("No policy selected to export");
      return;
    }

    try {
      // Prepare data for Excel export
      const exportData = [];
      
      // Add policy header information
      exportData.push(['Privacy Policy Export']);
      exportData.push(['Title', currentPolicy.title]);
      exportData.push(['Last Updated', currentPolicy.lastUpdated]);
      exportData.push(['Status', currentPolicy.isActive ? 'Active' : 'Inactive']);
      exportData.push(['Created At', currentPolicy.createdAt || 'N/A']);
      exportData.push(['Updated At', currentPolicy.updatedAt || 'N/A']);
      exportData.push([]); // Empty row
      
      // Add contact information
      exportData.push(['Contact Information']);
      exportData.push(['Email', currentPolicy.contactInfo.email]);
      exportData.push(['Phone', currentPolicy.contactInfo.phone]);
      exportData.push(['Address', currentPolicy.contactInfo.address]);
      exportData.push([]); // Empty row
      
      // Add sections
      exportData.push(['Policy Sections']);
      currentPolicy.sections.forEach((section, sectionIndex) => {
        exportData.push([`Section ${sectionIndex + 1}: ${section.title}`]);
        exportData.push(['Content', section.content]);
        
        // Add subsections if they exist
        if (section.subsections && section.subsections.length > 0) {
          section.subsections.forEach((subsection, subIndex) => {
            exportData.push([`  Subsection ${subIndex + 1}: ${subsection.title || 'Untitled'}`]);
            if (subsection.content) {
              exportData.push(['  Content', subsection.content]);
            }
            if (subsection.listItems && subsection.listItems.length > 0) {
              subsection.listItems.forEach((item, itemIndex) => {
                exportData.push([`    Item ${itemIndex + 1}`, item]);
              });
            }
          });
        }
        
        // Add main section list items if they exist
        if (section.listItems && section.listItems.length > 0) {
          exportData.push(['  Main List Items:']);
          section.listItems.forEach((item, itemIndex) => {
            exportData.push([`    Item ${itemIndex + 1}`, item]);
          });
        }
        
        exportData.push([]); // Empty row between sections
      });

      // Create workbook and worksheet
      const ws = XLSX.utils.aoa_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Privacy Policy');

      // Generate filename with current date
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `Privacy_Policy_${currentPolicy.title.replace(/\s+/g, '_')}_${currentDate}.xlsx`;

      // Save the file
      XLSX.writeFile(wb, filename);
      
      toast.success('Privacy policy exported to Excel successfully!');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export to Excel');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Privacy Policy Management</h2>
        <div className="flex space-x-2">
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

      {/* Policy List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Privacy Policy Versions</h3>
        <div className="space-y-2">
          {privacyPolicies.map((policy) => (
            <div
              key={policy._id}
              className={`p-3 rounded-lg border cursor-pointer ${
                policy.isActive ? "border-green-500 bg-green-50" : "border-gray-200"
              }`}
              onClick={() => setCurrentPolicy(policy)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{policy.title}</h4>
                  <p className="text-sm text-gray-600">
                    Last updated: {policy.lastUpdated} | 
                    Created: {new Date(policy.createdAt!).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {policy.isActive && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Active
                    </span>
                  )}
                  {!policy.isActive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActivate(policy._id!);
                      }}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full hover:bg-blue-200"
                    >
                      Activate
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(policy._id!);
                    }}
                    className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full hover:bg-red-200"
                    title="Delete privacy policy"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Form */}
      {currentPolicy && editing && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Edit Privacy Policy</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
                      <input
                        type="text"
                        value={currentPolicy.title}
                        onChange={(e) => setCurrentPolicy({ ...currentPolicy, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Privacy policy title"
                      />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Updated
              </label>
                      <input
                        type="text"
                        value={currentPolicy.lastUpdated}
                        onChange={(e) => setCurrentPolicy({ ...currentPolicy, lastUpdated: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Last updated date"
                      />
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                      <input
                        type="email"
                        value={currentPolicy.contactInfo.email}
                        onChange={(e) => setCurrentPolicy({
                          ...currentPolicy,
                          contactInfo: { ...currentPolicy.contactInfo, email: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Contact email"
                      />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                      <input
                        type="text"
                        value={currentPolicy.contactInfo.phone}
                        onChange={(e) => setCurrentPolicy({
                          ...currentPolicy,
                          contactInfo: { ...currentPolicy.contactInfo, phone: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Contact phone"
                      />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                      <input
                        type="text"
                        value={currentPolicy.contactInfo.address}
                        onChange={(e) => setCurrentPolicy({
                          ...currentPolicy,
                          contactInfo: { ...currentPolicy.contactInfo, address: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Contact address"
                      />
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-semibold">Sections</h4>
                <button
                  onClick={addSection}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-1"
                >
                  <FaPlus />
                  <span>Add Section</span>
                </button>
              </div>

              {currentPolicy.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="font-medium">Section {sectionIndex + 1}</h5>
                    <button
                      onClick={() => deleteSection(sectionIndex)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete section"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSection(sectionIndex, "title", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Section title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Section Content
                      </label>
                      <textarea
                        value={section.content}
                        onChange={(e) => updateSection(sectionIndex, "content", e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Section content"
                      />
                    </div>

                    {/* Subsections */}
                    {section.subsections && section.subsections.length > 0 && (
                      <div className="space-y-3">
                        <h6 className="font-medium">Subsections</h6>
                        {section.subsections.map((subsection, subsectionIndex) => (
                          <div key={subsectionIndex} className="bg-gray-50 p-3 rounded-lg">
                            <div className="space-y-2">
                              <input
                                type="text"
                                placeholder="Subsection Title"
                                value={subsection.title || ""}
                                onChange={(e) => {
                                  const updatedSections = [...currentPolicy.sections];
                                  updatedSections[sectionIndex].subsections![subsectionIndex].title = e.target.value;
                                  setCurrentPolicy({ ...currentPolicy, sections: updatedSections });
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Subsection title"
                              />
                              <textarea
                                placeholder="Subsection Content"
                                value={subsection.content || ""}
                                onChange={(e) => {
                                  const updatedSections = [...currentPolicy.sections];
                                  updatedSections[sectionIndex].subsections![subsectionIndex].content = e.target.value;
                                  setCurrentPolicy({ ...currentPolicy, sections: updatedSections });
                                }}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Subsection content"
                              />
                              {/* Subsection List Items */}
                              {subsection.listItems && subsection.listItems.length > 0 && (
                                <div className="space-y-1">
                                  {subsection.listItems.map((item, itemIndex) => (
                                    <div key={itemIndex} className="flex items-center space-x-2">
                                      <span className="text-sm">•</span>
                                      <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => {
                                          const updatedSections = [...currentPolicy.sections];
                                          updatedSections[sectionIndex].subsections![subsectionIndex].listItems![itemIndex] = e.target.value;
                                          setCurrentPolicy({ ...currentPolicy, sections: updatedSections });
                                        }}
                                        className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        aria-label="List item"
                                      />
                                      <button
                                        onClick={() => removeListItem(sectionIndex, itemIndex, subsectionIndex)}
                                        className="text-red-600 hover:text-red-800"
                                        title="Remove list item"
                                      >
                                        <FaTimes />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div className="flex space-x-2">
                                <input
                                  type="text"
                                  placeholder="Add list item"
                                  value={newListItem}
                                  onChange={(e) => setNewListItem(e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  aria-label="New list item"
                                />
                                <button
                                  onClick={() => addListItem(sectionIndex, subsectionIndex)}
                                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                  title="Add list item"
                                >
                                  <FaPlus />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Subsection */}
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="New Subsection Title"
                        value={newSubsectionTitle}
                        onChange={(e) => setNewSubsectionTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="New subsection title"
                      />
                      <textarea
                        placeholder="New Subsection Content"
                        value={newSubsectionContent}
                        onChange={(e) => setNewSubsectionContent(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="New subsection content"
                      />
                      <button
                        onClick={() => addSubsection(sectionIndex)}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-1"
                      >
                        <FaPlus />
                        <span>Add Subsection</span>
                      </button>
                    </div>

                    {/* Section List Items */}
                    {section.listItems && section.listItems.length > 0 && (
                      <div className="space-y-1">
                        <h6 className="font-medium">List Items</h6>
                        {section.listItems.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center space-x-2">
                            <span className="text-sm">•</span>
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => {
                                const updatedSections = [...currentPolicy.sections];
                                updatedSections[sectionIndex].listItems![itemIndex] = e.target.value;
                                setCurrentPolicy({ ...currentPolicy, sections: updatedSections });
                              }}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              aria-label="List item"
                            />
                            <button
                              onClick={() => removeListItem(sectionIndex, itemIndex)}
                              className="text-red-600 hover:text-red-800"
                              title="Remove list item"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add List Item to Section */}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add list item to section"
                        value={newListItem}
                        onChange={(e) => setNewListItem(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="New list item for section"
                      />
                      <button
                        onClick={() => addListItem(sectionIndex)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        title="Add list item"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      {showPreview && currentPolicy && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Preview</h3>
          <div className="prose max-w-none">
            <h1 className="text-3xl font-bold mb-4">{currentPolicy.title}</h1>
            <p className="text-gray-600 mb-6">Last updated: {currentPolicy.lastUpdated}</p>
            
            {currentPolicy.sections.map((section, index) => (
              <div key={index} className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
                {section.content && <p className="mb-3">{section.content}</p>}
                
                {section.subsections && section.subsections.map((subsection, subIndex) => (
                  <div key={subIndex} className="mb-4">
                    {subsection.title && <h3 className="text-lg font-semibold mb-2">{subsection.title}</h3>}
                    {subsection.content && <p className="mb-2">{subsection.content}</p>}
                    {subsection.listItems && (
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        {subsection.listItems.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
                
                {section.listItems && (
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    {section.listItems.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                )}
                
                {section.title === "Contact Us" && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p><strong>Email:</strong> {currentPolicy.contactInfo.email}</p>
                    <p><strong>Phone:</strong> {currentPolicy.contactInfo.phone}</p>
                    <p><strong>Address:</strong> {currentPolicy.contactInfo.address}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyPolicyTab;
