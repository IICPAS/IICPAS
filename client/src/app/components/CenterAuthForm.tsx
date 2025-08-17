"use client";
import Image from "next/image";
import { useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaUser,
  FaMapMarkerAlt,
  FaBuilding,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

// Input component
interface InputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ComponentType<{ className?: string }>;
  required?: boolean;
}

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  icon: Icon,
  required = true,
}: InputProps) => (
  <div className="relative">
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
          Icon ? "pl-10" : ""
        }`}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  </div>
);

// Password Input component
interface PasswordInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  onToggle: () => void;
  required?: boolean;
}

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  showPassword,
  onToggle,
  required = true,
}: PasswordInputProps) => (
  <div className="relative">
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaLock className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        {showPassword ? (
          <FaEyeSlash className="h-5 w-5 text-gray-400" />
        ) : (
          <FaEye className="h-5 w-5 text-gray-400" />
        )}
      </button>
    </div>
  </div>
);

// Select Dropdown component
interface SelectDropdownProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
}

const SelectDropdown = ({
  label,
  name,
  value,
  onChange,
  options,
  required = true,
}: SelectDropdownProps) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((option: string) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default function CenterAuthForm() {
  const [mode, setMode] = useState<"register" | "login">("register");
  const [loading, setLoading] = useState(false);

  // Register form state
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    address: "",
    type: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL;

  // Form handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("phone", form.phone);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("location", form.location);
      formData.append("address", form.address);
      formData.append("type", form.type);

      if (selectedFile) {
        formData.append("document", selectedFile);
      }

      const res = await axios.post(`${API}/api/v1/centers/register`, formData, {
        withCredentials: true,
      });

      toast.success(res.data.message);
      setMode("login");
      setForm({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        location: "",
        address: "",
        type: "",
      });
      setSelectedFile(null);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${API}/api/v1/centers/login`,
        {
          email: loginEmail,
          password: loginPassword,
        },
        { withCredentials: true }
      );

      toast.success(res.data.message);
      window.location.href = "/center-dashboard";
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const centerTypes = [
    "Training Institute",
    "Educational Center",
    "Coaching Center",
    "Skill Development Center",
    "Professional Training Center",
    "Other",
  ];

  const locations = [
    "Greater Noida",
    "Noida",
    "Delhi",
    "Gurgaon",
    "Faridabad",
    "Ghaziabad",
    "Other",
  ];

  return (
    <div className="pt-20 flex justify-center items-center bg-gray-50 p-4 mt-20">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Panel - Visual (Hidden on mobile) */}
          <div className=" bg-gradient-to-br from-green-400 to-green-600 p-8 flex justify-center lg:pt-42">
            <div className="text-center text-white">
              <div className="mb-6">
                <Image
                  src="/images/logo.png"
                  height={120}
                  width={150}
                  alt="IICPA Logo"
                  className="mx-auto"
                />
              </div>
              <h2 className="text-3xl font-bold mb-4">Center Portal</h2>
              <p className="text-lg opacity-90">
                Join our network of training centers and help students achieve
                their goals
              </p>
            </div>
          </div>

          {/* Right Panel - Form (Full width on mobile) */}
          <div className="p-8 lg:p-12">
            {/* Mobile Logo (Only visible on mobile) */}
            <div className="lg:hidden text-center mb-6">
              <Image
                src="/images/logo.png"
                height={80}
                width={100}
                alt="IICPA Logo"
                className="mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                Center Portal
              </h2>
              <p className="text-sm text-gray-600">
                Join our network of training centers
              </p>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Center {mode === "register" ? "Signup" : "Login"}
              </h2>
            </div>

            {/* Mode Toggle */}
            <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                  mode === "login"
                    ? "bg-white text-green-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setMode("register")}
                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                  mode === "register"
                    ? "bg-white text-green-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Signup
              </button>
            </div>

            {/* Register Form */}
            {mode === "register" && (
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Center Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    icon={FaBuilding}
                  />
                  <Input
                    label="Phone Number"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    icon={FaPhone}
                  />
                </div>

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  icon={FaEnvelope}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectDropdown
                    label="Location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    options={locations}
                  />
                  <SelectDropdown
                    label="Center Type"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    options={centerTypes}
                  />
                </div>

                <Input
                  label="Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  icon={FaMapMarkerAlt}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <PasswordInput
                    label="Password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    showPassword={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                  />
                  <PasswordInput
                    label="Confirm Password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    showPassword={showConfirm}
                    onToggle={() => setShowConfirm(!showConfirm)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Verification Document
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Upload business registration, license, or any verification
                    document
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-4 px-6 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
                >
                  {loading ? "Signing up..." : "Signup"}
                </button>
              </form>
            )}

            {/* Login Form */}
            {mode === "login" && (
              <form onSubmit={handleLogin} className="space-y-6">
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={loginEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLoginEmail(e.target.value)
                  }
                  icon={FaEnvelope}
                />

                <PasswordInput
                  label="Password"
                  name="password"
                  value={loginPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLoginPassword(e.target.value)
                  }
                  showPassword={showLoginPassword}
                  onToggle={() => setShowLoginPassword(!showLoginPassword)}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-4 px-6 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
