"use client";

import { useEffect, useRef } from "react";

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
    <section className="relative overflow-hidden min-h-screen bg-gradient-to-br from-[#f5fcfa] via-white to-[#eef7fc] text-gray-800">
      {/* Main Container with zoom responsiveness */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 min-h-screen flex flex-col md:flex-row items-center justify-between pt-2 pb-4 md:pt-1 md:pb-2 lg:pt-8 lg:pb-16">
        {/* ✅ Mobile/Tablet Hero Content */}
        <div className="relative block lg:hidden w-full mt-20 sm:mt-24 md:mt-16">
          {/* ✅ Mobile/Tablet GIF */}
          <div className="relative w-full">
            <img
              src="/videos/homehero.gif"
              alt="Hero Animation"
              className="rounded-2xl shadow-2xl w-full mx-auto h-[250px] md:h-[450px]"
              style={{
                maxWidth: '100%',
                objectFit: 'cover'
              }}
            />
            
            {/* ✅ Floating Course Badge */}
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white rounded-xl px-3 sm:px-4 py-2 text-center shadow-xl z-10">
              <p className="text-xs text-gray-600 font-medium">Courses</p>
              <p className="text-lg sm:text-xl font-bold text-green-600">120+</p>
            </div>
          </div>

          {/* ✅ Text Content - Below Video */}
          <div className="w-full z-10 text-center px-4 mt-6">
            <h3 className="text-green-600 font-semibold text-sm sm:text-base md:text-lg mb-2">
              # Best Online Platform
            </h3>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-[1.2] sm:leading-[1.3]">
              Start Learning <span className="text-yellow-500">Today</span>
              <br />
              <span className="text-yellow-400">Discover</span> Your Next
              <br />
              <span className="text-blue-900">Great Skill</span>
            </h1>
            <p className="text-gray-500 mt-4 sm:mt-6 text-sm sm:text-base md:text-lg px-2 sm:px-4">
              Enhance your educational journey with our cutting-edge course
              platform.
            </p>
            <button className="mt-6 sm:mt-8 px-4 sm:px-6 py-2 sm:py-3 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm sm:text-base md:text-lg font-semibold shadow-md transition w-full sm:w-auto">
              Get Started &raquo;
            </button>
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



        {/* ✅ Decorative Blobs */}
        <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-purple-200 rounded-full blur-3xl opacity-30 animate-pulse z-0" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-green-200 rounded-full blur-3xl opacity-30 animate-pulse z-0" />

        {/* ✅ Desktop Text Content */}
        <div className="hidden lg:block w-1/2 z-10 text-left px-4 lg:px-0">
          <h3 className="text-green-600 font-semibold text-lg mb-2">
            # Best Online Platform
          </h3>
          <h1 className="text-5xl font-bold leading-[1.3]">
            Start Learning <span className="text-yellow-500">Today</span>
            <br />
            <span className="text-yellow-400">Discover</span> Your Next
            <br />
            <span className="text-blue-900">Great Skill</span>
          </h1>
          <p className="text-gray-500 mt-6 text-lg">
            Enhance your educational journey with our cutting-edge course
            platform.
          </p>
          <button className="mt-8 mr-12 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full text-lg font-semibold shadow-md transition">
            Get Started &raquo;
          </button>
        </div>

        {/* ✅ Right Side Animated Video - Desktop Only */}
        <div className="hidden lg:flex w-1/2 justify-center items-center z-10 mt-8 lg:mt-20">
          <div className="relative">
            <img
              src="/videos/homehero.gif"
              alt="Hero Animation"
              className="rounded-2xl shadow-2xl"
              style={{
                width: '450px',
                height: '450px',
                objectFit: 'cover'
              }}
            />
            
            {/* ✅ Floating Elements */}
            <div className="absolute -top-2 lg:-top-4 -right-2 lg:-right-4 w-6 h-6 lg:w-8 lg:h-8 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
            <div className="absolute -bottom-2 lg:-bottom-4 -left-2 lg:-left-4 w-4 h-4 lg:w-6 lg:h-6 bg-green-400 rounded-full animate-bounce"></div>
          </div>
        </div>

      </div>
    </section>
  );
}
