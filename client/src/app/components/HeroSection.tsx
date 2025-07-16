"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function HeroSection() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-screen bg-gradient-to-br from-[#f5fcfa] via-white to-[#eef7fc] text-gray-800 flex flex-col md:flex-row items-center justify-between px-4 md:px-20 pt-8 pb-16">
      {/* ✅ Mobile Top Hero Image */}
      <div className="relative block lg:hidden w-full mb-10 mt-28">
        <Image
          src="/images/young-woman.jpg"
          alt="Mobile Hero"
          width={600}
          height={300}
          className="w-full h-auto object-cover rounded-xl shadow-lg"
        />

        {/* ✅ Floating Course Badge */}
        <div className="absolute top-4 right-4 bg-white rounded-xl px-4 py-2 text-center shadow-xl z-10">
          <p className="text-xs text-gray-600 font-medium">Courses</p>
          <p className="text-xl font-bold text-green-600">120+</p>
        </div>

        {/* ✅ Scroll Down Arrow */}
        <div className="hidden md:block absolute -bottom-5 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce text-green-600 text-2xl">↓</div>
        </div>
      </div>

      {/* ✅ Green Cursor (Desktop only) */}
      <div
        ref={cursorRef}
        className="hidden md:block custom-cursor pointer-events-none fixed top-0 left-0 z-[100] w-6 h-6 border-2 border-green-500 rounded-full transition-transform duration-75"
        style={{ transform: "translate(-50%, -50%)" }}
      ></div>

      {/* ✅ Green Animated Play Button (Desktop Only) */}
      <div className="block absolute top-[88%] left-[80%] md:left-[40%] md:top-[52%] z-10 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-green-500 animate-ping-slow bg-green-100 opacity-50"></div>
          <div className="relative w-full h-full bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-white ml-1" />
          </div>
        </div>
      </div>

      {/* ✅ Floating Book Icon */}
      <Image
        src="/images/book-icon.png"
        alt="Floating Book"
        width={36}
        height={36}
        className="absolute top-24 right-10 animate-bounce z-0"
      />

      {/* ✅ Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-purple-200 rounded-full blur-3xl opacity-30 animate-pulse z-0" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-green-200 rounded-full blur-3xl opacity-30 animate-pulse z-0" />

      {/* ✅ Text Content */}
      <div className="w-full md:w-1/2 z-10 text-center md:text-left">
        <h3 className="text-green-600 font-semibold text-lg mb-2">
          # Best Online Platform
        </h3>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.3]">
          Start Learning <span className="text-yellow-500">Today</span>
          <br />
          <span className="text-yellow-400">Discover</span> Your Next
          <br />
          <span className="text-blue-900">Great Skill</span>
        </h1>
        <p className="text-gray-500 mt-6 text-lg px-2 sm:px-8 md:px-0">
          Enhance your educational journey with our cutting-edge course
          platform.
        </p>
        <button className="mt-8 mr-12 px-6 py-3 md:px-6 md:py-3 bg-green-500 hover:bg-green-600 text-white rounded-full text-lg font-semibold shadow-md transition">
          Get Started &raquo;
        </button>
      </div>

      {/* ✅ Image Grid for Desktop */}
      <div className="hidden lg:flex flex-col mt-20 md:flex-row items-center gap-6 w-1/2 justify-end z-10">
        <div className="flex flex-col gap-6">
          <Image
            src="/images/vr-student.jpg"
            alt="VR Student"
            width={250}
            height={300}
            className="rounded-2xl object-cover shadow-lg"
          />
          <div className="bg-white p-3 rounded-xl shadow-md w-64 hover:shadow-lg transition">
            <p className="text-sm font-semibold text-yellow-500 mb-1">5% Off</p>
            <Image
              src="/images/sofa.jpg"
              alt="Course"
              width={240}
              height={140}
              className="rounded-lg object-cover"
            />
            <div className="mt-2">
              <p className="text-sm font-semibold">
                Basic Accounting & Tally Foundation
              </p>
              <p className="text-sm text-gray-600">₹4,750</p>
              <p className="text-yellow-400 text-sm">★★★★☆</p>
            </div>
          </div>
        </div>
        <Image
          src="/images/young-woman1.jpg"
          alt="Girl with book"
          width={350}
          height={400}
          className="rounded-2xl object-cover shadow-lg"
        />
      </div>
    </section>
  );
}
