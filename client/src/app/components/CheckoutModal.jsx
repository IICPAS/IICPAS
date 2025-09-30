"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import Swal from "sweetalert2";
import PaymentModal from "./PaymentModal";

const CheckoutModal = ({
  isOpen,
  onClose,
  cartCourses,
  student,
  onCartUpdate,
}) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const totalAmount = cartCourses.reduce(
    (sum, course) => sum + (course.price || 0),
    0
  );

  const handleRemoveFromCart = async (courseId) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE}/api/v1/students/remove-cart/${student._id}`,
        { courseId },
        { withCredentials: true }
      );

      if (response.data.success) {
        Swal.fire({
          title: "Removed",
          text: "Course removed from cart",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        // Update cart
        onCartUpdate();
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to remove course from cart",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = (course) => {
    setSelectedCourse(course);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    // Update cart after successful payment submission
    onCartUpdate();
    setShowPaymentModal(false);
    setSelectedCourse(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {cartCourses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <button
                onClick={onClose}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <h3 className="text-xl font-semibold mb-4">Your Courses</h3>
                <div className="space-y-4">
                  {cartCourses.map((course) => (
                    <div
                      key={course._id}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                    >
                      {/* Course Image */}
                      <div className="w-20 h-20 relative flex-shrink-0">
                        {course.image ? (
                          <Image
                            src={
                              course.image.startsWith("http")
                                ? course.image
                                : course.image.startsWith("/uploads/")
                                ? `${API_BASE}${course.image}`
                                : course.image.startsWith("/")
                                ? course.image
                                : `${API_BASE}${course.image}`
                            }
                            alt={course.title}
                            fill
                            className="object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-2xl">📚</span>
                          </div>
                        )}
                      </div>

                      {/* Course Details */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">
                          {course.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {course.category}
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          ₹{course.price?.toLocaleString() || "N/A"}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleProceedToPayment(course)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          disabled={loading}
                        >
                          Pay Now
                        </button>
                        <button
                          onClick={() => handleRemoveFromCart(course._id)}
                          className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                          disabled={loading}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-4 sticky top-4">
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                  <div className="space-y-2 mb-4">
                    {cartCourses.map((course) => (
                      <div
                        key={course._id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-600 truncate">
                          {course.title}
                        </span>
                        <span className="font-medium">
                          ₹{course.price?.toLocaleString() || "N/A"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-green-600">
                        ₹{totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Payment Instructions
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Click "Pay Now" for each course individually</li>
                      <li>• Scan the QR code with any UPI app</li>
                      <li>• Enter the UTR number from your payment receipt</li>
                      <li>• Your payment will be verified within 24 hours</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedCourse && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedCourse(null);
            }}
            course={selectedCourse}
            totalAmount={selectedCourse.price || 0}
            onSuccess={handlePaymentSuccess}
            onCloseCheckout={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
