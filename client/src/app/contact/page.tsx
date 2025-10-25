import React from "react";
import { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactHero from "./ContactHero";
import ContactBoxes from "./ContactBoxes";
import ContactSection from "./ContactSection";
import ContactMap from "./ContactMap";
import NewsletterSection from "../components/Newsletter";

export const metadata: Metadata = {
  title: "Contact IICPA Institute - Get in Touch with Us",
  description:
    "Contact IICPA Institute for course inquiries, admissions, and support. Reach out to our team for guidance on accounting and finance courses.",
  keywords:
    "contact IICPA, course inquiry, admissions, support, accounting courses, finance training, get in touch",
  openGraph: {
    title: "Contact IICPA Institute - Get in Touch with Us",
    description:
      "Contact IICPA Institute for course inquiries, admissions, and support.",
    url: "https://iicpa.in/contact",
    siteName: "IICPA Institute",
    images: [
      {
        url: "https://iicpa.in/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Contact IICPA Institute",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact IICPA Institute - Get in Touch with Us",
    description:
      "Contact IICPA Institute for course inquiries, admissions, and support.",
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
      <ContactHero />
      <ContactBoxes />
      <ContactSection />
      <ContactMap />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default page;
