"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import Swal from "sweetalert2";

const CheckoutModal = ({
  isOpen,
  onClose,
  cartCourses,
  student,
  onCartUpdate,
}) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [utrNumber, setUtrNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const totalAmount = cartCourses.reduce((sum, cartItem) => {
    // Handle both old and new cart structure
    let course, sessionType;

    if (
      typeof cartItem === "string" ||
      (typeof cartItem === "object" && cartItem._id)
    ) {
      // Old format: just courseId or course object
      course = cartItem;
      sessionType = "recorded"; // Default to recorded for old format
    } else if (cartItem.courseId) {
      // New format: { courseId, sessionType }
      course = cartItem.courseId;
      sessionType = cartItem.sessionType || "recorded";
    } else {
      return sum; // Skip invalid items
    }

    // Get pricing based on session type
    let displayPrice = 0;
    if (sessionType === "recorded") {
      displayPrice =
        course.pricing?.recordedSession?.finalPrice ||
        course.pricing?.recordedSession?.price ||
        course.price ||
        0;
    } else if (sessionType === "live") {
      displayPrice =
        course.pricing?.liveSession?.finalPrice ||
        course.pricing?.liveSession?.price ||
        course.price * (course?.pricing?.liveSession?.priceMultiplier || 1.5) ||
        0;
    }

    return sum + displayPrice;
  }, 0);

  const handleRemoveFromCart = async (courseId, sessionType) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE}/api/v1/students/remove-cart/${student._id}`,
        { courseId, sessionType },
        { withCredentials: true }
      );

      if (response.data.message) {
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
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!utrNumber.trim()) {
      Swal.fire({
        title: "Error",
        text: "Please enter the UTR number",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${API_BASE}/api/transactions/create`,
        {
          courseId: selectedCourse._id,
          amount: (() => {
            const sessionType = selectedCourse.sessionType || "recorded";
            if (sessionType === "recorded") {
              return (
                selectedCourse.pricing?.recordedSession?.finalPrice ||
                selectedCourse.pricing?.recordedSession?.price ||
                selectedCourse.price ||
                0
              );
            } else if (sessionType === "live") {
              return (
                selectedCourse.pricing?.liveSession?.finalPrice ||
                selectedCourse.pricing?.liveSession?.price ||
                selectedCourse.price *
                  (selectedCourse?.pricing?.liveSession?.priceMultiplier ||
                    1.5) ||
                0
              );
            }
            return selectedCourse.price || 0;
          })(),
          utrNumber: utrNumber.trim(),
          notes: notes.trim(),
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        Swal.fire({
          title: "Payment Submitted!",
          text: "Your payment has been submitted for verification. You will receive an email once it's verified.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          // Update cart after successful payment submission
          onCartUpdate();
          setSelectedCourse(null);
          setUtrNumber("");
          setNotes("");
          onClose();
        });
      }
    } catch (error) {
      console.error("Error submitting payment:", error);

      let errorMessage = "Failed to submit payment. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
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
          ) : !selectedCourse ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <h3 className="text-xl font-semibold mb-4">Your Courses</h3>
                <div className="space-y-4">
                  {cartCourses.map((cartItem) => {
                    // Handle both old and new cart structure
                    let course, sessionType;

                    if (
                      typeof cartItem === "string" ||
                      (typeof cartItem === "object" && cartItem._id)
                    ) {
                      // Old format: just courseId or course object
                      course = cartItem;
                      sessionType = "recorded"; // Default to recorded for old format
                    } else if (cartItem.courseId) {
                      // New format: { courseId, sessionType }
                      course = cartItem.courseId;
                      sessionType = cartItem.sessionType || "recorded";
                    } else {
                      return null; // Skip invalid items
                    }

                    return (
                      <div
                        key={`${course._id}-${sessionType}`}
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
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${
                                sessionType === "recorded"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {sessionType === "recorded"
                                ? "Recorded Session"
                                : "Live Session"}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-green-600">
                            ₹
                            {(() => {
                              let displayPrice = 0;
                              if (sessionType === "recorded") {
                                displayPrice =
                                  course.pricing?.recordedSession?.finalPrice ||
                                  course.pricing?.recordedSession?.price ||
                                  course.price ||
                                  0;
                              } else if (sessionType === "live") {
                                displayPrice =
                                  course.pricing?.liveSession?.finalPrice ||
                                  course.pricing?.liveSession?.price ||
                                  course.price *
                                    (course?.pricing?.liveSession
                                      ?.priceMultiplier || 1.5) ||
                                  0;
                              }
                              return displayPrice?.toLocaleString() || "N/A";
                            })()}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() =>
                              handleProceedToPayment({ ...course, sessionType })
                            }
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            disabled={loading}
                          >
                            Pay Now
                          </button>
                          <button
                            onClick={() =>
                              handleRemoveFromCart(course._id, sessionType)
                            }
                            className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                            disabled={loading}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-4 sticky top-4">
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                  <div className="space-y-2 mb-4">
                    {cartCourses.map((cartItem) => {
                      // Handle both old and new cart structure
                      let course, sessionType;

                      if (
                        typeof cartItem === "string" ||
                        (typeof cartItem === "object" && cartItem._id)
                      ) {
                        // Old format: just courseId or course object
                        course = cartItem;
                        sessionType = "recorded"; // Default to recorded for old format
                      } else if (cartItem.courseId) {
                        // New format: { courseId, sessionType }
                        course = cartItem.courseId;
                        sessionType = cartItem.sessionType || "recorded";
                      } else {
                        return null; // Skip invalid items
                      }

                      return (
                        <div
                          key={`${course._id}-${sessionType}`}
                          className="flex justify-between text-sm"
                        >
                          <div className="flex flex-col">
                            <span className="text-gray-600 truncate">
                              {course.title}
                            </span>
                            <span
                              className={`text-xs ${
                                sessionType === "recorded"
                                  ? "text-green-600"
                                  : "text-blue-600"
                              }`}
                            >
                              {sessionType === "recorded" ? "Recorded" : "Live"}
                            </span>
                          </div>
                          <span className="font-medium">
                            ₹
                            {(() => {
                              let displayPrice = 0;
                              if (sessionType === "recorded") {
                                displayPrice =
                                  course.pricing?.recordedSession?.finalPrice ||
                                  course.pricing?.recordedSession?.price ||
                                  course.price ||
                                  0;
                              } else if (sessionType === "live") {
                                displayPrice =
                                  course.pricing?.liveSession?.finalPrice ||
                                  course.pricing?.liveSession?.price ||
                                  course.price *
                                    (course?.pricing?.liveSession
                                      ?.priceMultiplier || 1.5) ||
                                  0;
                              }
                              return displayPrice?.toLocaleString() || "N/A";
                            })()}
                          </span>
                        </div>
                      );
                    })}
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
          ) : (
            /* Payment Section */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Course Info & QR Code */}
              <div className="space-y-6">
                {/* Course Info */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {selectedCourse.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        selectedCourse.sessionType === "recorded"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {selectedCourse.sessionType === "recorded"
                        ? "Recorded Session"
                        : "Live Session"}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    ₹
                    {(() => {
                      const sessionType =
                        selectedCourse.sessionType || "recorded";
                      if (sessionType === "recorded") {
                        const displayPrice =
                          selectedCourse.pricing?.recordedSession?.finalPrice ||
                          selectedCourse.pricing?.recordedSession?.price ||
                          selectedCourse.price ||
                          0;
                        return displayPrice.toLocaleString();
                      } else if (sessionType === "live") {
                        const displayPrice =
                          selectedCourse.pricing?.liveSession?.finalPrice ||
                          selectedCourse.pricing?.liveSession?.price ||
                          selectedCourse.price *
                            (selectedCourse?.pricing?.liveSession
                              ?.priceMultiplier || 1.5) ||
                          0;
                        return displayPrice.toLocaleString();
                      }
                      return (selectedCourse.price || 0).toLocaleString();
                    })()}
                  </p>
                </div>

                {/* QR Code Section */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">
                    Scan QR Code to Pay
                  </h3>
                  <div className="bg-white border-2 border-blue-200 rounded-lg p-6 inline-block">
                    <Image
                      src="/upi.jpeg"
                      alt="UPI QR Code"
                      width={300}
                      height={300}
                      className="mx-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Scan with any UPI app to pay ₹
                    {(() => {
                      const sessionType =
                        selectedCourse.sessionType || "recorded";
                      if (sessionType === "recorded") {
                        const displayPrice =
                          selectedCourse.pricing?.recordedSession?.finalPrice ||
                          selectedCourse.pricing?.recordedSession?.price ||
                          selectedCourse.price ||
                          0;
                        return displayPrice.toLocaleString();
                      } else if (sessionType === "live") {
                        const displayPrice =
                          selectedCourse.pricing?.liveSession?.finalPrice ||
                          selectedCourse.pricing?.liveSession?.price ||
                          selectedCourse.price *
                            (selectedCourse?.pricing?.liveSession
                              ?.priceMultiplier || 1.5) ||
                          0;
                        return displayPrice.toLocaleString();
                      }
                      return (selectedCourse.price || 0).toLocaleString();
                    })()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    UPI ID: 8810380146@ptaxis
                  </p>
                </div>
              </div>

              {/* Payment Form */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Complete Payment
                  </h3>
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="utrNumber"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        UTR Number *
                      </label>
                      <input
                        type="text"
                        id="utrNumber"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        placeholder="Enter UTR number from your payment"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter the UTR (Unique Transaction Reference) number from
                        your payment receipt
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any additional information about your payment..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCourse(null);
                          setUtrNumber("");
                          setNotes("");
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={isSubmitting}
                      >
                        Back to Cart
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Payment"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Instructions */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Payment Instructions:
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Scan the QR code with any UPI app</li>
                    <li>
                      • Pay the exact amount: ₹
                      {(() => {
                        const sessionType =
                          selectedCourse.sessionType || "recorded";
                        if (sessionType === "recorded") {
                          const displayPrice =
                            selectedCourse.pricing?.recordedSession
                              ?.finalPrice ||
                            selectedCourse.pricing?.recordedSession?.price ||
                            selectedCourse.price ||
                            0;
                          return displayPrice.toLocaleString();
                        } else if (sessionType === "live") {
                          const displayPrice =
                            selectedCourse.pricing?.liveSession?.finalPrice ||
                            selectedCourse.pricing?.liveSession?.price ||
                            selectedCourse.price *
                              (selectedCourse?.pricing?.liveSession
                                ?.priceMultiplier || 1.5) ||
                            0;
                          return displayPrice.toLocaleString();
                        }
                        return (selectedCourse.price || 0).toLocaleString();
                      })()}
                    </li>
                    <li>• Save the UTR number from your payment receipt</li>
                    <li>• Enter the UTR number above and submit</li>
                    <li>• Your payment will be verified within 24 hours</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
