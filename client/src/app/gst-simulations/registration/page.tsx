"use client";

import React from "react";
import { Metadata } from "next";
import GSTRegistrationSimulation from "../../components/GSTRegistrationSimulation";

export const metadata: Metadata = {
  title: "GST Registration Simulation - IICPA Institute",
  description:
    "Learn GST registration process with our interactive simulation. Master business details, document upload, and GSTIN generation procedures.",
  keywords:
    "GST registration simulation, GST registration training, GSTIN generation, business registration, GST compliance, registration process",
  openGraph: {
    title: "GST Registration Simulation - IICPA Institute",
    description:
      "Learn GST registration process with our interactive simulation. Master business details, document upload, and GSTIN generation procedures.",
    url: "https://iicpa.in/gst-simulations/registration",
    siteName: "IICPA Institute",
    images: [
      {
        url: "https://iicpa.in/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "GST Registration Simulation - IICPA Institute",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GST Registration Simulation - IICPA Institute",
    description:
      "Learn GST registration process with our interactive simulation. Master business details, document upload, and GSTIN generation procedures.",
    images: ["https://iicpa.in/images/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function GSTRegistrationPage() {
  return (
    <div>
      <GSTRegistrationSimulation />
    </div>
  );
}
