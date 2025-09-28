"use client";

import React, { useState, useEffect } from "react";
import { FaFileAlt, FaDownload, FaEye, FaCalendarAlt, FaChartBar } from "react-icons/fa";
import axios from "axios";

export default function ReportsTab() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockReports = [
        {
          id: 1,
          title: "Course Progress Report",
          description: "Detailed report of your course completion and progress",
          type: "Progress",
          date: "2024-01-15",
          status: "Available",
          fileUrl: "/reports/progress-report.pdf"
        },
        {
          id: 2,
          title: "Assessment Results",
          description: "Your test scores and assessment performance",
          type: "Assessment",
          date: "2024-01-10",
          status: "Available",
          fileUrl: "/reports/assessment-results.pdf"
        },
        {
          id: 3,
          title: "Certificate Summary",
          description: "Summary of all certificates earned",
          type: "Certificate",
          date: "2024-01-05",
          status: "Available",
          fileUrl: "/reports/certificate-summary.pdf"
        },
        {
          id: 4,
          title: "Monthly Learning Report",
          description: "Monthly summary of learning activities",
          type: "Monthly",
          date: "2024-01-01",
          status: "Generating",
          fileUrl: null
        }
      ];
      
      setReports(mockReports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (report) => {
    if (report.fileUrl) {
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = report.fileUrl;
      link.download = `${report.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleView = (report) => {
    if (report.fileUrl) {
      window.open(report.fileUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
        <p className="text-gray-600">View and download your academic reports and progress summaries</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaFileAlt className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FaDownload className="text-green-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'Available').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FaChartBar className="text-yellow-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FaCalendarAlt className="text-purple-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Last Updated</p>
              <p className="text-sm font-bold text-gray-900">Jan 15, 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Your Reports</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {reports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      report.status === 'Available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{report.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt className="text-xs" />
                      {new Date(report.date).toLocaleDateString()}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {report.type}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {report.status === 'Available' ? (
                    <>
                      <button
                        onClick={() => handleView(report)}
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FaEye />
                        View
                      </button>
                      <button
                        onClick={() => handleDownload(report)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        <FaDownload />
                        Download
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500 text-sm">Generating...</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
        <p className="text-blue-800 mb-4">
          If you're having trouble accessing your reports or need assistance, please contact our support team.
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
}
