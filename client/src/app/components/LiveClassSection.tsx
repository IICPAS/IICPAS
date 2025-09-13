"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect } from "react";
import {
  VideoIcon,
  PhoneIcon,
  VideoOffIcon,
  MicOffIcon,
  MoreHorizontal,
} from "lucide-react";

const classes = [
  {
    title: "Master Python Programming for Beginners and Beyond",
    lessons: 45,
    duration: "620h 55min",
  },
  {
    title: "Meet the Team: Passionate People, Exceptional Talent",
    lessons: 45,
    duration: "620h 55min",
  },
  {
    title: "The Faces Behind the Brand, Dedicated, Driven",
    lessons: 45,
    duration: "620h 55min",
  },
];

export default function LiveClassSection() {
  // Add custom 3D left-right animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes leftRight3D {
        0%, 100% { 
          transform: translateX(0px) rotateY(0deg); 
        }
        50% { 
          transform: translateX(15px) rotateY(3deg); 
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Side */}
        <div className="w-full lg:w-1/2">
          <p className="text-green-600 font-semibold text-lg flex items-center gap-2">
            🎓 Join Live
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-2 leading-tight text-gray-900">
            Join Our Live Class, <br /> Start Your Online{" "}
            <span className="text-white bg-[#162955] px-4 py-1 rounded-full">
              Journey
            </span>
          </h2>

          <div className="mt-8 space-y-6">
            {classes.map((cls, idx) => (
              <div
                key={idx}
                className="bg-white/80 p-4 rounded-2xl shadow hover:shadow-xl transition group cursor-pointer"
                style={{
                  border: '2px solid transparent',
                  background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #3cd664, #162955) border-box',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.08), 0 0 0 1px rgba(60, 214, 100, 0.1), inset 0 1px 0 rgba(255,255,255,0.9)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white">
                    <VideoIcon size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {cls.lessons} Lesson · {cls.duration}
                    </p>
                    <h3 className="font-semibold text-base group-hover:text-[#162955] transition">
                      {cls.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Live Class UI */}
        <motion.div
          className="relative hidden lg:block bg-white shadow-2xl rounded-[24px] overflow-hidden lg:ml-16 lg:mt-10"
          initial={{ scale: 0.95 }}
          whileHover={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1000px',
            animation: 'leftRight3D 4s ease-in-out infinite',
            border: '3px solid transparent',
            background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #3cd664, #162955, #3cd664) border-box',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(60, 214, 100, 0.2), inset 0 1px 0 rgba(255,255,255,0.8)'
          }}
        >
          <div className="relative w-[340px] sm:w-[400px] md:w-[460px] lg:w-[680px]  aspect-video bg-black">
            {/* Live Tag */}
            <div className="absolute top-3 left-3 bg-white text-red-600 text-xs px-3 py-1 rounded-full font-semibold shadow-md">
              🔴 LIVE · 01:30:56
            </div>

            {/* Image */}
            <Image
              src="/images/live-class.jpg"
              alt="Live Class Student"
              fill
              className="object-cover object-center "
            />

            {/* Call Control Footer */}
            <div className="absolute bottom-0 w-full bg-[#3cd664] py-3 px-6 flex items-center justify-center gap-5 rounded-b-[24px]">
              <MoreHorizontal className="text-white hover:scale-110 transition cursor-pointer" />
              <PhoneIcon className="text-white hover:scale-110 transition cursor-pointer" />
              <VideoOffIcon className="text-white hover:scale-110 transition cursor-pointer" />
              <MicOffIcon className="text-white hover:scale-110 transition cursor-pointer" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
