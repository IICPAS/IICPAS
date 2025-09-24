"use client";

import Link from "next/link";

export default function TestFooterLinks() {
  const testLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Refund Policy", href: "/refund" },
    { name: "Return Policy", href: "/return" },
    { name: "About Us", href: "/about" },
    { name: "Courses", href: "/courses" },
    { name: "Blog", href: "/blog" },
    { name: "Contact Us", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Help Center", href: "/help" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Footer Links Test
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Test Footer Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {testLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 text-blue-600 hover:text-blue-800"
                onClick={() => console.log("Test link clicked:", link.href)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-600">
              Click on any link above to test if it works. Check the browser
              console for click events.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
