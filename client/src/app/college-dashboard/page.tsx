/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Header from "../components/Header"; // adjust path if different

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

const CollegeDashboard = () => {
  const router = useRouter();
  const [college, setCollege] = useState<any>(null);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const res = await axios.get(`${API}/api/college/isCollege`, {
          withCredentials: true,
        });
        setCollege(res.data.college);
      } catch (err) {
        toast.error("Unauthorized. Please login.");
        router.push("/join/college"); // or "/college-login"
      }
    };

    fetchCollege();
  }, [router]);

  const handleLogout = async () => {
    try {
      await axios.get(`${API}/api/college/logout`, {
        withCredentials: true,
      });
      toast.success("Logged out");
      router.push("/college-login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  // if (!college) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <p>Hi</p>
    </div>
  );
};

export default CollegeDashboard;
