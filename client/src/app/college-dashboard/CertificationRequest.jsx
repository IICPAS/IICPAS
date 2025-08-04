"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  PlusCircle,
  File,
  BookOpen,
  MapPin,
  DollarSign,
  Award,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  Eye,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api";
const BASE_URL = API.replace("/api", "");

export default function CollegeCertRequests() {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    course: "",
    syllabus: "",
    examCenter: "",
    fees: "",
    brochure: null,
    sampleCertificate: null,
  });
  const [loading, setLoading] = useState(false);
  const [college, setCollege] = useState({ name: "", email: "" });

  // Fetch current college info
  useEffect(() => {
    async function fetchCollege() {
      try {
        const res = await axios.get(`${API}/college/isCollege`, {
          withCredentials: true,
        });
        setCollege({ name: res.data.name, email: res.data.email });
      } catch {
        toast.error("Unauthorized. Please login.");
        window.location.href = "/join/college";
      }
    }
    fetchCollege();
  }, []);

  // Fetch this college's requests
  useEffect(() => {
    if (college.name) fetchRequests();
    // eslint-disable-next-line
  }, [college.name]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API}/certification-requests?college=${encodeURIComponent(
          college.name
        )}`
      );
      setRequests(res.data || []);
    } catch {
      setRequests([]);
    }
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.course) return toast.error("Enter course name");
    if (!form.syllabus) return toast.error("Enter syllabus");
    if (!form.examCenter) return toast.error("Enter exam center");
    if (!form.fees) return toast.error("Enter fees");

    setLoading(true);

    try {
      const data = new FormData();
      data.append("college", college.name);
      data.append("course", form.course);
      data.append("syllabus", form.syllabus);
      data.append("examCenter", form.examCenter);
      data.append("fees", form.fees);

      if (form.brochure) {
        data.append("brochure", form.brochure);
      }
      if (form.sampleCertificate) {
        data.append("sampleCertificate", form.sampleCertificate);
      }

      await axios.post(`${API}/certification-requests`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Certification request submitted successfully!");
      setForm({
        course: "",
        syllabus: "",
        examCenter: "",
        fees: "",
        brochure: null,
        sampleCertificate: null,
      });
      setShowForm(false);
      fetchRequests();
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit request");
    }
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Award className="w-8 h-8 text-blue-600" />
                Certification Requests
              </h1>
              <p className="text-gray-600">
                Manage your certification course requests and track their status
              </p>
            </div>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <PlusCircle size={20} />
              {showForm ? "Close Form" : "New Request"}
            </button>
          </div>

          {/* College Info Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {college.name}
                </h3>
                <p className="text-gray-600">{college.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Requests</p>
                <p className="text-2xl font-bold text-blue-600">
                  {requests.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Form */}
        {showForm && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  New Certification Request
                </h2>
              </div>

              <form onSubmit={handleAdd} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Course Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Course Name *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g. Advanced Data Analytics Certification"
                      value={form.course}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, course: e.target.value }))
                      }
                      required
                    />
                  </div>

                  {/* Fees */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Course Fees (₹) *
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="5000"
                      value={form.fees}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, fees: e.target.value }))
                      }
                      required
                    />
                  </div>

                  {/* Exam Center */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Exam Center *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g. Main Campus, Room 101"
                      value={form.examCenter}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, examCenter: e.target.value }))
                      }
                      required
                    />
                  </div>

                  {/* Syllabus */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Syllabus *
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Enter detailed syllabus for the certification course..."
                      value={form.syllabus}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, syllabus: e.target.value }))
                      }
                      required
                    />
                  </div>

                  {/* File Uploads */}
                  <div className="md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Brochure */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Course Brochure (Optional)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                            className="hidden"
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                brochure: e.target.files
                                  ? e.target.files[0]
                                  : null,
                              }))
                            }
                            id="brochure-upload"
                          />
                          <label
                            htmlFor="brochure-upload"
                            className="cursor-pointer"
                          >
                            <p className="text-sm text-gray-600 mb-1">
                              Click to upload brochure
                            </p>
                            <p className="text-xs text-gray-400">
                              PDF, DOC, or Images
                            </p>
                          </label>
                          {form.brochure && (
                            <div className="mt-2 text-sm text-blue-600 flex items-center justify-center gap-1">
                              <File className="w-4 h-4" />
                              {form.brochure.name}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Sample Certificate */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Sample Certificate (Optional)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                          <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            className="hidden"
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                sampleCertificate: e.target.files
                                  ? e.target.files[0]
                                  : null,
                              }))
                            }
                            id="certificate-upload"
                          />
                          <label
                            htmlFor="certificate-upload"
                            className="cursor-pointer"
                          >
                            <p className="text-sm text-gray-600 mb-1">
                              Click to upload sample
                            </p>
                            <p className="text-xs text-gray-400">
                              PDF or Images
                            </p>
                          </label>
                          {form.sampleCertificate && (
                            <div className="mt-2 text-sm text-blue-600 flex items-center justify-center gap-1">
                              <File className="w-4 h-4" />
                              {form.sampleCertificate.name}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </div>
                    ) : (
                      "Submit Request"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modern Cards Layout */}
        <div className="space-y-6">
          {requests.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Requests Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start by creating your first certification request
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Create First Request
              </button>
            </div>
          ) : (
            requests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                        <h3 className="text-xl font-semibold text-gray-900">
                          {request.course}
                        </h3>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {request.examCenter}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />₹
                          {request.fees?.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {getStatusIcon(request.status)}
                      <span className="text-sm font-semibold capitalize">
                        {request.status}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Syllabus:
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {request.syllabus}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {request.brochure && (
                      <a
                        href={`${BASE_URL}/${request.brochure.replace(
                          /^[./]*/,
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Brochure
                      </a>
                    )}
                    {request.sampleCertificate && (
                      <a
                        href={`${BASE_URL}/${request.sampleCertificate.replace(
                          /^[./]*/,
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Award className="w-4 h-4" />
                        View Certificate
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
