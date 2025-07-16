"use client";

import Image from "next/image";
import { BsStars } from "react-icons/bs";

const stats = [
  {
    img: "/images/student1.png",
    number: "120K+",
    label: "Successfully Student",
  },
  {
    img: "/images/review.png",
    number: "560K+",
    label: "Courses Completed",
  },
  {
    img: "/images/course.png",
    number: "3M+",
    label: "Satisfied Review",
  },
  {
    img: "/images/suces.png",
    number: "120K+",
    label: "Successfully Student",
  },
];

export default function YellowStatsStrip() {
  return (
    <section className="bg-yellow-400 w-full py-6 md:py-12 transform -skew-y-3">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-wrap justify-center items-center skew-y-3 gap-4 md:gap-8">
        {stats.map((item, index) => (
          <div key={index} className="flex items-center gap-4 md:gap-6">
            {/* Stat Box */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl text-white p-4 md:p-6 text-center shadow-lg hover:scale-105 transition-all duration-300 w-[160px] md:w-[200px]">
              <div className="w-16 h-16 mx-auto mb-3 p-2 rounded-full overflow-hidden border-2 border-white">
                <Image
                  src={item.img}
                  alt={item.label}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <div className="text-2xl md:text-3xl font-bold">
                {item.number}
              </div>
              <div className="text-sm mt-1">{item.label}</div>
            </div>

            {/* Star Icon Separator */}
            {index !== stats.length - 1 && (
              <BsStars className="text-white text-3xl md:text-4xl animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
