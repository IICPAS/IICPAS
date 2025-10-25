"use client";

import React from "react";
import { Metadata } from "next";
import EInvoiceSimulation from "../../components/EInvoiceSimulation";

export const metadata: Metadata = {
  title: "E-Invoice Simulation - IICPA Institute",
  description:
    "Learn e-invoice generation with our interactive simulation. Master IRN creation, QR codes, and e-invoice compliance procedures.",
  keywords:
    "e-invoice simulation, IRN generation, e-invoice training, GST e-invoice, invoice compliance, digital invoice",
  openGraph: {
    title: "E-Invoice Simulation - IICPA Institute",
    description:
      "Learn e-invoice generation with our interactive simulation. Master IRN creation, QR codes, and e-invoice compliance procedures.",
    url: "https://iicpa.in/gst-simulations/einvoice",
    siteName: "IICPA Institute",
    images: [
      {
        url: "https://iicpa.in/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "E-Invoice Simulation - IICPA Institute",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Invoice Simulation - IICPA Institute",
    description:
      "Learn e-invoice generation with our interactive simulation. Master IRN creation, QR codes, and e-invoice compliance procedures.",
    images: ["https://iicpa.in/images/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EInvoicePage() {
  return (
    <div>
      <EInvoiceSimulation />
    </div>
  );
}
