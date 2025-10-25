"use client";

import React from "react";
import { Metadata } from "next";
import GSTR3BSimulation from "../../components/GSTR3BSimulation";

export const metadata: Metadata = {
  title: "GSTR-3B Simulation - IICPA Institute",
  description:
    "Master GSTR-3B monthly return filing with our interactive simulation. Learn tax liability, ITC, and GST payment procedures.",
  keywords:
    "GSTR-3B simulation, GST monthly return, tax liability, ITC, GST payment, GST return filing, GST compliance",
  openGraph: {
    title: "GSTR-3B Simulation - IICPA Institute",
    description:
      "Master GSTR-3B monthly return filing with our interactive simulation. Learn tax liability, ITC, and GST payment procedures.",
    url: "https://iicpa.in/gst-simulations/gstr-3b",
    siteName: "IICPA Institute",
    images: [
      {
        url: "https://iicpa.in/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "GSTR-3B Simulation - IICPA Institute",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GSTR-3B Simulation - IICPA Institute",
    description:
      "Master GSTR-3B monthly return filing with our interactive simulation. Learn tax liability, ITC, and GST payment procedures.",
    images: ["https://iicpa.in/images/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function GSTR3BPage() {
  return (
    <div>
      <GSTR3BSimulation />
    </div>
  );
}
