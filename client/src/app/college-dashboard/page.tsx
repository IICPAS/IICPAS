/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Header from "../components/Header";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

const CollegeDashboardPage = () => {
  const router = useRouter();
  const [college, setCollege] = useState<any>(null); // College object from backend

  useEffect(() => {
    const checkCollegeAuth = async () => {
      try {
        const res = await axios.get(`${API}/api/college/isCollege`, {
          withCredentials: true,
        });
        setCollege(res.data.college);
      } catch (err) {
        toast.error("Unauthorized. Please login.");
        router.push("/join/college"); // Redirect if not logged in
      }
    };

    checkCollegeAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await axios.get(`${API}/api/college/logout`, {
        withCredentials: true,
      });
      toast.success("Logged out successfully");
      router.push("/college-login"); // Redirect after logout
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  if (!college) return null;

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <div className="max-w-5xl mx-auto py-20 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-700">
            Welcome, {college.name}
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
          >
            Logout
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          You are logged in as a verified college administrator.
        </p>

        {/* Add dashboard widgets here later */}
        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-gray-500">Your college dashboard goes here.</p>
        </div>
      </div>
    </div>
  );
};

export default CollegeDashboardPage;
