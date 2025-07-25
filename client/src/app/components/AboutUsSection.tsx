"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

export default function AboutUsSection() {
  const [aboutContent, setAboutContent] = useState("");

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/about`
        );
        if (res.data.length > 0) {
          setAboutContent(res.data[0].content); // assume single entry
        }
      } catch (error) {
        console.error("Failed to fetch About Us content", error);
      }
    };

    fetchAbout();
  }, []);

  return (
    <section className="bg-white py-16 px-6 md:px-20 text-gray-800">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Side */}
        <div className="relative w-full md:w-[45%]">
          <Image
            src="/images/about.jpeg"
            alt="Student"
            width={500}
            height={500}
            className="rounded-3xl shadow-2xl"
          />

          {/* Testimonial */}
          <div className="mt-10 lg:mt-0 absolute -top-20 lg:top-4 left-4 bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 max-w-[250px]">
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
          <div className="absolute -bottom-35 lg:-bottom-16 right-0 bg-blue-900 text-white rounded-xl p-4 w-[220px] shadow-lg">
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
        <div className="w-full md:w-[50%] mt-20">
          <p className="text-green-600 font-semibold mb-2 text-2xl mb-8">
            📘 About Us
          </p>
          {aboutContent ? (
            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: aboutContent }}
            />
          ) : (
            <p className="text-gray-500">Loading content...</p>
          )}
        </div>
      </div>
    </section>
  );
}
