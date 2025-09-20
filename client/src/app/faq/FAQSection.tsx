"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaChevronDown, FaChevronUp, FaQuestionCircle, FaGraduationCap, FaCreditCard, FaUser, FaBook, FaCertificate } from "react-icons/fa";

const FAQSection = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});

  const iconMap = {
    FaQuestionCircle: FaQuestionCircle,
    FaGraduationCap: FaGraduationCap,
    FaCreditCard: FaCreditCard,
    FaUser: FaUser,
    FaBook: FaBook,
    FaCertificate: FaCertificate,
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/website/faq`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching FAQ data:", error);
      // Fallback to default data
      setData({
        categories: [
          {
            title: "General Questions",
            icon: "FaQuestionCircle",
            faqs: [
              {
                question: "What is IICPA Institute?",
                answer: "IICPA Institute is a leading online education platform specializing in finance and accounting courses. We provide comprehensive training programs, practical simulations, and career guidance to help students excel in their professional journey."
              },
              {
                question: "How do I get started?",
                answer: "Getting started is easy! Simply browse our courses, create an account, and enroll in the program that interests you. You can also contact our support team for personalized guidance on choosing the right course for your career goals."
              },
              {
                question: "Do you offer certificates?",
                answer: "Yes, we provide certificates upon successful completion of our courses. Our certificates are recognized in the industry and can help boost your professional profile."
              }
            ]
          },
          {
            title: "Courses & Learning",
            icon: "FaGraduationCap",
            faqs: [
              {
                question: "What courses do you offer?",
                answer: "We offer a wide range of courses including GST training, accounting fundamentals, tax preparation, financial analysis, and specialized certification programs. All courses are designed with practical applications in mind."
              },
              {
                question: "How long are the courses?",
                answer: "Course duration varies depending on the program. Most courses range from 4-12 weeks, with flexible learning schedules that accommodate working professionals and students."
              },
              {
                question: "Are the courses self-paced?",
                answer: "Yes, most of our courses are self-paced, allowing you to learn at your own convenience. However, we also offer live sessions and interactive workshops for enhanced learning."
              }
            ]
          },
          {
            title: "Payment & Pricing",
            icon: "FaCreditCard",
            faqs: [
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, debit cards, net banking, UPI, and digital wallets. We also offer EMI options for select courses to make learning more accessible."
              },
              {
                question: "Do you offer refunds?",
                answer: "Yes, we offer a 7-day money-back guarantee if you're not satisfied with the course content. Please refer to our refund policy for detailed terms and conditions."
              },
              {
                question: "Are there any discounts available?",
                answer: "We regularly offer discounts and special promotions. Students and early bird registrations often receive additional benefits. Follow our social media channels for the latest offers."
              }
            ]
          },
          {
            title: "Account & Support",
            icon: "FaUser",
            faqs: [
              {
                question: "How do I reset my password?",
                answer: "You can reset your password by clicking on 'Forgot Password' on the login page. Enter your registered email address, and we'll send you a reset link."
              },
              {
                question: "How can I contact support?",
                answer: "You can contact our support team through email, phone, or live chat. We also have a comprehensive help center with detailed guides and tutorials."
              },
              {
                question: "Is my data secure?",
                answer: "Absolutely. We use industry-standard encryption and security measures to protect your personal and payment information. Your privacy and security are our top priorities."
              }
            ]
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (categoryIndex, faqIndex) => {
    const key = `${categoryIndex}-${faqIndex}`;
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-8 max-w-md mx-auto"></div>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categories = data?.categories || [];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find answers to the most common questions about our courses, services, and policies.
          </p>
        </div>

        <div className="space-y-8">
          {categories.map((category, categoryIndex) => {
            const IconComponent = iconMap[category.icon] || FaQuestionCircle;
            
            return (
              <div key={categoryIndex} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
                  <div className="flex items-center">
                    <IconComponent className="text-blue-600 text-2xl mr-4" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      {category.title}
                    </h3>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {category.faqs.map((faq, faqIndex) => {
                    const key = `${categoryIndex}-${faqIndex}`;
                    const isExpanded = expandedItems[key];
                    
                    return (
                      <div key={faqIndex} className="px-6 py-4">
                        <button
                          onClick={() => toggleExpanded(categoryIndex, faqIndex)}
                          className="w-full text-left flex justify-between items-center hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
                        >
                          <h4 className="text-lg font-medium text-gray-900 pr-4">
                            {faq.question}
                          </h4>
                          {isExpanded ? (
                            <FaChevronUp className="text-blue-600 flex-shrink-0" />
                          ) : (
                            <FaChevronDown className="text-blue-600 flex-shrink-0" />
                          )}
                        </button>
                        
                        {isExpanded && (
                          <div className="mt-4 pl-2">
                            <p className="text-gray-600 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = "/contact"}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Contact Support
              </button>
              <button 
                onClick={() => window.location.href = "/live-session"}
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors duration-200"
              >
                Join Live Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
