"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function StudentAuth() {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      alert("Login Successful");
      setLoading(false);
    }, 1000);
  };

  const handleSignup = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      alert("Account Created");
      setLoading(false);
    }, 1000);
  };

  const handleSendOtp = () => {
    setLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
    }, 1000);
  };

  const handleResetPassword = () => {
    setLoading(true);
    setTimeout(() => {
      alert("Password Reset Successful");
      setLoading(false);
      setMode("login");
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-10 flex items-center justify-center bg-gradient-to-br from-[#d0f4ff] via-white to-[#dbffeb] px-4">
      <div className="w-full max-w-md bg-white/40 border border-white/60 shadow-[0_10px_60px_rgba(0,0,0,0.1)] backdrop-blur-xl rounded-2xl px-6 py-10 md:px-10 transition-all duration-300">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#003057] mb-8">
          {mode === "login"
            ? "Student Login"
            : mode === "signup"
            ? "Create Account"
            : otpSent
            ? "Reset Password"
            : "Forgot Password"}
        </h2>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-5"
        >
          {/* Common Fields */}
          {(mode === "login" || mode === "signup" || mode === "forgot") && (
            <>
              {mode === "signup" && (
                <>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white/70 focus:ring-2 focus:ring-green-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">
                      Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white/70 focus:ring-2 focus:ring-green-400 outline-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white/70 focus:ring-2 focus:ring-green-400 outline-none"
                />
              </div>
            </>
          )}

          {/* Login */}
          {mode === "login" && (
            <>
              <div className="relative">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white/70 focus:ring-2 focus:ring-green-400 outline-none"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-9 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-md shadow-md transition"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="text-right text-sm">
                <button
                  onClick={() => {
                    setMode("forgot");
                    setOtpSent(false);
                  }}
                  className="text-green-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </>
          )}

          {/* Signup */}
          {mode === "signup" && (
            <>
              <div className="relative">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white/70 focus:ring-2 focus:ring-green-400 outline-none"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-9 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white/70 focus:ring-2 focus:ring-green-400 outline-none"
                />
              </div>

              <button
                onClick={handleSignup}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-md shadow-md transition"
              >
                {loading ? "Signing up..." : "Create Account"}
              </button>
            </>
          )}

          {/* Forgot Password */}
          {mode === "forgot" && !otpSent && (
            <button
              onClick={handleSendOtp}
              disabled={!email}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-md shadow-md transition"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          )}

          {mode === "forgot" && otpSent && (
            <>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit OTP"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white/70 focus:ring-2 focus:ring-green-400 outline-none"
                />
              </div>

              <div className="relative">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white/70 focus:ring-2 focus:ring-green-400 outline-none"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-9 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button
                onClick={handleResetPassword}
                disabled={!otp || !newPassword}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-md shadow-md transition"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}
        </form>

        <div className="mt-6 text-center text-sm text-gray-700">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-green-600 font-semibold hover:underline"
              >
                Sign up
              </button>
            </>
          ) : mode === "signup" ? (
            <>
              Already registered?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-green-600 font-semibold hover:underline"
              >
                Login
              </button>
            </>
          ) : (
            <>
              Back to{" "}
              <button
                onClick={() => setMode("login")}
                className="text-green-600 font-semibold hover:underline"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
