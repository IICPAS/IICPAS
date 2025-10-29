"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

export default function CopyProtection() {
  useEffect(() => {
    // Check if we're on an admin dashboard page
    const isAdminDashboard = () => {
      if (typeof window === "undefined") return false;
      return window.location.pathname.includes("/admin-dashboard");
    };

    // Skip protection if on admin dashboard
    if (isAdminDashboard()) {
      return;
    }

    // Function to show protection message
    const showProtectionMessage = () => {
      toast.error("Content is protected and cannot be copied.", {
        duration: 3000,
        style: {
          background: "#ef4444",
          color: "#fff",
        },
      });
    };

    // Prevent right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showProtectionMessage();
      return false;
    };

    // Prevent copy operations
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      showProtectionMessage();
      return false;
    };

    // Prevent cut operations
    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      showProtectionMessage();
      return false;
    };

    // Prevent text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Block keyboard shortcuts (Ctrl+C, Ctrl+X, Ctrl+V, Ctrl+A, Cmd+C, Cmd+X, Cmd+V, Cmd+A)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl or Cmd key
      if (e.ctrlKey || e.metaKey) {
        // Block Ctrl/Cmd + C (Copy)
        if (e.key === "c" || e.key === "C") {
          e.preventDefault();
          showProtectionMessage();
          return false;
        }
        // Block Ctrl/Cmd + X (Cut)
        if (e.key === "x" || e.key === "X") {
          e.preventDefault();
          showProtectionMessage();
          return false;
        }
        // Block Ctrl/Cmd + V (Paste)
        if (e.key === "v" || e.key === "V") {
          e.preventDefault();
          showProtectionMessage();
          return false;
        }
        // Block Ctrl/Cmd + A (Select All)
        if (e.key === "a" || e.key === "A") {
          e.preventDefault();
          showProtectionMessage();
          return false;
        }
        // Block Ctrl/Cmd + U (View Source)
        if (e.key === "u" || e.key === "U") {
          e.preventDefault();
          showProtectionMessage();
          return false;
        }
        // Block Ctrl/Cmd + Shift + I (Developer Tools)
        if (e.key === "I" && e.shiftKey) {
          e.preventDefault();
          showProtectionMessage();
          return false;
        }
      }
      // Block F12 (Developer Tools)
      if (e.key === "F12") {
        e.preventDefault();
        showProtectionMessage();
        return false;
      }
    };

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // This component doesn't render anything
  return null;
}
