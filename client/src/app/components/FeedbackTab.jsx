"use client";

import React, { useState } from "react";
import { 
  FaStar, 
  FaThumbsUp, 
  FaThumbsDown, 
  FaComments, 
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function FeedbackTab() {
  const [feedbackType, setFeedbackType] = useState("general");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedbackForm, setFeedbackForm] = useState({
    subject: "",
    message: "",
    category: "general",
    anonymous: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const feedbackCategories = [
    { id: "general", name: "General Feedback", icon: <FaComments /> },
    { id: "course", name: "Course Feedback", icon: <FaStar /> },
    { id: "technical", name: "Technical Issue", icon: <FaExclamationCircle /> },
    { id: "suggestion", name: "Feature Suggestion", icon: <FaThumbsUp /> },
    { id: "complaint", name: "Complaint", icon: <FaThumbsDown /> }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFeedbackForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedbackForm.subject.trim() || !feedbackForm.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Feedback submitted:", {
        ...feedbackForm,
        rating,
        type: feedbackType,
        timestamp: new Date().toISOString()
      });
      
      toast.success("Thank you for your feedback!");
      setSubmitted(true);
      
      // Reset form
      setFeedbackForm({
        subject: "",
        message: "",
        category: "general",
        anonymous: false
      });
      setRating(0);
      
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="mb-6">
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600">
              Your feedback has been submitted successfully. We appreciate your input and will review it carefully.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => setSubmitted(false)}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Another Feedback
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback</h1>
        <p className="text-gray-600">Share your thoughts and help us improve your learning experience</p>
      </div>

      {/* Feedback Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">What would you like to share?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {feedbackCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setFeedbackType(category.id);
                setFeedbackForm(prev => ({ ...prev, category: category.id }));
              }}
              className={`p-4 rounded-lg border-2 transition-all ${
                feedbackType === category.id
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{category.icon}</div>
                <p className="text-sm font-medium">{category.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Rating Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Rating</h2>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="text-3xl transition-colors"
            >
              <FaStar
                className={
                  star <= (hoveredRating || rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              />
            </button>
          ))}
          <span className="ml-3 text-gray-600">
            {rating === 0 ? "Rate your experience" : `${rating} star${rating > 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Share Your Feedback</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              value={feedbackForm.subject}
              onChange={handleInputChange}
              placeholder="Brief description of your feedback"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Message *
            </label>
            <textarea
              name="message"
              value={feedbackForm.message}
              onChange={handleInputChange}
              rows={6}
              placeholder="Please provide detailed feedback about your experience..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="anonymous"
              name="anonymous"
              checked={feedbackForm.anonymous}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
              Submit anonymously
            </label>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                setFeedbackForm({
                  subject: "",
                  message: "",
                  category: "general",
                  anonymous: false
                });
                setRating(0);
              }}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Submit Feedback
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Additional Information */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Feedback Matters</h3>
        <p className="text-blue-800 mb-4">
          We value your input and use it to continuously improve our platform and services. 
          All feedback is reviewed by our team and helps us make better decisions.
        </p>
        <div className="text-sm text-blue-700">
          <p>• Response time: We typically respond within 2-3 business days</p>
          <p>• Privacy: Your feedback is confidential and will not be shared publicly</p>
          <p>• Follow-up: We may contact you for additional details if needed</p>
        </div>
      </div>
    </div>
  );
}
