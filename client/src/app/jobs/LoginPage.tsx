"use client";

import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add login logic here
    console.log("Logging in with", form);
  };

  return (
    <section className="pb-20 pt-20 flex items-center justify-center bg-white px-6 md:px-20 py-10">
      <div className="max-w-5xl w-full bg-white grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        {/* Left Illustration */}
        <div className="w-full">
          <img
            src="https://iicpa.coderworldlabs.in/assets/images/auth-bg/Learning-bro.png"
            alt="Student login"
            className="w-full object-contain"
          />
        </div>

        {/* Right Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6 text-[#0b1224]">
            Welcome to <span className="text-[#3cd664]">IICPA</span>
          </h2>

          {/* Email */}
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email..."
            required
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3cd664]"
          />

          {/* Password */}
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password..."
            required
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3cd664]"
          />

          <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                onChange={() => setShowPassword(!showPassword)}
                className="accent-[#3cd664]"
              />
              Show Password
            </label>
            <a href="#" className="text-[#3cd664] hover:underline">
              Forget password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#0b1224] text-white py-3 rounded-full text-lg font-semibold hover:bg-[#1e2a45] transition"
          >
            Login
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Not registered yet?{" "}
            <a
              href="#"
              className="text-[#3cd664] hover:underline font-semibold"
            >
              Create an Account
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}
