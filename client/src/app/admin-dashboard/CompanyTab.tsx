/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

const CompanyTab = () => {
  const [activeSubTab, setActiveSubTab] = useState("view");
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    if (activeSubTab === "view") fetchCompanies();
  }, [activeSubTab]);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${API}/companies`);
      setCompanies(res.data);
    } catch {
      toast.error("Failed to fetch companies");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await axios.put(`${API}/companies/approve/${id}`);
      toast.success("Company approved");
      fetchCompanies();
    } catch {
      toast.error("Approval failed");
    }
  };

  const renderViewCompanies = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-green-700">View Companies</h3>
      {companies.length === 0 ? (
        <p>No companies yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-green-100 text-left">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Document</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((comp: any) => (
                <tr key={comp._id}>
                  <td className="p-2 border">{comp.fullName}</td>
                  <td className="p-2 border">{comp.email}</td>
                  <td className="p-2 border">{comp.phone}</td>
                  <td className="p-2 border">
                    {comp.documentPath ? (
                      <a
                        href={`${API}/${comp.documentPath.replace(/\\/g, "/")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Document
                      </a>
                    ) : (
                      <span className="text-gray-400">Not Uploaded</span>
                    )}
                  </td>
                  <td className="p-2 border">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        comp.status === "approved"
                          ? "bg-green-200 text-green-700"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {comp.status}
                    </span>
                  </td>
                  <td className="p-2 border">
                    {comp.status !== "approved" && (
                      <button
                        onClick={() => handleApprove(comp._id)}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderTrainingRequests = () => (
    <div>
      <h3 className="text-xl font-bold text-green-700 mb-4">
        Training Requests
      </h3>
      <p>Coming soon: View training collaboration requests from companies.</p>
    </div>
  );

  const renderPlacementDashboard = () => (
    <div>
      <h3 className="text-xl font-bold text-green-700 mb-4">
        Placement Dashboard
      </h3>
      <p>Coming soon: View placement stats and candidate progress.</p>
    </div>
  );

  const renderCompanyEnquiries = () => (
    <div>
      <h3 className="text-xl font-bold text-green-700 mb-4">
        Company Enquiries
      </h3>
      <p>Coming soon: List of company-specific questions and outreach.</p>
    </div>
  );

  const renderContent = () => {
    switch (activeSubTab) {
      case "view":
        return renderViewCompanies();
      case "training":
        return renderTrainingRequests();
      case "placement":
        return renderPlacementDashboard();
      case "enquiry":
        return renderCompanyEnquiries();
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-4 border-b mb-4">
        <button
          className={`py-2 px-4 ${
            activeSubTab === "view"
              ? "border-b-2 border-green-600 text-green-700 font-semibold"
              : "text-gray-600"
          }`}
          onClick={() => setActiveSubTab("view")}
        >
          View Companies
        </button>
        <button
          className={`py-2 px-4 ${
            activeSubTab === "training"
              ? "border-b-2 border-green-600 text-green-700 font-semibold"
              : "text-gray-600"
          }`}
          onClick={() => setActiveSubTab("training")}
        >
          Training Requests
        </button>
        <button
          className={`py-2 px-4 ${
            activeSubTab === "placement"
              ? "border-b-2 border-green-600 text-green-700 font-semibold"
              : "text-gray-600"
          }`}
          onClick={() => setActiveSubTab("placement")}
        >
          Placement Dashboard
        </button>
        <button
          className={`py-2 px-4 ${
            activeSubTab === "enquiry"
              ? "border-b-2 border-green-600 text-green-700 font-semibold"
              : "text-gray-600"
          }`}
          onClick={() => setActiveSubTab("enquiry")}
        >
          Company Enquiries
        </button>
      </div>

      {renderContent()}
    </div>
  );
};

export default CompanyTab;
