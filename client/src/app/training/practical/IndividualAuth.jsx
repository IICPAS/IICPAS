"use client";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff, FiUpload, FiFile, FiTrash2 } from "react-icons/fi";

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
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedDocument, setUploadedDocument] = useState(null);

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
    setSelectedFile(null);
    setUploadedDocument(null);
    toast.dismiss();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.name.toLowerCase().endsWith(".docx")
      ) {
        setSelectedFile(file);
        toast.success("Document selected successfully!");
      } else {
        toast.error("Please select a .docx file only!");
        e.target.value = null;
      }
    }
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

    // Validate all required fields
    if (
      !signupForm.name ||
      !signupForm.email ||
      !signupForm.phone ||
      !signupForm.password ||
      !signupForm.confirmPassword
    ) {
      return toast.error("All fields are required!");
    }

    if (signupForm.password !== signupForm.confirmPassword)
      return toast.error("Passwords do not match!");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", signupForm.name);
      formData.append("email", signupForm.email);
      formData.append("phone", signupForm.phone);
      formData.append("password", signupForm.password);
      formData.append("confirmPassword", signupForm.confirmPassword);

      // Add document if selected
      if (selectedFile) {
        formData.append("document", selectedFile);
      }

      // Debug: Log form data
      console.log("Form data being sent:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axios.post(
        `${API}/v1/individual/signup`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Signup response:", response.data);
      toast.success("Signup successful!");
      setTimeout(() => setTab("login"), 1200);
    } catch (err) {
      console.error("Signup error:", err);
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

              {/* Document Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Upload Document (Optional)
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  Upload your resume or any relevant document (.docx only)
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiUpload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          DOCX files only (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".docx"
                        onChange={handleFileSelect}
                      />
                    </label>
                  </div>

                  {selectedFile && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FiFile className="text-green-600" />
                        <span className="text-sm text-gray-700">
                          {selectedFile.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          toast.success("Document removed.");
                        }}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

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
