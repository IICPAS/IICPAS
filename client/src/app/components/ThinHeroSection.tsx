"use client";

interface ThinHeroSectionProps {
  title: string;
  breadcrumb?: string;
}

// Add shimmer animation styles
const shimmerStyles = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

export default function ThinHeroSection({
  title,
  breadcrumb,
}: ThinHeroSectionProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: shimmerStyles }} />
      <section className="relative pt-40 pb-10">
        {/* Ribbon-like container with < > edges */}
        <div className="relative w-[95vw] mx-auto px-4">
          <div
            className="relative bg-blue-600 py-3 px-3 md:px-3 text-center"
            style={{
              clipPath:
                "polygon(2% 0%, 98% 0%, 100% 50%, 98% 100%, 2% 100%, 0% 50%)",
            }}
          >
            {/* Content */}
            <div className="relative z-10 text-left pl-6">
              <h1 className="text-md md:text-xl font-bold text-white relative">
                {/* 4D Effect with multiple shadows */}
                <span
                  className="relative z-10"
                  style={{
                    textShadow: `
                    1px 1px 0px rgba(0,0,0,0.3),
                    2px 2px 0px rgba(0,0,0,0.2),
                    3px 3px 0px rgba(0,0,0,0.1),
                    4px 4px 8px rgba(0,0,0,0.4)
                  `,
                  }}
                >
                  {title}
                </span>

                {/* Shining effect overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"
                  style={{
                    animation: "shimmer 2s infinite",
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                    backgroundSize: "200% 100%",
                  }}
                ></div>
              </h1>
              {breadcrumb && (
                <p className="mt-1 text-sm text-white/90 font-medium">
                  {breadcrumb}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
