import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import React from "react";
import { Metadata } from "next";
import IndividualAuth from "./IndividualAuth";

export const metadata: Metadata = {
  title: "Practical Training - IICPA Institute",
  description:
    "Get hands-on practical training in accounting and finance with real-world applications. Build practical skills for career success.",
  keywords:
    "practical training, hands-on training, real-world applications, accounting practice, finance practice, skill development",
  openGraph: {
    title: "Practical Training - IICPA Institute",
    description:
      "Get hands-on practical training in accounting and finance with real-world applications. Build practical skills for career success.",
    url: "https://iicpa.in/training/practical",
    siteName: "IICPA Institute",
    images: [
      {
        url: "https://iicpa.in/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Practical Training - IICPA Institute",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Practical Training - IICPA Institute",
    description:
      "Get hands-on practical training in accounting and finance with real-world applications. Build practical skills for career success.",
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
      <IndividualAuth />
      <Footer />
    </div>
  );
};

export default page;
