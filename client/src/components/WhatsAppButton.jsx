"use client";

import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  // WhatsApp configuration - you can change this number
  const whatsappNumber = "+1234567890"; // Replace with your actual WhatsApp number
  const whatsappMessage =
    "Hi! I'm interested in your courses. Can you help me?";

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(
      /[^0-9]/g,
      ""
    )}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div
      className="fixed bottom-4 left-4 z-[60]"
      style={{
        position: "fixed",
        bottom: "1rem",
        left: "1rem",
        zIndex: 60,
      }}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleWhatsAppClick}
        className="bg-gradient-to-r from-green-400 to-green-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        title="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-2xl" />
      </motion.button>
    </div>
  );
};

export default WhatsAppButton;
