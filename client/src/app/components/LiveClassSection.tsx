"use client";

import Image from "next/image";
import { motion } from "framer-motion";
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
                className="bg-white/80 p-4 rounded-2xl shadow hover:shadow-xl transition group cursor-pointer border border-gray-100"
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
          className="relative hidden lg:block bg-white shadow-2xl rounded-[24px] overflow-hidden lg:ml-16 lg:mt-10 border border-green-300"
          initial={{ scale: 0.95, rotateY: -15, x: 100, opacity: 0 }}
          animate={{ 
            scale: 1, 
            rotateY: 0, 
            x: [100, 0, 20, 0, 100],
            opacity: 1
          }}
          whileHover={{ scale: 1.02, rotateY: 0 }}
          transition={{ 
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 0.2
          }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="relative w-[340px] sm:w-[400px] md:w-[460px] lg:w-[680px] aspect-video bg-gradient-to-br from-[#3cd664]/10 to-[#162955]/20">
            {/* Live Tag */}
            <div className="absolute top-3 left-3 bg-white text-red-600 text-xs px-3 py-1 rounded-full font-semibold shadow-md z-10">
              🔴 LIVE · 01:30:56
            </div>

            {/* Image with 3D and Animation */}
            <motion.div
              className="relative w-full h-full"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ 
                duration: 1.0, 
                ease: "easeOut",
                delay: 0.5
              }}
            >
              <Image
                src="/images/live-class.jpg"
                alt="Live Class Student"
                fill
                className="object-cover object-center rounded-lg"
                style={{ 
                  transform: "perspective(1000px) rotateX(3deg) rotateY(-3deg)",
                  transformStyle: "preserve-3d"
                }}
              />
              {/* 3D Shadow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#162955]/10 rounded-lg" />
            </motion.div>

            {/* Call Control Footer */}
            <div className="absolute bottom-0 w-full bg-[#3cd664] py-3 px-6 flex items-center justify-center gap-5 rounded-b-[24px] z-10">
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
