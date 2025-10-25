import React from "react";
import { Metadata } from "next";
import Header from "../components/Header";
import StudentRegister from "../components/StudentRegister";

export const metadata: Metadata = {
  title: "Student Registration - IICPA Institute",
  description:
    "Join IICPA Institute and start your journey in accounting and finance. Register now to access our courses, simulations, and learning resources.",
  keywords:
    "student registration, join IICPA, accounting courses, finance training, student signup, course enrollment",
  openGraph: {
    title: "Student Registration - IICPA Institute",
    description:
      "Join IICPA Institute and start your journey in accounting and finance. Register now to access our courses, simulations, and learning resources.",
    url: "https://iicpa.in/register",
    siteName: "IICPA Institute",
    images: [
      {
        url: "https://iicpa.in/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Student Registration - IICPA Institute",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Registration - IICPA Institute",
    description:
      "Join IICPA Institute and start your journey in accounting and finance. Register now to access our courses, simulations, and learning resources.",
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
      <StudentRegister />
    </div>
  );
};

export default page;
