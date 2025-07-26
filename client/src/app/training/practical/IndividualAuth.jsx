"use client";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api";

export default function IndividualAuthPanel() {
  const [tab, setTab] = useState("login"); // login | signup | forgot | reset
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [resetForm, setResetForm] = useState({
    email: "",
    token: "",
    password: "",
    confirmPassword: "",
  });
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setResetForm({ email: "", token: "", password: "", confirmPassword: "" });
    toast.dismiss();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/v1/individual/login`, loginForm, {
        withCredentials: true,
      });
      toast.success("Login successful!");
      setTimeout(() => (window.location.href = "/personal-dashboard"), 1200);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Login failed");
    }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword)
      return toast.error("Passwords do not match!");

    setLoading(true);
    try {
      await axios.post(`${API}/v1/individual/signup`, signupForm, {
        withCredentials: true,
      });
      toast.success("Signup successful!");
      setTimeout(() => setTab("login"), 1200);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Signup failed");
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/v1/individual/forgot-password`, {
        email: resetForm.email,
      });
      toast.success("Token sent to your email");
      setTab("reset");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Email not found");
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (resetForm.password !== resetForm.confirmPassword)
      return toast.error("Passwords do not match");

    setLoading(true);
    try {
      await axios.post(`${API}/v1/individual/reset-password`, resetForm, {
        withCredentials: true,
      });
      toast.success("Password reset successful!");
      setTimeout(() => setTab("login"), 1500);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Reset failed");
    }
    setLoading(false);
  };

  return (
    <div className="pb-20 flex items-center justify-center bg-gray-50 px-2">
      <div className="flex mt-24 bg-white rounded-xl shadow-2xl overflow-hidden max-w-6xl w-full">
        {/* Left Panel */}
        <div className="hidden md:flex bg-green-50 flex-col justify-center items-center w-1/2 py-20 px-8">
          <img src="/calc.png" alt="Briefcase" className="w-60 h-60 mb-5" />
          <h2 className="text-2xl font-semibold text-green-700 mb-2 text-center">
            Welcome to IICPA
          </h2>
          <p className="text-gray-500 text-center max-w-xs">
            Start your journey with our <b>Individual Portal</b> for jobs and
            upskilling.
          </p>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
            {tab === "login"
              ? "Individual Login"
              : tab === "signup"
              ? "Individual Signup"
              : tab === "forgot"
              ? "Forgot Password"
              : "Reset Password"}
          </h2>

          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {["login", "signup"].map((t) => (
              <button
                key={t}
                className={`px-6 py-2 rounded-full font-semibold ${
                  tab === t
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-green-100"
                }`}
                onClick={() => switchTab(t)}
              >
                {t === "login" ? "Login" : "Signup"}
              </button>
            ))}
          </div>

          {/* Login Form */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="Email Address"
                className="w-full border p-3 rounded"
                required
              />
              <div className="relative">
                <input
                  type={showLoginPass ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm((f) => ({ ...f, password: e.target.value }))
                  }
                  placeholder="Password"
                  className="w-full border p-3 rounded"
                  required
                />
                <span
                  onClick={() => setShowLoginPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showLoginPass ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
              <div className="text-sm text-right text-green-600">
                <button type="button" onClick={() => setTab("forgot")}>
                  Forgot Password?
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}

          {/* Signup Form */}
          {tab === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              {["name", "phone", "email"].map((field) => (
                <input
                  key={field}
                  type={field === "email" ? "email" : "text"}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={signupForm[field]}
                  onChange={(e) =>
                    setSignupForm((f) => ({ ...f, [field]: e.target.value }))
                  }
                  className="w-full border p-3 rounded"
                  required
                />
              ))}
              {["password", "confirmPassword"].map((field, i) => (
                <div key={field} className="relative">
                  <input
                    type={
                      i === 0
                        ? showSignupPass
                          ? "text"
                          : "password"
                        : showSignupConfirm
                        ? "text"
                        : "password"
                    }
                    placeholder={
                      field === "confirmPassword"
                        ? "Confirm Password"
                        : "Password"
                    }
                    value={signupForm[field]}
                    onChange={(e) =>
                      setSignupForm((f) => ({
                        ...f,
                        [field]: e.target.value,
                      }))
                    }
                    className="w-full border p-3 rounded"
                    required
                  />
                  <span
                    onClick={() =>
                      field === "confirmPassword"
                        ? setShowSignupConfirm((v) => !v)
                        : setShowSignupPass((v) => !v)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {i === 0 ? (
                      showSignupPass ? (
                        <FiEyeOff />
                      ) : (
                        <FiEye />
                      )
                    ) : showSignupConfirm ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </span>
                </div>
              ))}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded"
              >
                {loading ? "Signing up..." : "Signup"}
              </button>
            </form>
          )}

          {/* Forgot Password */}
          {tab === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input
                type="email"
                value={resetForm.email}
                onChange={(e) =>
                  setResetForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="Your Email"
                className="w-full border p-3 rounded"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded"
              >
                {loading ? "Sending..." : "Send Reset Token"}
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => switchTab("login")}
                  className="text-sm text-green-600 hover:underline"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}

          {/* Reset Password */}
          {tab === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="text"
                placeholder="Reset Token"
                value={resetForm.token}
                onChange={(e) =>
                  setResetForm((f) => ({ ...f, token: e.target.value }))
                }
                className="w-full border p-3 rounded"
                required
              />
              {["password", "confirmPassword"].map((field) => (
                <input
                  key={field}
                  type="password"
                  placeholder={
                    field === "confirmPassword"
                      ? "Confirm Password"
                      : "New Password"
                  }
                  value={resetForm[field]}
                  onChange={(e) =>
                    setResetForm((f) => ({ ...f, [field]: e.target.value }))
                  }
                  className="w-full border p-3 rounded"
                  required
                />
              ))}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
