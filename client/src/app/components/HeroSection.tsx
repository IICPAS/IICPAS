"use client";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/videos/homehero.gif"
          alt="Hero Background - Classroom Scene"
          className="w-full h-full object-cover"
        />
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Text Content Overlay */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 text-center">
          {/* Small green text */}
          <h3 className="text-green-400 font-bold text-lg mb-6 drop-shadow-lg">
            # Best Online Platform
          </h3>
          
          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 drop-shadow-2xl">
            <span className="text-white">Start Learning </span>
            <span className="text-green-400">Today</span>
            <br />
            <span className="text-green-400">Discover</span> <span className="text-white">Your Next</span>
            <br />
            <span className="text-blue-300">Great Skill</span>
          </h1>
          
          {/* Description */}
          <p className="text-white/90 text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
            Enhance your educational journey with our cutting-edge course platform.
          </p>
          
          {/* CTA Button */}
          <button className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-full text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105">
            Get Started »
          </button>
        </div>
      </div>
    </section>
  );
}
