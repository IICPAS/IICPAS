"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function GroupCourseCard({ groupPricing, index }) {
  const router = useRouter();

  const handleClick = () => {
    // Navigate to group package detail page
    router.push(`/group-package/${groupPricing._id}`);
  };

  return (
    <motion.div
      key={groupPricing._id || index}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out group cursor-pointer relative"
      onClick={handleClick}
    >
      {/* Banner Image Section */}
      <div className="relative h-48 w-full rounded-t-xl overflow-hidden">
        {groupPricing.image ? (
          <Image
            src={
              groupPricing.image.startsWith("http")
                ? groupPricing.image
                : groupPricing.image.startsWith("/uploads/")
                ? `${
                    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
                  }${groupPricing.image}`
                : groupPricing.image.startsWith("/")
                ? groupPricing.image
                : `${
                    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
                  }${groupPricing.image}`
            }
            alt={`${groupPricing.level} Group Package`}
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={index < 2}
            onError={(e) => {
              console.log("Group pricing image failed to load:", e);
              e.currentTarget.style.display = "none";
              const placeholder = e.currentTarget.nextElementSibling;
              if (placeholder) {
                placeholder.style.display = "flex";
              }
            }}
          />
        ) : null}

        {/* Fallback placeholder */}
        <div
          className={`w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-green-100 to-blue-100 ${
            groupPricing.image ? "hidden" : ""
          }`}
          style={{ display: groupPricing.image ? "none" : "flex" }}
        >
          <div className="text-center">
            <div className="text-4xl mb-2">📦</div>
            <div className="text-sm font-medium">Group Package</div>
          </div>
        </div>

        {/* Group Badge */}
        <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          {groupPricing.level}
        </div>

        {/* Course Count Badge */}
        <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          Courses: {groupPricing.courseIds?.length || 0}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-3">
        {/* Level */}
        <p className="text-sm text-gray-500 font-medium">Group Package</p>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
          {groupPricing.level} Course Package
        </h3>

        {/* Description */}
        {groupPricing.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {groupPricing.description}
          </p>
        )}

        {/* Course Count Display */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span className="font-medium">Courses:</span>
          <span>{groupPricing.courseIds?.length || 0}</span>
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-600 font-bold text-xl">
              ₹
              {groupPricing.groupPrice &&
              typeof groupPricing.groupPrice === "number"
                ? groupPricing.groupPrice.toLocaleString()
                : "0"}
            </p>
            <p className="text-gray-400 text-xs">Complete package price</p>
          </div>

          {/* Enroll Button */}
          <button
            className="bg-gray-900 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              // Navigate to group package detail page for enrollment
              router.push(`/group-package/${groupPricing._id}`);
            }}
          >
            Enroll Now →
          </button>
        </div>
      </div>
    </motion.div>
  );
}
