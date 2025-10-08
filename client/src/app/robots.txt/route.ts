import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://iicpa.in";

  const robotsTxt = `User-agent: *
Allow: /

# Disallow admin and dashboard pages
Disallow: /admin/
Disallow: /admin-dashboard/
Disallow: /center-dashboard/
Disallow: /college-dashboard/
Disallow: /company-dashboard/
Disallow: /personal-dashboard/
Disallow: /student-dashboard/
Disallow: /teacher-dashboard/
Disallow: /team-dashboard/

# Disallow API routes
Disallow: /api/

# Disallow test pages
Disallow: /test/
Disallow: /test-editor/
Disallow: /test-footer-links/

# Disallow private pages
Disallow: /profile/
Disallow: /wishlist/

# Allow important pages
Allow: /course/
Allow: /courses/
Allow: /blog/
Allow: /blogs/
Allow: /about/
Allow: /contact/
Allow: /faq/
Allow: /placements/
Allow: /resources/
Allow: /training/
Allow: /jobs/

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400, s-maxage=86400", // Cache for 24 hours
    },
  });
}
