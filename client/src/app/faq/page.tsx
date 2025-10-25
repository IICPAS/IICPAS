import React from "react";
import { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FAQHero from "./FAQHero";
import FAQSection from "./FAQSection";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions - IICPA Institute",
  description:
    "Find answers to common questions about IICPA Institute courses, admissions, fees, and learning programs. Get help with your queries.",
  keywords:
    "FAQ, frequently asked questions, IICPA help, course questions, admission queries, learning support, student help",
  openGraph: {
    title: "FAQ - Frequently Asked Questions - IICPA Institute",
    description:
      "Find answers to common questions about IICPA Institute courses, admissions, fees, and learning programs. Get help with your queries.",
    url: "https://iicpa.in/faq",
    siteName: "IICPA Institute",
    images: [
      {
        url: "https://iicpa.in/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "FAQ - IICPA Institute",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ - Frequently Asked Questions - IICPA Institute",
    description:
      "Find answers to common questions about IICPA Institute courses, admissions, fees, and learning programs. Get help with your queries.",
    images: ["https://iicpa.in/images/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const page = () => {
  return (
    <div>
      <Header />
      <FAQHero />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default page;
