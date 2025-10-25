import React from "react";
import { Metadata } from "next";
import Header from "../components/Header";
import AboutPeoplePassion from "./component/AboutPeoplePassion";
import TestimonialCarousel from "../components/TestimonialSection";
import NewsletterSection from "../components/Newsletter";
import ContactSection from "../components/ContactSection";
import AboutHero from "./component/AboutHero";
import Footer from "../components/Footer";
import ScrollbarController from "../components/ScrollbarController";

export const metadata: Metadata = {
  title: "About IICPA Institute - Leading Accounting Education Provider",
  description:
    "Learn about IICPA's mission, vision, and commitment to excellence in accounting and finance education. Discover our journey in shaping future professionals.",
  keywords:
    "about IICPA, accounting education, finance institute, mission vision, accounting training, professional development",
  openGraph: {
    title: "About IICPA Institute - Leading Accounting Education Provider",
    description:
      "Learn about IICPA's mission, vision, and commitment to excellence in accounting and finance education.",
    url: "https://iicpa.in/about",
    siteName: "IICPA Institute",
    images: [
      {
        url: "https://iicpa.in/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "About IICPA Institute",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About IICPA Institute - Leading Accounting Education Provider",
    description:
      "Learn about IICPA's mission, vision, and commitment to excellence in accounting and finance education.",
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
      <div className="pt-10">
        <AboutHero />
      </div>
      <AboutPeoplePassion />
      <TestimonialCarousel />
      <NewsletterSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default page;
