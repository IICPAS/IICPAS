"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createAuditClient } from "triostack-audit-sdk";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
console.log("AuditProvider - API_BASE:", API_BASE);
console.log("AuditProvider - Full baseUrl will be:", `${API_BASE}/audit`);

const AuditProvider = ({ children }) => {
  const { user } = useAuth();
  const auditClientRef = useRef(null);

  useEffect(() => {
    // Initialize audit client
    const initAuditClient = () => {
      try {
        // Get user ID from auth context or use anonymous
        const userId = user?.email || user?.id || "anonymous";

        const baseUrl = `${API_BASE}/audit`;
        console.log(
          "AuditProvider - Creating audit client with baseUrl:",
          baseUrl
        );

        auditClientRef.current = createAuditClient({
          baseUrl: baseUrl,
          userId: userId,
          includeGeo: true,
          onError: (error) => {
            console.error("Audit tracking error:", error);
            // You can send this to your error reporting service
          },
        });

        console.log("Audit client initialized for user:", userId);
      } catch (error) {
        console.error("Failed to initialize audit client:", error);
      }
    };

    // Initialize when user is available
    if (user !== null) {
      initAuditClient();
    }

    // Cleanup function
    return () => {
      if (auditClientRef.current) {
        try {
          auditClientRef.current.cleanup();
          console.log("Audit client cleaned up");
        } catch (error) {
          console.error("Error cleaning up audit client:", error);
        }
      }
    };
  }, [user]);

  // Re-initialize when user changes
  useEffect(() => {
    if (auditClientRef.current && user) {
      // Cleanup existing client
      auditClientRef.current.cleanup();

      // Re-initialize with new user
      const userId = user?.email || user?.id || "anonymous";
      const baseUrl = `${API_BASE}/audit`;
      console.log(
        "AuditProvider - Re-initializing audit client with baseUrl:",
        baseUrl
      );

      auditClientRef.current = createAuditClient({
        baseUrl: baseUrl,
        userId: userId,
        includeGeo: true,
        onError: (error) => {
          console.error("Audit tracking error:", error);
        },
      });

      console.log("Audit client re-initialized for user:", userId);
    }
  }, [user?.email, user?.id]);

  return <>{children}</>;
};

export default AuditProvider;
