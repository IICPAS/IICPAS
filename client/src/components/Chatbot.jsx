"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your course assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const responses = {
    "what courses do you offer?":
      "We offer courses in Accounting, HR, Finance, US CMA, and Excel. You can browse all available courses on this page and filter by category or skill level.",
    "how much do courses cost?":
      "Course prices vary by level and content. Foundation courses start from ₹1,000, Core courses from ₹2,000, and Expert courses from ₹5,000. Many courses have discounts available!",
    "what is the duration?":
      "Course duration depends on the level and content. Foundation courses typically take 2-4 weeks, Core courses 4-8 weeks, and Expert courses 8-12 weeks. Check individual course pages for specific details.",
    "do you provide certificates?":
      "Yes! We provide completion certificates for all our courses. These certificates are industry-recognized and can help boost your career prospects.",
    "how do i enroll?":
      "Simply click the 'Enroll Now' button on any course card, or visit the course detail page. You'll be redirected to our enrollment process where you can complete your registration.",
    "what are the prerequisites?":
      "Prerequisites vary by course level. Foundation courses have no prerequisites, Core courses may require basic knowledge, and Expert courses typically require intermediate to advanced knowledge in the subject area.",
    default:
      "I'm here to help with course-related questions! You can ask about our courses, pricing, enrollment process, certificates, or any other queries. Feel free to browse the courses on this page or ask me anything!",
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Generate bot response
    const botResponse = {
      id: messages.length + 2,
      text: responses[inputMessage.toLowerCase()] || responses.default,
      isBot: true,
      timestamp: new Date(),
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);

    setInputMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="fixed bottom-20 right-4 z-40 bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 h-[500px] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FaRobot className="text-xl" />
                <div>
                  <h3 className="font-semibold">Course Assistant</h3>
                  <p className="text-xs opacity-90">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    message.isBot ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl ${
                      message.isBot
                        ? "bg-gray-100 text-gray-800"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    <p className="text-base leading-relaxed">{message.text}</p>
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 border border-gray-300 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors"
                >
                  <FaPaperPlane className="text-xs" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button - Fixed Position */}
      <div
        className="fixed bottom-4 right-4 z-50"
        style={{
          position: "fixed",
          bottom: "1rem",
          right: "1rem",
          zIndex: 50,
        }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <FaRobot className="text-2xl" />
        </motion.button>
      </div>
    </>
  );
};

export default Chatbot;
