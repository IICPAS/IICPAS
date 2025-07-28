/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function StudentAuth() {
  const router = useRouter();
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

  const handleLogin = async () => {
    if (!email || !password) return alert("Please fill all fields");
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/v1/student/login`,
        { email, password },
        { withCredentials: true }
      );
      router.push("/student-dashboard");
      console.log(res.data);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!name || !phone || !email || !password || !confirmPassword) {
      return alert("Please fill all fields");
    }
    if (password !== confirmPassword) {
      return alert("Passwords do not match!");
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/student/register`,
        {
          name,
          email,
          phone,
          password,
          location: "Default Location",
          course: "Default Course",
          teacher: "Default Teacher",
        },
        { withCredentials: true }
      );
      alert("Account created!");
      console.log(res.data);
      setMode("login");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
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
          {(mode === "login" || mode === "signup" || mode === "forgot") && (
            <>
              {mode === "signup" && (
                <>
                  <Input label="Full Name" value={name} onChange={setName} />
                  <Input
                    label="Phone"
                    type="tel"
                    value={phone}
                    onChange={setPhone}
                  />
                </>
              )}

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
              />
            </>
          )}

          {mode === "login" && (
            <>
              <PasswordInput
                label="Password"
                value={password}
                onChange={setPassword}
              />
              <Button onClick={handleLogin} loading={loading} text="Login" />
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

          {mode === "signup" && (
            <>
              <PasswordInput
                label="Password"
                value={password}
                onChange={setPassword}
              />
              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
              <Button
                onClick={handleSignup}
                loading={loading}
                text="Create Account"
              />
            </>
          )}

          {mode === "forgot" && !otpSent && (
            <Button
              onClick={handleSendOtp}
              loading={loading}
              text="Send OTP"
              disabled={!email}
            />
          )}

          {mode === "forgot" && otpSent && (
            <>
              <Input label="Enter OTP" value={otp} onChange={setOtp} />
              <PasswordInput
                label="New Password"
                value={newPassword}
                onChange={setNewPassword}
              />
              <Button
                onClick={handleResetPassword}
                loading={loading}
                text="Reset Password"
                disabled={!otp || !newPassword}
              />
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

// Helper components
function Input({ label, value, onChange, type = "text" }: any) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700 mb-1 block">
        {label}
      </label>
      <input
        type={type}
        placeholder={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white/70 focus:ring-2 focus:ring-green-400 outline-none"
      />
    </div>
  );
}

function PasswordInput({ label, value, onChange }: any) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <label className="text-sm font-semibold text-gray-700 mb-1 block">
        {label}
      </label>
      <input
        type={show ? "text" : "password"}
        placeholder="••••••••"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white/70 focus:ring-2 focus:ring-green-400 outline-none"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-9 text-gray-500"
      >
        {show ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
}

function Button({ onClick, loading, text, disabled = false }: any) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-md shadow-md transition"
    >
      {loading ? `${text}...` : text}
    </button>
  );
}
