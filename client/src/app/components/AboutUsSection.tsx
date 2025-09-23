"use client";

import { useState, useEffect } from "react";

export default function AboutUsSection() {
  const [aboutData, setAboutData] = useState({
    title: "About Us",
    content:
      "Welcome to IICPA Institute, where excellence in education meets innovation in learning. We are committed to providing world-class education that transforms careers and empowers individuals to achieve their professional goals. Our comprehensive curriculum, expert instructors, and industry-aligned programs ensure you receive the best learning experience.",
    mainImage: "/images/about.jpeg",
    video: {
      type: "file",
      url: "/videos/aboutus.mp4",
      poster: "/images/video-poster.jpg",
      autoplay: true,
      loop: true,
      muted: true,
    },
    button: {
      text: "Learn More About Us",
      link: "/about",
    },
    colors: {
      title: "text-green-600",
      content: "text-gray-700",
      background: "bg-white",
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const API_BASE =
          process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
        const response = await fetch(`${API_BASE}/about`);

        if (response.ok) {
          const data = await response.json();
          console.log("About data fetched:", data);
          setAboutData(data);
        } else {
          console.error("Failed to fetch about data");
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <section className="relative bg-white py-16 px-4 md:px-8 lg:px-12 xl:px-16 text-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative ${aboutData.colors.background} py-16 px-4 md:px-8 lg:px-12 xl:px-16 text-gray-800 overflow-hidden`}
    >
      {/* Lightweight Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-green-100/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-green-100/20 to-blue-100/20 rounded-full blur-3xl animate-float-reverse"></div>
      </div>

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Side - Video Section */}
          <div className="relative w-full lg:w-[45%] animate-fade-in-left">
            <div className="relative">
              {/* Video Section */}
              <video
                className="rounded-3xl shadow-2xl w-full h-auto border border-gray-200/50 hover:shadow-3xl transition-shadow duration-500"
                autoPlay={aboutData.video?.autoplay || true}
                loop={aboutData.video?.loop || true}
                muted={aboutData.video?.muted !== false}
                playsInline
                preload="metadata"
                controls={false}
                poster={aboutData.video?.poster || "/images/video-poster.jpg"}
                onError={(e) => {
                  console.error("Video error:", e);
                  console.error("Video src:", e.target.src);
                }}
                onLoadStart={() => console.log("Video loading started")}
                onCanPlay={() => console.log("Video can play")}
                onLoadedData={() => console.log("Video data loaded")}
              >
                <source
                  src={aboutData.video?.url || "/videos/aboutus.mp4"}
                  type="video/mp4"
                />
                <source src="/videos/homehero.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Right Side - Optimized Content */}
          <div className="w-full lg:w-[50%] mt-20 lg:mt-0 animate-fade-in-right">
            {/* Optimized Section Header */}
            <div className="flex items-center gap-4 mb-8 animate-fade-in-up animation-delay-100">
              <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
              <p
                className={`${aboutData.colors.title} font-bold text-2xl uppercase tracking-wider`}
              >
                {aboutData.title}
              </p>
            </div>

            {/* Content with Optimized Styling */}
            <div className="animate-fade-in-up animation-delay-200">
              <div
                className={`prose prose-lg max-w-none ${aboutData.colors.content} leading-relaxed`}
                dangerouslySetInnerHTML={{
                  __html: aboutData.content.replace(
                    /<p>/g,
                    `<p class="mb-4 ${aboutData.colors.content} leading-relaxed">`
                  ),
                }}
              />
            </div>

            {/* Optimized CTA Button */}
            <div className="mt-8 animate-fade-in-up animation-delay-300">
              <button
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-full font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                onClick={() => (window.location.href = aboutData.button.link)}
              >
                {aboutData.button.text}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes floatSlow {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-15px) translateX(8px);
          }
        }

        @keyframes floatReverse {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(15px) translateX(-8px);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-right {
          animation: fadeInRight 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-float-slow {
          animation: floatSlow 6s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: floatReverse 8s ease-in-out infinite;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </section>
  );
}
