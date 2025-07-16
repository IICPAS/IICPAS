"use client";
import { Mail, PhoneCall, MapPin } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="bg-gradient-to-br from-[#f5fcfa] via-white to-[#e6f6ec] py-5 px-6 md:px-10 text-gray-800 mt-20 pt-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        {/* Left Form */}
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-10 leading-tight text-[#111]">
            Let’s <span className="text-green-600">Get in Touch</span>
          </h2>

          <form className="space-y-5">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-5 py-3 rounded-xl text-gray-900 placeholder:text-gray-500 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-5 py-3 rounded-xl text-gray-900 placeholder:text-gray-500 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="text"
              placeholder="Subject"
              className="w-full px-5 py-3 rounded-xl text-gray-900 placeholder:text-gray-500 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <textarea
              placeholder="Your Message"
              rows={4}
              className="w-full px-5 py-3 rounded-xl text-gray-900 placeholder:text-gray-500 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Right Info Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-green-100 rounded-3xl p-8 md:p-10 shadow-xl space-y-6">
          <div className="flex items-start gap-4">
            <PhoneCall className="mt-1 text-green-600" size={24} />
            <div>
              <p className="font-bold text-gray-900">Phone</p>
              <p className="text-sm text-gray-700">+91 98765 43210</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Mail className="mt-1 text-green-600" size={24} />
            <div>
              <p className="font-bold text-gray-900">Email</p>
              <p className="text-sm text-gray-700">support@iicpa.org</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="mt-1 text-green-600" size={24} />
            <div>
              <p className="font-bold text-gray-900">Address</p>
              <p className="text-sm text-gray-700">
                123 Knowledge Park, New Delhi, India
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
