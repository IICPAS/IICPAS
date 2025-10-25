"use client";

import React from "react";
import { Metadata } from "next";
import GSTR1ASimulation from "../../components/GSTR1ASimulation";

export const metadata: Metadata = {
  title: "GSTR-1A Simulation - IICPA Institute",
  description:
    "Learn GSTR-1A return filing with our interactive simulation. Master amendment of outward supplies and GST return procedures.",
  keywords:
    "GSTR-1A simulation, GST return filing, outward supplies, GST amendment, GST training, return filing simulation",
  openGraph: {
    title: "GSTR-1A Simulation - IICPA Institute",
    description:
      "Learn GSTR-1A return filing with our interactive simulation. Master amendment of outward supplies and GST return procedures.",
    url: "https://iicpa.in/gst-simulations/gstr-1a",
    siteName: "IICPA Institute",
    images: [
      {
        url: "https://iicpa.in/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "GSTR-1A Simulation - IICPA Institute",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GSTR-1A Simulation - IICPA Institute",
    description:
      "Learn GSTR-1A return filing with our interactive simulation. Master amendment of outward supplies and GST return procedures.",
    images: ["https://iicpa.in/images/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function GSTR1APage() {
  return (
    <div>
      <GSTR1ASimulation />
    </div>
  );
}
