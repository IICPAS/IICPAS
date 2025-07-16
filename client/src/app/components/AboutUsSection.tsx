"use client";

import { BookOpen, Users, BarChart3 } from "lucide-react";
import Image from "next/image";

export default function AboutUsSection() {
  return (
    <section className="bg-white py-16 px-6 md:px-20 text-gray-800">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Side */}
        <div className="relative w-full md:w-[45%]">
          {/* Image */}
          <Image
            src="/images/about.jpeg"
            alt="Student"
            width={500}
            height={500}
            className="rounded-3xl shadow-2xl"
          />

          {/* Testimonial */}
          <div className="absolute top-4 left-4 bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 max-w-[250px]">
            <p className="text-sm italic text-gray-600">
              “It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout.”
            </p>
            <div className="mt-3 flex items-center gap-2">
              <Image
                src="/user.png"
                alt="Alisa"
                width={32}
                height={32}
                className="rounded-full"
              />
              <div>
                <h4 className="font-bold text-sm">Alisa Oliva</h4>
                <p className="text-xs text-gray-500">Web Designer</p>
              </div>
            </div>
          </div>

          {/* Class Day Box */}
          <div className="absolute -bottom-16 right-0 bg-blue-900 text-white rounded-xl p-4 w-[220px] shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Our Class Day</h3>
            <ul className="text-sm space-y-1">
              {["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"].map(
                (day) => (
                  <li
                    key={day}
                    className="flex justify-between border-b border-white/20 pb-1"
                  >
                    <span>{day}</span>
                    <span>10:00 - 16:00</span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-[50%]">
          <p className="text-green-600 font-semibold mb-2">📘 About Us</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-snug">
            Behind The Scenes: Discover The People <br /> & Passion Behind
          </h2>
          <p className="text-gray-600 mb-6">
            Meet the talented individuals who bring our vision to life every
            day. With a shared passion and commitment, our team works tirelessly
            to deliver exceptional quality and innovation.
          </p>

          {/* Features */}
          <div className="space-y-5">
            <div className="flex items-start gap-4 hover:bg-gray-50 p-3 rounded-xl transition">
              <BookOpen className="text-green-500 mt-1" size={24} />
              <div>
                <h4 className="font-bold text-lg">
                  It provides tools for course creation
                </h4>
                <p className="text-gray-600 text-sm">
                  Enrollment management and tracking learner progress, ensuring
                  an enhanced learning experience.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 hover:bg-gray-50 p-3 rounded-xl transition">
              <BarChart3 className="text-green-500 mt-1" size={24} />
              <div>
                <h4 className="font-bold text-lg">
                  An effective LMS offers robust analytics
                </h4>
                <p className="text-gray-600 text-sm">
                  Reporting features enable businesses to track learner
                  performance, completion rates, and engagement levels.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 hover:bg-gray-50 p-3 rounded-xl transition">
              <Users className="text-green-500 mt-1" size={24} />
              <div>
                <h4 className="font-bold text-lg">
                  Many LMS platforms include collaborative tools
                </h4>
                <p className="text-gray-600 text-sm">
                  Collaborative features such as discussion forums, messaging,
                  and group projects, which facilitate peer interaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
