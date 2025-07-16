"use client";

import { useState } from "react";

export default function ProfileTab() {
  const tabs = [
    "Basic Profile",
    "Job Profile",
    "Billing Information",
    "Notifications",
    "Account",
  ];

  const [activeTab, setActiveTab] = useState("Basic Profile");

  return (
    <div className="flex flex-col min-h-screen lg:flex-row gap-6 px-6 pt-20 pb-10 font-sans">
      {/* Left Sidebar */}
      <div className="w-full lg:w-1/4 bg-white border rounded-xl shadow-md p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-gray-200 w-24 h-24 rounded-full flex items-center justify-center text-4xl text-gray-500">
            📷
          </div>
          <div>
            <h2 className="text-xl font-bold text-blue-700">
              Gupta Enterprises
            </h2>
            <p className="text-sm text-gray-700">guptaab1356@gmail.com</p>
            <p className="text-sm text-gray-800 font-semibold">8920406657</p>
          </div>
          <div className="text-orange-600 text-sm font-medium flex items-center justify-center gap-1">
            <span>Notifications</span> <span>🔔</span>
          </div>
          <button className="text-red-600 mt-4 border px-4 py-2 rounded-lg hover:bg-red-50">
            Log Out
          </button>
        </div>
      </div>

      {/* Right Content */}
      <div className="w-full lg:w-3/4 bg-white rounded-xl shadow-md">
        {/* Tabs */}
        <div className="flex gap-4 px-6 pt-4 border-b overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-3 text-sm font-medium ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "Basic Profile" && (
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Name
                </label>
                <input
                  type="text"
                  defaultValue="Gupta Enterprises"
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Email address
                </label>
                <input
                  type="email"
                  defaultValue="guptaab1356@gmail.com"
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Phone Number
                </label>
                <input
                  type="text"
                  defaultValue="8920406657"
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Date of Birth
                </label>
                <input
                  type="date"
                  defaultValue="1963-10-08"
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Select your State
                </label>
                <select className="w-full mt-1 p-2 border rounded">
                  <option>Uttar Pradesh</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Select your District
                </label>
                <select className="w-full mt-1 p-2 border rounded">
                  <option>Agra</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-600">
                  Area/Locality
                </label>
                <input
                  type="text"
                  defaultValue="Gautam Buddha Nagar"
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Gender
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="gender" defaultChecked />
                    Male
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="gender" />
                    Female
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="gender" />
                    Other
                  </label>
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          )}

          {/* Placeholder for other tabs */}
          {activeTab !== "Basic Profile" && (
            <div className="text-gray-600 italic">
              {activeTab} content coming soon...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
