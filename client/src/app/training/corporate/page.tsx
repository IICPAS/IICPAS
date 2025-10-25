import Header from "@/app/components/Header";
import React from "react";
import { Metadata } from "next";
import CorporateHero from "./CorporateHero";
import CorporateTrainingPanel from "./CorporateTrainingPanel";

export const metadata: Metadata = {
  title: "Corporate Training - IICPA Institute",
  description:
    "Enhance your workforce with our corporate training programs in accounting, finance, and taxation. Customized training solutions for businesses.",
  keywords:
    "corporate training, business training, accounting training, finance training, corporate education, workforce development",
  openGraph: {
    title: "Corporate Training - IICPA Institute",
    description:
      "Enhance your workforce with our corporate training programs in accounting, finance, and taxation. Customized training solutions for businesses.",
    url: "https://iicpa.in/training/corporate",
    siteName: "IICPA Institute",
    images: [
      {
        url: "https://iicpa.in/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Corporate Training - IICPA Institute",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Corporate Training - IICPA Institute",
    description:
      "Enhance your workforce with our corporate training programs in accounting, finance, and taxation. Customized training solutions for businesses.",
    images: ["https://iicpa.in/images/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const page = () => {
  return (
    <>
      <Header />
      <CorporateHero />
      <CorporateTrainingPanel />
    </>
  );
};

export default page;
