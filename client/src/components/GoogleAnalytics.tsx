"use client";

import Script from "next/script";

const GA_TRACKING_ID = "G-17GVS8EQHS"; // Replace with your actual ID

export default function GoogleAnalytics() {
  return (
    <>
      {/* Load gtag.js script asynchronously */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />

      {/* Initialize Google Analytics */}
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}');
        `}
      </Script>
    </>
  );
}
