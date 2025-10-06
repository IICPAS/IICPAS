"use client";

interface ThinHeroSectionProps {
  title: string;
  breadcrumb?: string;
}

// Static gradient styles without animations
const staticStyles = `
  .ribbon-static {
    background: linear-gradient(90deg, #3b82f6, #10b981);
  }
`;

export default function ThinHeroSection({
  title,
  breadcrumb,
}: ThinHeroSectionProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: staticStyles }} />
      <section className="relative pt-40 pb-10">
        {/* Ribbon-like container with < > edges */}
        <div className="relative w-[95vw] mx-auto px-4">
          <div
            className="relative py-3 px-3 md:px-3 text-center ribbon-static"
            style={{
              clipPath:
                "polygon(2% 0%, 98% 0%, 100% 50%, 98% 100%, 2% 100%, 0% 50%)",
            }}
          >
            {/* Content */}
            <div className="relative z-10 text-left pl-6">
              <h1 className="text-md md:text-xl font-bold text-white">
                {title}
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
