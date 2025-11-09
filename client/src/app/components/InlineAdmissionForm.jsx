"use client";

import { useState, useEffect } from "react";
import { FaCheck, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";

const COURSE_OPTIONS = [
  "Taxation",
  "HR",
  "Finance",
  "US CMA",
  "Accounting",
  "Tally Foundation",
  "GST",
  "Income Tax",
  "TDS",
  "B.Tech (All Specializations)",
  "BBA",
  "BCA",
  "B.Pharma",
  "D.Pharma",
  "LLB",
  "BA LLB",
  "BBA LLB",
  "B.Ed",
  "MBA",
  "LLM",
  "Ph.D (All Specializations)",
  "Other",
];

const InlineAdmissionForm = ({ selectedCourse = "" }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    name: "",
    email: "",
    course: selectedCourse,
  });

  const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";

  // Update course when selectedCourse prop changes
  useEffect(() => {
    if (selectedCourse) {
      setFormData((prev) => ({
        ...prev,
        course: selectedCourse,
      }));
    }
  }, [selectedCourse]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateStep1 = () => {
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!formData.course) {
      toast.error("Please select a course");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevious = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API}/leads`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        course: formData.course,
        type: "Admission Course",
        message: `Admission inquiry for ${formData.course} course`,
      });

      if (response.data.success) {
        toast.success(
          "Admission application submitted successfully! We'll contact you soon."
        );
        handleReset();
      }
    } catch (error) {
      console.error("Error submitting admission:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setFormData({
      phone: "",
      name: "",
      email: "",
      course: selectedCourse,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-w-4xl mx-auto my-12">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Admission Open
        </h2>
        <p className="text-gray-600 text-center mt-2">
          Apply for admission to our programs
        </p>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-center">
          {/* Step 1 */}
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {currentStep > 1 ? <FaCheck size={12} /> : "1"}
            </div>
            <span
              className={`ml-2 text-sm font-medium ${
                currentStep >= 1 ? "text-green-600" : "text-gray-500"
              }`}
            >
              Contact Info
            </span>
          </div>

          {/* Connector Line */}
          <div
            className={`w-16 h-0.5 mx-4 ${
              currentStep >= 2 ? "bg-green-600" : "bg-gray-300"
            }`}
          ></div>

          {/* Step 2 */}
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {currentStep > 2 ? <FaCheck size={12} /> : "2"}
            </div>
            <span
              className={`ml-2 text-sm font-medium ${
                currentStep >= 2 ? "text-green-600" : "text-gray-500"
              }`}
            >
              Course Details
            </span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-6 pb-6">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your 10-digit phone number"
                maxLength="10"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                placeholder="Phone number from step 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email ID *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course *
              </label>
              <select
                value={formData.course}
                onChange={(e) => handleInputChange("course", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select a course</option>
                {COURSE_OPTIONS.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={currentStep === 1 ? handleReset : handlePrevious}
            className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {currentStep === 1 ? (
              <>Reset</>
            ) : (
              <>
                <FaArrowLeft size={14} />
                Previous
              </>
            )}
          </button>

          <button
            onClick={currentStep === 1 ? handleNext : handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : currentStep === 1 ? (
              <>
                Next
                <FaArrowRight size={14} />
              </>
            ) : (
              <>
                Submit Application
                <FaCheck size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InlineAdmissionForm;
