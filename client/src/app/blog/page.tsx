import React from "react";
import { Metadata } from "next";
import BlogSection from "../components/BlogsSection";
import BlogHero from "./BlogHero";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollbarController from "../components/ScrollbarController";

export const metadata: Metadata = {
  title: "Blog - IICPA Institute",
  description:
    "Read our latest articles on accounting, finance, taxation, and career guidance. Stay updated with industry insights and professional development tips.",
  keywords:
    "accounting blog, finance articles, taxation insights, career guidance, professional development, accounting news, finance tips",
  openGraph: {
    title: "Blog - IICPA Institute",
    description:
      "Read our latest articles on accounting, finance, taxation, and career guidance. Stay updated with industry insights and professional development tips.",
    url: "https://iicpa.in/blog",
    siteName: "IICPA Institute",
    images: [
      {
        url: "https://iicpa.in/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Blog - IICPA Institute",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - IICPA Institute",
    description:
      "Read our latest articles on accounting, finance, taxation, and career guidance. Stay updated with industry insights and professional development tips.",
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
      <ScrollbarController />
      <Header />
      <BlogHero />
      <BlogSection />
      <Footer />
    </div>
  );
};

export default page;
