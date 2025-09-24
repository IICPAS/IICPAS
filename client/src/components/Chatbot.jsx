"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaUser,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSurvey, setShowSurvey] = useState(true);
  const [surveyData, setSurveyData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [surveyErrors, setSurveyErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your course assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  // Validation function
  const validateForm = () => {
    const errors = {};

    if (!surveyData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!surveyData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(surveyData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!surveyData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(surveyData.phone.replace(/\D/g, ""))) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }

    return errors;
  };

  // Handle survey submission
  const handleSurveySubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setSurveyErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setSurveyErrors({});

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api"
        }/leads`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: surveyData.name,
            email: surveyData.email,
            phone: surveyData.phone,
            message: "User submitted basic information through chatbot survey",
            type: "chatbot_survey",
          }),
        }
      );

      if (response.ok) {
        setShowSurvey(false);
        // Add a success message to chat
        const successMessage = {
          id: messages.length + 1,
          text: "Thank you for providing your information! Now I can help you better. How can I assist you today?",
          isBot: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, successMessage]);
      } else {
        throw new Error("Failed to submit information");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      setSurveyErrors({
        submit: "Failed to submit information. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle survey input changes
  const handleSurveyChange = (e) => {
    const { name, value } = e.target;
    setSurveyData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (surveyErrors[name]) {
      setSurveyErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

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

            {/* Survey Form */}
            {showSurvey && (
              <div className="flex-1 overflow-y-auto p-6 min-h-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Quick Information
                    </h3>
                    <p className="text-sm text-gray-600">
                      Please provide your basic details to get personalized
                      assistance
                    </p>
                  </div>

                  <form onSubmit={handleSurveySubmit} className="space-y-4">
                    {/* Name Field */}
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <FaUser className="mr-2 text-blue-500" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={surveyData.name}
                        onChange={handleSurveyChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          surveyErrors.name
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter your full name"
                      />
                      {surveyErrors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {surveyErrors.name}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <FaEnvelope className="mr-2 text-blue-500" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={surveyData.email}
                        onChange={handleSurveyChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          surveyErrors.email
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter your email address"
                      />
                      {surveyErrors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {surveyErrors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <FaPhone className="mr-2 text-blue-500" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={surveyData.phone}
                        onChange={handleSurveyChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          surveyErrors.phone
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter your phone number"
                      />
                      {surveyErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {surveyErrors.phone}
                        </p>
                      )}
                    </div>

                    {/* Submit Error */}
                    {surveyErrors.submit && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-600 text-sm">
                          {surveyErrors.submit}
                        </p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Submitting..." : "Continue to Chat"}
                    </button>

                    {/* Skip Button */}
                    <button
                      type="button"
                      onClick={() => setShowSurvey(false)}
                      className="w-full text-gray-500 py-2 px-4 rounded-lg font-medium hover:text-gray-700 transition-colors duration-200"
                    >
                      Skip for now
                    </button>
                  </form>
                </motion.div>
              </div>
            )}

            {/* Messages */}
            {!showSurvey && (
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
                      <p className="text-base leading-relaxed">
                        {message.text}
                      </p>
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
            )}

            {/* Input */}
            {!showSurvey && (
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
            )}
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
