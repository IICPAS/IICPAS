"use client";

import { useState } from "react";
import Image from "next/image";
import { FaPaperPlane } from "react-icons/fa";

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    // 🔁 TODO: Submit to backend or Google Sheets
  };

  return (
    <section className="w-full bg-white pt-24 pb-10 px-4 md:px-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left Image */}
        <div className="w-full h-full">
          <Image
            src="/images/contact-section.jpg" // Replace with actual path
            alt="Contact Support"
            width={600}
            height={600}
            className="rounded-2xl w-full h-auto object-cover"
          />
        </div>

        {/* Right Form */}
        <div>
          <h4 className="text-green-600 font-semibold text-sm mb-2">
            🎓 Get In Touch
          </h4>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            We’re Here To Help And Ready To Hear From You
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <input
              type="text"
              name="subject"
              required
              value={form.subject}
              onChange={handleChange}
              placeholder="Write about your enquiry"
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              placeholder="Write Your Message"
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>

            <button
              type="submit"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-full transition-all"
            >
              Submit <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
