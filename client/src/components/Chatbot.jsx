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
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyData, setSurveyData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [surveyErrors, setSurveyErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userDetailsProvided, setUserDetailsProvided] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your course assistant. To provide you with personalized assistance, please share your details:\n\n• Full Name\n• Email Address\n• Phone Number\n\nYou can provide all details in one message or separately. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  // Extract user details from chat message
  const extractUserDetails = (message) => {
    const details = { name: "", email: "", phone: "" };
    
    // Email pattern
    const emailMatch = message.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (emailMatch) {
      details.email = emailMatch[1];
    }
    
    // Phone pattern (10 digits)
    const phoneMatch = message.match(/(\d{10})/);
    if (phoneMatch) {
      details.phone = phoneMatch[1];
    }
    
    // Name pattern (look for words that don't match email/phone patterns)
    const words = message.split(/\s+/).filter(word => {
      return !word.includes('@') && !/^\d{10}$/.test(word) && word.length > 1;
    });
    
    // Take the first 2-3 words as potential name
    if (words.length >= 2) {
      details.name = words.slice(0, 2).join(' ');
    } else if (words.length === 1) {
      details.name = words[0];
    }
    
    return details;
  };

  // Validate extracted details
  const validateExtractedDetails = (details) => {
    const errors = {};
    
    if (!details.name.trim()) {
      errors.name = "Name not found";
    }
    
    if (!details.email.trim()) {
      errors.email = "Email not found";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
      errors.email = "Invalid email format";
    }
    
    if (!details.phone.trim()) {
      errors.phone = "Phone number not found";
    } else if (!/^[0-9]{10}$/.test(details.phone.replace(/\D/g, ""))) {
      errors.phone = "Invalid phone number format";
    }
    
    return errors;
  };

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

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Check if user details are provided in the message
    if (!userDetailsProvided) {
      const extractedDetails = extractUserDetails(inputMessage);
      const validationErrors = validateExtractedDetails(extractedDetails);
      
      if (Object.keys(validationErrors).length === 0) {
        // All details found, store them
        setUserDetailsProvided(true);
        setSurveyData(extractedDetails);
        
        // Store in backend
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080"}/api/contact`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: extractedDetails.name,
                email: extractedDetails.email,
                phone: extractedDetails.phone,
                message: "User details provided through chatbot",
              }),
            }
          );

          if (response.ok) {
            const botResponse = {
              id: messages.length + 2,
              text: `Thank you ${extractedDetails.name}! I've received your details. Now, how can I help you with our courses?`,
              isBot: true,
              timestamp: new Date(),
            };
            
            setTimeout(() => {
              setMessages((prev) => [...prev, botResponse]);
            }, 1000);
          } else {
            throw new Error("Failed to store details");
          }
        } catch (error) {
          console.error("Error storing user details:", error);
          const botResponse = {
            id: messages.length + 2,
            text: "Thank you for your details! Now, how can I help you with our courses?",
            isBot: true,
            timestamp: new Date(),
          };
          
          setTimeout(() => {
            setMessages((prev) => [...prev, botResponse]);
          }, 1000);
        }
      } else {
        // Missing details, ask for them
        const missingFields = Object.keys(validationErrors);
        const botResponse = {
          id: messages.length + 2,
          text: `I need a bit more information. Please provide:\n\n${missingFields.map(field => `• ${field.charAt(0).toUpperCase() + field.slice(1)}`).join('\n')}\n\nYou can share all details in one message.`,
          isBot: true,
          timestamp: new Date(),
        };
        
        setTimeout(() => {
          setMessages((prev) => [...prev, botResponse]);
        }, 1000);
      }
    } else {
      // User details already provided, handle normal chat
      const botResponse = {
        id: messages.length + 2,
        text: responses[inputMessage.toLowerCase()] || responses.default,
        isBot: true,
        timestamp: new Date(),
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, botResponse]);
      }, 1000);
    }

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
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white bg-opacity-20 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face" 
                    alt="Assistant" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <FaUser className="text-sm hidden" />
                </div>
                <div>
                  <h3 className="font-semibold">Neha Singh</h3>
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
                    <p className="text-base leading-relaxed whitespace-pre-line">
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
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-1 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white bg-opacity-20 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face" 
              alt="Assistant" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <FaUser className="text-xl hidden" />
          </div>
        </motion.button>
      </div>
    </>
  );
};

export default Chatbot;
