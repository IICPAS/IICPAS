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
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const totalAmount = cartCourses.reduce((sum, cartItem) => {
    // Handle both old and new cart structure
    let course,
      sessionType,
      quantity = 1;

    if (
      typeof cartItem === "string" ||
      (typeof cartItem === "object" && cartItem._id && !cartItem.courseId)
    ) {
      // Old format: just courseId or course object
      course = cartItem;
      sessionType = "recorded"; // Default to recorded for old format
    } else if (cartItem.courseId || cartItem.course) {
      // New format: { courseId, sessionType, quantity, course }
      course = cartItem.course || cartItem.courseId;
      sessionType = cartItem.sessionType || "recorded";
      quantity = cartItem.quantity || 1;
    } else {
      return sum; // Skip invalid items
    }

    // Get pricing based on session type
    let displayPrice = 0;
    if (sessionType === "recorded") {
      displayPrice =
        course?.pricing?.recordedSession?.finalPrice ||
        course?.pricing?.recordedSession?.price ||
        course?.price ||
        0;
    } else if (sessionType === "live") {
      displayPrice =
        course?.pricing?.liveSession?.finalPrice ||
        course?.pricing?.liveSession?.price ||
        course?.price *
          (course?.pricing?.liveSession?.priceMultiplier || 1.5) ||
        0;
    }

    return sum + displayPrice * quantity;
  }, 0);

  const handleUpdateQuantity = async (courseId, sessionType, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE}/api/v1/students/update-cart-quantity/${student._id}`,
        { courseId, sessionType, quantity: newQuantity },
        { withCredentials: true }
      );

      if (response.data.message) {
        // Update cart
        onCartUpdate();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to update quantity",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Please select a valid image file (JPEG, PNG, GIF, WebP)");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setPaymentScreenshot(file);
    }
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

    if (!paymentScreenshot) {
      Swal.fire({
        title: "Error",
        text: "Please upload a payment screenshot",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if this is a group package or individual course
      const isGroupPackage =
        selectedCourse.courseIds && selectedCourse.courseIds.length > 0;

      let response;
      if (isGroupPackage) {
        // Handle group package enrollment
        response = await axios.post(
          `${API_BASE}/api/group-pricing/${selectedCourse._id}/enroll`,
          {
            studentId: student._id,
            sessionType: selectedCourse.sessionType || "recorded",
          },
          {
            withCredentials: true,
          }
        );
      } else {
        // Handle individual course transaction with file upload
        const formData = new FormData();
        formData.append("courseId", selectedCourse._id);
        formData.append(
          "sessionType",
          selectedCourse.sessionType || "recorded"
        );

        const amount = (() => {
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
        })();

        formData.append("amount", amount);
        formData.append("utrNumber", utrNumber.trim());
        formData.append("additionalNotes", notes.trim());
        formData.append("paymentScreenshot", paymentScreenshot);
        formData.append("studentId", student._id);

        response = await axios.post(
          `${API_BASE}/api/v1/transactions/submit-payment`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (response.data.success) {
        const isGroupPackage =
          selectedCourse.courseIds && selectedCourse.courseIds.length > 0;

        if (isGroupPackage) {
          Swal.fire({
            title: "Enrollment Successful!",
            text: `You have been successfully enrolled in the ${response.data.data.packageName} with ${response.data.data.enrolledCourses} courses.`,
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            // Update cart after successful enrollment
            onCartUpdate();
            setSelectedCourse(null);
            setUtrNumber("");
            setNotes("");
            setPaymentScreenshot(null);
            onClose();
          });
        } else {
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
            setPaymentScreenshot(null);
            onClose();
          });
        }
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
                    let course,
                      sessionType,
                      quantity = 1;

                    if (
                      typeof cartItem === "string" ||
                      (typeof cartItem === "object" &&
                        cartItem._id &&
                        !cartItem.courseId)
                    ) {
                      // Old format: just courseId or course object
                      course = cartItem;
                      sessionType = "recorded"; // Default to recorded for old format
                    } else if (cartItem.courseId || cartItem.course) {
                      // New format: { courseId, sessionType, quantity, course }
                      course = cartItem.course || cartItem.courseId;
                      sessionType = cartItem.sessionType || "recorded";
                      quantity = cartItem.quantity || 1;
                    } else {
                      return null; // Skip invalid items
                    }

                    const courseId = course?._id || course?.id;
                    if (!courseId) return null;

                    return (
                      <div
                        key={`${courseId}-${sessionType}`}
                        className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                      >
                        {/* Course Image */}
                        <div className="w-20 h-20 relative flex-shrink-0">
                          {course?.image ? (
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
                              alt={course.title || "Course"}
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
                            {course?.title || "Course"}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {course?.category || "General"}
                          </p>
                          <div className="flex items-center gap-2 mb-2">
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

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm text-gray-600">
                              Quantity:
                            </span>
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    courseId,
                                    sessionType,
                                    quantity - 1
                                  )
                                }
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                disabled={loading || quantity <= 1}
                              >
                                -
                              </button>
                              <span className="px-3 py-1 border-x border-gray-300 min-w-[40px] text-center">
                                {quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    courseId,
                                    sessionType,
                                    quantity + 1
                                  )
                                }
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                disabled={loading}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-600">
                              ₹
                              {(() => {
                                let displayPrice = 0;
                                if (sessionType === "recorded") {
                                  displayPrice =
                                    course?.pricing?.recordedSession
                                      ?.finalPrice ||
                                    course?.pricing?.recordedSession?.price ||
                                    course?.price ||
                                    0;
                                } else if (sessionType === "live") {
                                  displayPrice =
                                    course?.pricing?.liveSession?.finalPrice ||
                                    course?.pricing?.liveSession?.price ||
                                    course?.price *
                                      (course?.pricing?.liveSession
                                        ?.priceMultiplier || 1.5) ||
                                    0;
                                }
                                return displayPrice?.toLocaleString() || "0";
                              })()}{" "}
                              × {quantity}
                            </p>
                            <p className="text-lg font-bold text-green-600">
                              = ₹
                              {(() => {
                                let displayPrice = 0;
                                if (sessionType === "recorded") {
                                  displayPrice =
                                    course?.pricing?.recordedSession
                                      ?.finalPrice ||
                                    course?.pricing?.recordedSession?.price ||
                                    course?.price ||
                                    0;
                                } else if (sessionType === "live") {
                                  displayPrice =
                                    course?.pricing?.liveSession?.finalPrice ||
                                    course?.pricing?.liveSession?.price ||
                                    course?.price *
                                      (course?.pricing?.liveSession
                                        ?.priceMultiplier || 1.5) ||
                                    0;
                                }
                                return (
                                  (displayPrice * quantity)?.toLocaleString() ||
                                  "0"
                                );
                              })()}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() =>
                              handleProceedToPayment({
                                ...course,
                                sessionType,
                                quantity,
                              })
                            }
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            disabled={loading}
                          >
                            Pay Now
                          </button>
                          <button
                            onClick={() =>
                              handleRemoveFromCart(courseId, sessionType)
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
                      let course,
                        sessionType,
                        quantity = 1;

                      if (
                        typeof cartItem === "string" ||
                        (typeof cartItem === "object" &&
                          cartItem._id &&
                          !cartItem.courseId)
                      ) {
                        // Old format: just courseId or course object
                        course = cartItem;
                        sessionType = "recorded"; // Default to recorded for old format
                      } else if (cartItem.courseId || cartItem.course) {
                        // New format: { courseId, sessionType, quantity, course }
                        course = cartItem.course || cartItem.courseId;
                        sessionType = cartItem.sessionType || "recorded";
                        quantity = cartItem.quantity || 1;
                      } else {
                        return null; // Skip invalid items
                      }

                      const courseId = course?._id || course?.id;
                      if (!courseId) return null;

                      return (
                        <div
                          key={`${courseId}-${sessionType}`}
                          className="flex justify-between text-sm"
                        >
                          <div className="flex flex-col">
                            <span className="text-gray-600 truncate">
                              {course?.title || "Course"} × {quantity}
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
                                  course?.pricing?.recordedSession
                                    ?.finalPrice ||
                                  course.pricing?.recordedSession?.price ||
                                  course.price ||
                                  0;
                              } else if (sessionType === "live") {
                                displayPrice =
                                  course?.pricing?.liveSession?.finalPrice ||
                                  course?.pricing?.liveSession?.price ||
                                  course?.price *
                                    (course?.pricing?.liveSession
                                      ?.priceMultiplier || 1.5) ||
                                  0;
                              }
                              return (
                                (displayPrice * quantity)?.toLocaleString() ||
                                "0"
                              );
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
                      <li>• Take a screenshot of your payment confirmation</li>
                      <li>• Enter the UTR number from your payment receipt</li>
                      <li>• Upload the payment screenshot</li>
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
                        htmlFor="paymentScreenshot"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Payment Screenshot *
                      </label>
                      <input
                        type="file"
                        id="paymentScreenshot"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Upload a screenshot of your payment confirmation (Max
                        5MB)
                      </p>
                      {paymentScreenshot && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ File selected: {paymentScreenshot.name}
                        </p>
                      )}
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
                    <li>• Take a screenshot of your payment confirmation</li>
                    <li>
                      • Enter the UTR number and upload the screenshot above
                    </li>
                    <li>• Submit to complete your payment</li>
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
