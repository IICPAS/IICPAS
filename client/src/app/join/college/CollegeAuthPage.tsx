/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import { FaEnvelope, FaLock, FaUser, FaPhone } from "react-icons/fa";

export default function CollegeAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [step, setStep] = useState(1); // Step 1 = Enter email, Step 2 = OTP + new password

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    document: null,
  });

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (name === "document") {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(isLogin ? "Logging in with:" : "Registering with:", form);
  };

  const handleSendOtp = (e: any) => {
    e.preventDefault();
    if (!form.email) return alert("Please enter your email first");
    console.log("OTP sent to:", form.email);
    setStep(2);
  };

  const handleResetPassword = (e: any) => {
    e.preventDefault();
    console.log(
      "Resetting password with OTP:",
      otp.join(""),
      "New password:",
      newPassword
    );
    setShowForgot(false);
    setStep(1);
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-5xl grid md:grid-cols-2">
        {/* Left Image Section */}
        <div className="hidden md:flex bg-green-100 items-center justify-center p-8">
          <Image
            src="/images/bk1.png"
            alt="College Auth"
            width={300}
            height={300}
            className="object-contain"
          />
        </div>

        {/* Right Form Section */}
        <div className="p-8 sm:p-12 relative">
          {!showForgot ? (
            <>
              <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
                {isLogin ? "College Login" : "College Signup"}
              </h2>

              {/* Switcher */}
              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`px-5 py-2 rounded-full font-semibold text-sm ${
                    isLogin
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-green-100"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`px-5 py-2 rounded-full font-semibold text-sm ${
                    !isLogin
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-green-100"
                  }`}
                >
                  Signup
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="flex items-center border px-4 py-2 rounded-md bg-white">
                      <FaUser className="text-gray-400 mr-2" />
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        required
                        className="w-full bg-transparent outline-none"
                      />
                    </div>
                    <div className="flex items-center border px-4 py-2 rounded-md bg-white">
                      <FaPhone className="text-gray-400 mr-2" />
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        required
                        className="w-full bg-transparent outline-none"
                      />
                    </div>
                  </>
                )}

                <div className="flex items-center border px-4 py-2 rounded-md bg-white">
                  <FaEnvelope className="text-gray-400 mr-2" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                    className="w-full bg-transparent outline-none"
                  />
                </div>

                <div className="flex items-center border px-4 py-2 rounded-md bg-white">
                  <FaLock className="text-gray-400 mr-2" />
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    className="w-full bg-transparent outline-none"
                  />
                </div>

                {!isLogin && (
                  <>
                    <div className="flex items-center border px-4 py-2 rounded-md bg-white">
                      <FaLock className="text-gray-400 mr-2" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        required
                        className="w-full bg-transparent outline-none"
                      />
                    </div>
                    <div className="text-sm">
                      <label className="block font-medium text-gray-600 mb-1">
                        Upload Verification Document
                      </label>
                      <input
                        type="file"
                        name="document"
                        onChange={handleChange}
                        accept=".pdf,.png,.jpg"
                        required
                        className="w-full text-sm"
                      />
                    </div>
                  </>
                )}

                {isLogin && (
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm text-green-600 hover:underline"
                      onClick={() => setShowForgot(true)}
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold transition-all"
                >
                  {isLogin ? "Login" : "Signup"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
                Reset Password
              </h2>
              <form
                onSubmit={step === 1 ? handleSendOtp : handleResetPassword}
                className="space-y-4"
              >
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full border px-4 py-2 rounded-md outline-none"
                />

                {step === 2 && (
                  <>
                    <div className="flex justify-between gap-2">
                      {otp.map((val, i) => (
                        <input
                          key={i}
                          type="text"
                          maxLength={1}
                          value={val}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          className="w-full text-center border py-2 rounded-md"
                        />
                      ))}
                    </div>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      className="w-full border px-4 py-2 rounded-md outline-none"
                    />
                  </>
                )}

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgot(false);
                      setStep(1);
                    }}
                    className="text-sm text-gray-500 underline"
                  >
                    Back to login
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md"
                  >
                    {step === 1 ? "Send OTP" : "Reset Password"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
