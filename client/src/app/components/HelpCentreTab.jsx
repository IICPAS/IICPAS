"use client";

import React, { useState } from "react";
import { 
  FaQuestionCircle, 
  FaSearch, 
  FaBook, 
  FaVideo, 
  FaPhone, 
  FaEnvelope, 
  FaComments,
  FaChevronDown,
  FaChevronUp,
  FaExternalLinkAlt
} from "react-icons/fa";

export default function HelpCentreTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const faqData = [
    {
      id: 1,
      category: "account",
      question: "How do I reset my password?",
      answer: "To reset your password, click on 'Forgot Password' on the login page, enter your email address, and follow the instructions sent to your email."
    },
    {
      id: 2,
      category: "courses",
      question: "How do I access my enrolled courses?",
      answer: "Once logged in, go to the 'Courses' section in your dashboard. All your enrolled courses will be listed there with access to materials and live sessions."
    },
    {
      id: 3,
      category: "certificates",
      question: "When will I receive my certificate?",
      answer: "Certificates are typically issued within 7-10 business days after course completion. You can track the status in the 'Certificates' section."
    },
    {
      id: 4,
      category: "technical",
      question: "I'm having trouble accessing live classes. What should I do?",
      answer: "Please check your internet connection and browser compatibility. Clear your browser cache and try using Chrome or Firefox. If issues persist, contact technical support."
    },
    {
      id: 5,
      category: "payment",
      question: "How can I make a payment for my course?",
      answer: "You can make payments through our secure payment gateway using credit/debit cards, net banking, or UPI. All transactions are encrypted and secure."
    },
    {
      id: 6,
      category: "account",
      question: "How do I update my profile information?",
      answer: "Go to your profile section, click on 'Edit Profile', make your changes, and save. Some information may require verification before being updated."
    }
  ];

  const categories = [
    { id: "all", name: "All Topics", icon: <FaBook /> },
    { id: "account", name: "Account", icon: <FaQuestionCircle /> },
    { id: "courses", name: "Courses", icon: <FaBook /> },
    { id: "certificates", name: "Certificates", icon: <FaQuestionCircle /> },
    { id: "technical", name: "Technical", icon: <FaQuestionCircle /> },
    { id: "payment", name: "Payment", icon: <FaQuestionCircle /> }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Help Centre</h1>
        <p className="text-gray-600">Find answers to common questions and get support</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaVideo className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Video Tutorials</h3>
          </div>
          <p className="text-gray-600 mb-4">Watch step-by-step video guides to get started</p>
          <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
            Watch Now <FaExternalLinkAlt className="text-sm" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FaComments className="text-green-600 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Live Chat</h3>
          </div>
          <p className="text-gray-600 mb-4">Chat with our support team in real-time</p>
          <button className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2">
            Start Chat <FaExternalLinkAlt className="text-sm" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FaEnvelope className="text-purple-600 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Email Support</h3>
          </div>
          <p className="text-gray-600 mb-4">Send us an email and we'll respond within 24 hours</p>
          <button className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2">
            Send Email <FaExternalLinkAlt className="text-sm" />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse by Category</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => (
              <div key={faq.id} className="p-6">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full text-left flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <h3 className="text-lg font-medium text-gray-900 pr-4">{faq.question}</h3>
                  {expandedFAQ === faq.id ? (
                    <FaChevronUp className="text-gray-400 flex-shrink-0" />
                  ) : (
                    <FaChevronDown className="text-gray-400 flex-shrink-0" />
                  )}
                </button>
                
                {expandedFAQ === faq.id && (
                  <div className="mt-4 pl-2">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No FAQs found matching your search criteria.
            </div>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Still Need Help?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaPhone className="text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Phone Support</p>
              <p className="text-gray-600">+91 9876543210</p>
              <p className="text-sm text-gray-500">Mon-Fri, 9 AM - 6 PM</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaEnvelope className="text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Email Support</p>
              <p className="text-gray-600">support@iicpas.com</p>
              <p className="text-sm text-gray-500">Response within 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
