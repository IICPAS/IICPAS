import React from "react";
import { Metadata } from "next";
import Header from "@/app/components/Header";
import CompanyAuthPage from "./CompanyAuthPage";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Hire Talent - IICPA Institute",
  description:
    "Hire skilled accounting and finance professionals from IICPA Institute. Connect with qualified candidates for your business needs.",
  keywords:
    "hire talent, recruit accounting professionals, finance recruitment, talent acquisition, accounting candidates, finance professionals",
  openGraph: {
    title: "Hire Talent - IICPA Institute",
    description:
      "Hire skilled accounting and finance professionals from IICPA Institute. Connect with qualified candidates for your business needs.",
    url: "https://iicpa.in/placements/hire",
    siteName: "IICPA Institute",
    images: [
      {
        url: "https://iicpa.in/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Hire Talent - IICPA Institute",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hire Talent - IICPA Institute",
    description:
      "Hire skilled accounting and finance professionals from IICPA Institute. Connect with qualified candidates for your business needs.",
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
      <CompanyAuthPage />
      <Footer />
    </div>
  );
};

export default page;
