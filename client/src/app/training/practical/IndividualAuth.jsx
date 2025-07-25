"use client";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Eye icons

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api";

export default function IndividualAuthPanel() {
  const [tab, setTab] = useState("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Tab switch handler
  const switchTab = (t) => {
    setTab(t);
    setLoginForm({ email: "", password: "" });
    setSignupForm({
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setShowLoginPass(false);
    setShowSignupPass(false);
    setShowSignupConfirm(false);
    toast.dismiss();
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/individual/login`, loginForm, {
        withCredentials: true,
      });
      toast.success("Login successful!");
      setTimeout(() => (window.location.href = "/individual-dashboard"), 1200);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Login failed");
    }
    setLoading(false);
  };

  // Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/individual/signup`, signupForm, {
        withCredentials: true,
      });
      toast.success("Signup successful!");
      setTimeout(() => setTab("login"), 1200);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Signup failed");
    }
    setLoading(false);
  };

  return (
    <div className=" pb-20 flex items-center justify-center bg-gray-50 px-2">
      <div className="flex mt-24 bg-white rounded-xl shadow-2xl overflow-hidden max-w-6xl w-full">
        {/* Left Panel - SVG or Image */}
        <div className="hidden md:flex bg-green-50 flex-col justify-center items-center w-1/2 py-20 px-8">
          <img
            src="/calc.png" // Your image path here
            alt="Briefcase"
            className="w-60 h-60 mb-5 object-contain"
            draggable="false"
          />
          <h2 className="text-2xl font-semibold text-green-700 mb-2 text-center">
            Welcome to IICPA
          </h2>
          <p className="text-gray-500 text-center max-w-xs">
            Start your journey with our <b>Individual Portal</b> for jobs and
            upskilling.
          </p>
        </div>
        {/* Right Panel - Auth Forms */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
            Individual {tab === "login" ? "Login" : "Signup"}
          </h2>
          {/* Tab switch */}
          <div className="flex justify-center gap-2 mb-8">
            <button
              className={`px-6 py-2 rounded-full font-semibold ${
                tab === "login"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-green-100"
              }`}
              onClick={() => switchTab("login")}
            >
              Login
            </button>
            <button
              className={`px-6 py-2 rounded-full font-semibold ${
                tab === "signup"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-green-100"
              }`}
              onClick={() => switchTab("signup")}
            >
              Signup
            </button>
          </div>

          {/* LOGIN FORM */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                autoComplete="email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm((f) => ({ ...f, email: e.target.value }))
                }
                className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-200"
                required
              />
              <div className="relative">
                <input
                  type={showLoginPass ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm((f) => ({ ...f, password: e.target.value }))
                  }
                  className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-200"
                  required
                />
                <span
                  onClick={() => setShowLoginPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  title="Show/Hide Password"
                >
                  {showLoginPass ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </span>
              </div>
              <div className="flex justify-end text-green-700 mb-2">
                <a
                  href="/individual/forgot-password"
                  className="text-sm hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}

          {/* SIGNUP FORM */}
          {tab === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                autoComplete="name"
                value={signupForm.name}
                onChange={(e) =>
                  setSignupForm((f) => ({ ...f, name: e.target.value }))
                }
                className="w-full border p-3 rounded"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                autoComplete="tel"
                value={signupForm.phone}
                onChange={(e) =>
                  setSignupForm((f) => ({ ...f, phone: e.target.value }))
                }
                className="w-full border p-3 rounded"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                autoComplete="email"
                value={signupForm.email}
                onChange={(e) =>
                  setSignupForm((f) => ({ ...f, email: e.target.value }))
                }
                className="w-full border p-3 rounded"
                required
              />
              <div className="relative">
                <input
                  type={showSignupPass ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  value={signupForm.password}
                  onChange={(e) =>
                    setSignupForm((f) => ({ ...f, password: e.target.value }))
                  }
                  className="w-full border p-3 rounded"
                  required
                />
                <span
                  onClick={() => setShowSignupPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  title="Show/Hide Password"
                >
                  {showSignupPass ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </span>
              </div>
              <div className="relative">
                <input
                  type={showSignupConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  value={signupForm.confirmPassword}
                  onChange={(e) =>
                    setSignupForm((f) => ({
                      ...f,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="w-full border p-3 rounded"
                  required
                />
                <span
                  onClick={() => setShowSignupConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  title="Show/Hide Password"
                >
                  {showSignupConfirm ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition"
              >
                {loading ? "Signing up..." : "Signup"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
