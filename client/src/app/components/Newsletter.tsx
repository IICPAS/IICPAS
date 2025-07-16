"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function NewsletterSection() {
  return (
    <section className="relative bg-[#3cd664]/90 rounded-[32px] mx-4 md:mx-20 mt-12 py-12 px-6 md:px-16 overflow-hidden shadow-2xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 z-10 relative">
        {/* Text + Form */}
        <div className="w-full md:w-1/2 text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
            Subscribe our <span className="italic font-medium">Newsletter</span>
          </h2>
          <p className="mt-4 text-sm md:text-base opacity-90">
            Explore a diverse selection of courses all in one platform, designed
            to cater to various learning
          </p>

          {/* Combined Input & Button */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-6 w-full sm:w-[420px] relative"
          >
            <input
              type="email"
              required
              placeholder="Enter Your Email"
              className="bg-white w-full px-6 py-4 pr-32 rounded-full text-gray-800 placeholder:text-gray-400 focus:outline-none shadow-md"
            />
            <button
              type="submit"
              className="absolute top-1 right-1 bottom-1 bg-[#162955] hover:bg-[#1a2e66] text-white text-sm px-6 rounded-full font-semibold flex items-center justify-center shadow transition-all"
            >
              <svg
                className="w-4 h-4 fill-current mr-2"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2.94 6.94a1.5 1.5 0 0 1 2.12 0L10 11.88l4.94-4.94a1.5 1.5 0 0 1 2.12 2.12l-6 6a1.5 1.5 0 0 1-2.12 0l-6-6a1.5 1.5 0 0 1 0-2.12z" />
              </svg>
              Subscribe
            </button>
          </form>
        </div>

        {/* Image - Desktop only */}
        <motion.div
          className="hidden md:flex md:w-1/2 justify-end md:pr-8 mt-10 md:mt-0"
          animate={{ x: [0, 15, -5, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        >
          <Image
            src="/images/student.png"
            alt="Newsletter Girl"
            width={520}
            height={520}
            className="object-contain"
          />
        </motion.div>
      </div>

      {/* Floating Emoji */}
      <motion.div
        className="hidden md:block absolute bottom-4 right-[70vmin] text-white text-5xl -rotate-12"
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        👍
      </motion.div>
    </section>
  );
}
