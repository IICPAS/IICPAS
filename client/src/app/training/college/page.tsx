import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import React from "react";
import { Metadata } from "next";
import TrainingHero from "./TrainingHero";
import CollegeTrainingPanel from "./CollegeTrainingPanel";

export const metadata: Metadata = {
  title: "College Training Programs - IICPA Institute",
  description:
    "Partner with IICPA for college training programs in accounting and finance. Enhance student skills with industry-relevant training.",
  keywords:
    "college training, university programs, student training, academic partnership, accounting education, finance education",
  openGraph: {
    title: "College Training Programs - IICPA Institute",
    description:
      "Partner with IICPA for college training programs in accounting and finance. Enhance student skills with industry-relevant training.",
    url: "https://iicpa.in/training/college",
    siteName: "IICPA Institute",
    images: [
      {
        url: "https://iicpa.in/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "College Training Programs - IICPA Institute",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "College Training Programs - IICPA Institute",
    description:
      "Partner with IICPA for college training programs in accounting and finance. Enhance student skills with industry-relevant training.",
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
      <TrainingHero />
      <CollegeTrainingPanel />
    </>
  );
};

export default page;
