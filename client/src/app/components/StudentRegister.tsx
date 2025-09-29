/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Select from "react-select";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

export default function StudentRegisterForm() {
  // Mode: register | login | forgot
  const [mode, setMode] = useState<"register" | "login" | "forgot">("register");

  // --- Register form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    mode: "Digital Hub+Virtual",
    location: "Greater Noida",
    center: "Greater Noida",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // --- Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // --- Forgot password state
  const [forgotStep, setForgotStep] = useState<"email" | "otp">("email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  // --- Register handlers
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleCenterChange = (selected: any) => {
    setForm((prev) => ({ ...prev, center: selected.value }));
  };


  const handleRegister = async (e: any) => {
    e.preventDefault();
    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      mode,
      location,
      center,
    } = form;
    if (!name || !email || !phone || !password || !confirmPassword)
      return toast.success("All fields required");
    if (password !== confirmPassword) return toast("Passwords do not match!");
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/students/register`,
        {
          name,
          email,
          phone,
          password,
          mode,
          location,
          center,
        },
        { withCredentials: true }
      );
      toast.success("Registration successful!", {
        style: {
          zIndex: 9999,
        },
      });
      setMode("login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Registration failed", {
        style: {
          zIndex: 9999,
        },
      });
    }
  };

  // --- Login handlers
  const handleLogin = async (e: any) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword)
      return toast.error("Email and password required");
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/students/login`,
        { email: loginEmail, password: loginPassword },
        { withCredentials: true }
      );
      toast.success("Login successful", {
        style: {
          zIndex: 9999,
        },
      });
      window.location.href = "/student-dashboard";
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed", {
        style: {
          zIndex: 9999,
        },
      });
    }
  };

  // --- Forgot password handlers
  const handleSendOtp = async (e: any) => {
    e.preventDefault();
    if (!forgotEmail) return alert("Enter your email");
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/students/forgot-password`,
        { email: forgotEmail }
      );
      toast.success("OTP sent to your email.");
      setForgotStep("otp");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send OTP.");
    }
    setLoading(false);
  };
  const handleResetPassword = async (e: any) => {
    e.preventDefault();
    if (!otp || !newPassword) return toast.error("All fields required");
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/students/reset-password`,
        { email: forgotEmail, otp, newPassword }
      );
      toast.success("Password reset successful");
      setMode("login");
      setForgotStep("email");
      setForgotEmail("");
      setOtp("");
      setNewPassword("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Password reset failed.");
    }
    setLoading(false);
  };

  const centerOptions = [{ label: "Greater Noida", value: "Greater Noida" }];

  // --- Render ---
  return (
    <div
      className="pt-36 flex justify-center items-center bg-gray-50 p-4 min-h-screen"
      style={{ position: "relative", zIndex: 1 }}
    >
      <div className="w-full max-w-lg  bg-white rounded-xl shadow p-5">
        <div className="flex justify-center items-center">
          <h2 className="text-2xl font-bold text-center mb-6">
            <Image
              src="/images/logo.png"
              height={100}
              width={120}
              alt="LMS Logo"
            />
          </h2>
        </div>
        {/* REGISTER */}
        {mode === "register" && (
          <form
            onSubmit={handleRegister}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Input
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            <Input
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
            <SelectDropdown
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              options={["Greater Noida"]}
            />
            <SelectDropdown
              label="Mode"
              name="mode"
              value={form.mode}
              onChange={handleChange}
              options={["Digital Hub+Virtual", "Digital Hub+Center"]}
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Center
              </label>
              <Select
                options={centerOptions}
                value={centerOptions.find((opt) => opt.value === form.center)}
                onChange={handleCenterChange}
                placeholder="Select center"
                aria-label="Center selection"
              />
            </div>
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
            <PasswordInput
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
            />
            <div className="md:col-span-2">
              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                show={showConfirm}
                toggle={() => setShowConfirm(!showConfirm)}
              />
            </div>


            <button
              type="submit"
              className="md:col-span-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
            >
              Register
            </button>
            <div className="md:col-span-2 text-center mt-2 text-sm text-gray-700">
              Already have an account?{" "}
              <button
                type="button"
                className="text-green-600 font-semibold hover:underline"
                onClick={() => setMode("login")}
              >
                Login
              </button>
            </div>
          </form>
        )}

        {/* LOGIN */}
        {mode === "login" && (
          <form
            onSubmit={handleLogin}
            className="space-y-6 w-[30vw] p-4 mx-auto"
          >
            <Input
              label="Email"
              name="loginEmail"
              type="email"
              value={loginEmail}
              onChange={(e: any) => setLoginEmail(e.target.value)}
            />
            <PasswordInput
              label="Password"
              name="loginPassword"
              value={loginPassword}
              onChange={(e: any) => setLoginPassword(e.target.value)}
              show={showLoginPassword}
              toggle={() => setShowLoginPassword(!showLoginPassword)}
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
            >
              Login
            </button>
            <div className="text-center text-sm mt-2">
              <button
                type="button"
                className="text-green-600 hover:underline"
                onClick={() => setMode("forgot")}
              >
                Forgot password?
              </button>
            </div>
            <div className="text-center text-sm mt-2">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="text-green-600 font-semibold hover:underline"
                onClick={() => setMode("register")}
              >
                Register
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD */}
        {mode === "forgot" && (
          <form
            onSubmit={
              forgotStep === "email" ? handleSendOtp : handleResetPassword
            }
            className="space-y-6 max-w-sm mx-auto"
          >
            {forgotStep === "email" && (
              <Input
                label="Email"
                type="email"
                value={forgotEmail}
                onChange={(e: any) => setForgotEmail(e.target.value)}
              />
            )}
            {forgotStep === "otp" && (
              <>
                <Input
                  label="Enter OTP"
                  value={otp}
                  onChange={(e: any) => setOtp(e.target.value)}
                />
                <PasswordInput
                  label="New Password"
                  value={newPassword}
                  onChange={(e: any) => setNewPassword(e.target.value)}
                  show={showForgotPassword}
                  toggle={() => setShowForgotPassword(!showForgotPassword)}
                />
              </>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
            >
              {loading
                ? "Processing..."
                : forgotStep === "email"
                ? "Send OTP"
                : "Reset Password"}
            </button>
            {forgotStep === "otp" && (
              <div className="text-sm mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setForgotStep("email");
                    setOtp("");
                    setNewPassword("");
                  }}
                  className="text-green-600 hover:underline"
                >
                  Back to Email
                </button>
              </div>
            )}
            <div className="text-center text-sm mt-4">
              Remembered your password?{" "}
              <button
                type="button"
                className="text-green-600 font-semibold hover:underline"
                onClick={() => setMode("login")}
              >
                Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// --- Input field ---
function Input({ label, name, value, onChange, type = "text" }: any) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 outline-none"
      />
    </div>
  );
}

// --- Select Dropdown ---
function SelectDropdown({ label, name, value, onChange, options }: any) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        title={label}
        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-400 outline-none"
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

// --- Password field with eye icon ---
function PasswordInput({ label, name, value, onChange, show, toggle }: any) {
  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 outline-none pr-10"
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-9 text-gray-500"
        tabIndex={-1}
      >
        {show ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
}
