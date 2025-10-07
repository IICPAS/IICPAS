import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import Chatbot from "@/components/Chatbot";
import WhatsAppButton from "@/components/WhatsAppButton";
import CookiePolicyPopup from "@/components/CookiePolicyPopup";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import SpecialOfferFlashCard from "@/components/SpecialOfferFlashCard";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IICPA Institute - Best Accounting Institute in India",
  description: "Professional Accounting Institute",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <GoogleAnalytics />
      <body className={inter.className} suppressHydrationWarning={true}>
        <AuthProvider>
          {/* Special Offers Flash Cards - Show on all pages as modal */}
          <SpecialOfferFlashCard location="all" maxCards={1} />
          {children}
        </AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#4ade80",
                secondary: "#fff",
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
        <Chatbot />
        <WhatsAppButton />
        <CookiePolicyPopup />
      </body>
    </html>
  );
}
