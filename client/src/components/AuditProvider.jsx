"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createAuditClient } from "triostack-audit-sdk";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const AuditProvider = ({ children }) => {
  const { user } = useAuth();
  const auditClientRef = useRef(null);

  useEffect(() => {
    // Initialize audit client
    const initAuditClient = () => {
      try {
        // Get user ID from auth context or use anonymous
        const userId = user?.email || user?.id || "anonymous";

        auditClientRef.current = createAuditClient({
          baseUrl: `${API_BASE}/audit`,
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
      auditClientRef.current = createAuditClient({
        baseUrl: `${API_BASE}/audit`,
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
