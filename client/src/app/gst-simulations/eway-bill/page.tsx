"use client";

import React from "react";
import { Metadata } from "next";
import EWayBillSimulation from "../../components/EWayBillSimulation";

export const metadata: Metadata = {
  title: "E-Way Bill Simulation - IICPA Institute",
  description:
    "Master e-way bill generation with our interactive simulation. Learn transportation documentation, distance calculation, and e-way bill compliance.",
  keywords:
    "e-way bill simulation, e-way bill training, transportation documentation, GST e-way bill, logistics compliance",
  openGraph: {
    title: "E-Way Bill Simulation - IICPA Institute",
    description:
      "Master e-way bill generation with our interactive simulation. Learn transportation documentation, distance calculation, and e-way bill compliance.",
    url: "https://iicpa.in/gst-simulations/eway-bill",
    siteName: "IICPA Institute",
    images: [
      {
        url: "https://iicpa.in/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "E-Way Bill Simulation - IICPA Institute",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Way Bill Simulation - IICPA Institute",
    description:
      "Master e-way bill generation with our interactive simulation. Learn transportation documentation, distance calculation, and e-way bill compliance.",
    images: ["https://iicpa.in/images/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EWayBillPage() {
  return (
    <div>
      <EWayBillSimulation />
    </div>
  );
}
