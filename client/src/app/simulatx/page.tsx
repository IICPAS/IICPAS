"use client";

import { useState } from "react";
import {
  FaGlobe,
  FaLeaf,
  FaUsers,
  FaFileAlt,
  FaCheck,
  FaHandPointRight,
} from "react-icons/fa";

export default function SimulatXPage() {
  const [formData, setFormData] = useState({
    uan: "",
    password: "",
    captcha: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simulation Banner */}
      <div className="bg-red-600 text-white text-center py-3 font-bold text-lg uppercase">
        This is a Simulation. Use For Educational Purposes ONLY.
      </div>

      {/* Main Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">S</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-blue-800">
                SIMULATX ORGANISATION
              </h1>
              <p className="text-blue-600 text-lg">
                MINISTRY OF EDUCATION & TECHNOLOGY, GOVERNMENT OF INDIA
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding */}
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
                <FaGlobe className="text-white text-6xl" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                SimulatX
              </h2>
              <p className="text-2xl text-gray-600 mb-4">भारत 2024 INDIA</p>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-lg text-gray-700">
                <FaLeaf className="text-green-600" />
                <span>वसुधैव कुटुम्बकम्</span>
              </div>
              <p className="text-lg text-gray-600 mt-2">
                ONE EARTH • ONE FAMILY • ONE FUTURE
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 via-blue-500 to-green-500 rounded-full mb-4">
                <FaUsers className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Universal Account Number (UAN)
              </h3>
              <p className="text-xl font-semibold text-blue-600">
                MEMBER e-SEWA
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UAN :
                </label>
                <input
                  type="text"
                  name="uan"
                  value={formData.uan}
                  onChange={handleInputChange}
                  placeholder="Enter UAN"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password :
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Captcha :
                </label>
                <div className="flex gap-3">
                  <div className="flex-1 bg-gray-100 p-3 rounded-lg border-2 border-dashed border-gray-300 text-center font-mono text-lg">
                    P237M
                  </div>
                  <input
                    type="text"
                    name="captcha"
                    value={formData.captcha}
                    onChange={handleInputChange}
                    placeholder="Enter Captcha"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ uan: "", password: "", captcha: "" })
                  }
                  className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Reset
                </button>
              </div>

              <div className="text-center">
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Forgot Password?
                </a>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Information Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {/* Dear Members Panel */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="bg-green-600 text-white px-4 py-3 rounded-t-lg">
              <h3 className="font-semibold">Dear SimulatX Members !!</h3>
            </div>
            <div className="p-4 space-y-3">
              {[
                "Important notice about Aadhaar linking. Click here.",
                "Benefits for Unorganised workers registering on e SHRAM portal. Click here",
                "Kind attention Members. Now Aadhaar is mandatory for filing ECR.",
                "Important notice about EDLI. Click here to read.",
                "Important notice about Bank Account Linking with UAN. Click here to read",
              ].map((notice, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <FaFileAlt className="text-red-500 mt-1 flex-shrink-0" />
                  <span>{notice}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Panel */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="bg-green-600 text-white px-4 py-3 rounded-t-lg">
              <h3 className="font-semibold">Benefits of Registration</h3>
            </div>
            <div className="p-4 space-y-3">
              {[
                "Download/Print your Updated Passbook anytime.",
                "Download/ Print your UAN Card.",
                "Update your KYC information.",
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Important Links Panel */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="bg-green-600 text-white px-4 py-3 rounded-t-lg">
              <h3 className="font-semibold">Important Links</h3>
            </div>
            <div className="p-4 space-y-3">
              {[
                "Track Application Status for Pension on Higher Wages",
                "Activate UAN",
                "Know your UAN",
                "Direct UAN Allotment by Employees",
              ].map((link, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <FaHandPointRight className="text-green-500 mt-1 flex-shrink-0" />
                  <span>{link}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
