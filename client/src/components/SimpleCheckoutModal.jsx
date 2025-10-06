"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useCart } from "../hooks/useCart";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const SimpleCheckoutModal = ({ isOpen, onClose, student }) => {
  const { cartItems, removeFromCart, getTotalPrice, loading, fetchCart } =
    useCart(student);

  // Payment form states
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [paymentData, setPaymentData] = useState({
    utrNumber: "",
    additionalNotes: "",
    paymentScreenshot: null,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleRemoveFromCart = async (courseId, sessionType) => {
    try {
      await removeFromCart(courseId, sessionType);
    } catch (error) {
      console.error("Error removing from cart:", error);
      alert("Failed to remove item");
    }
  };

  const handlePayNow = (item) => {
    const course = item.course;
    let price = 0;

    if (item.sessionType === "recorded") {
      price =
        course?.pricing?.recordedSession?.finalPrice ||
        course?.pricing?.recordedSession?.price ||
        course?.price ||
        0;
    } else if (item.sessionType === "live") {
      price =
        course?.pricing?.liveSession?.finalPrice ||
        course?.pricing?.liveSession?.price ||
        course?.price * 1.5 ||
        0;
    }

    setSelectedItem({
      ...item,
      price: price,
    });
    setShowPaymentForm(true);
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

      setPaymentData((prev) => ({
        ...prev,
        paymentScreenshot: file,
      }));
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    if (!paymentData.utrNumber.trim()) {
      alert("Please enter UTR number");
      return;
    }

    if (!paymentData.paymentScreenshot) {
      alert("Please upload payment screenshot");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("courseId", selectedItem.courseId);
      formData.append("sessionType", selectedItem.sessionType);
      formData.append("amount", selectedItem.price);
      formData.append("utrNumber", paymentData.utrNumber);
      formData.append("additionalNotes", paymentData.additionalNotes);
      formData.append("paymentScreenshot", paymentData.paymentScreenshot);
      formData.append("studentId", student?._id || "");

      const response = await axios.post(
        `${API_BASE}/api/v1/transactions/submit-payment`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        alert("Payment submitted successfully! It will be reviewed by admin.");

        // Reset form
        setPaymentData({
          utrNumber: "",
          additionalNotes: "",
          paymentScreenshot: null,
        });
        setShowPaymentForm(false);
        setSelectedItem(null);

        // Refresh cart to remove the paid item
        await fetchCart();
      }
    } catch (error) {
      console.error("Payment submission error:", error);
      alert(error.response?.data?.message || "Failed to submit payment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToCart = () => {
    setShowPaymentForm(false);
    setSelectedItem(null);
    setPaymentData({
      utrNumber: "",
      additionalNotes: "",
      paymentScreenshot: null,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {cartItems.length === 0 ? (
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
                  {cartItems.map((item) => {
                    const course = item.course;
                    const courseId = item.courseId;

                    if (!courseId) return null;

                    return (
                      <div
                        key={`${courseId}-${item.sessionType}`}
                        className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                      >
                        {/* Course Image */}
                        <div className="w-20 h-20 relative flex-shrink-0">
                          {course?.image ? (
                            <Image
                              src={(() => {
                                const imageSrc = course.image.startsWith("http")
                                  ? course.image
                                  : course.image.startsWith("/uploads/")
                                  ? `${API_BASE}${course.image}`
                                  : course.image.startsWith("/")
                                  ? course.image
                                  : `${API_BASE}/${course.image}`;
                                console.log(
                                  "Checkout modal image src:",
                                  imageSrc,
                                  "from:",
                                  course.image
                                );
                                return imageSrc;
                              })()}
                              alt={course.title || "Course"}
                              fill
                              className="object-cover rounded-lg"
                              onError={(e) => {
                                console.log(
                                  "Checkout modal image failed to load:",
                                  course.image
                                );
                                e.currentTarget.src = "/images/a1.jpeg";
                              }}
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
                                item.sessionType === "recorded"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {item.sessionType === "recorded"
                                ? "Recorded Session"
                                : "Live Session"}
                            </span>
                          </div>

                          {/* Quantity Display */}
                          {item.quantity > 1 && (
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-gray-600">
                                Quantity:
                              </span>
                              <span className="text-sm font-medium text-gray-800">
                                {item.quantity}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-600">
                              ₹
                              {(() => {
                                let price = 0;
                                if (item.sessionType === "recorded") {
                                  price =
                                    course?.pricing?.recordedSession
                                      ?.finalPrice ||
                                    course?.pricing?.recordedSession?.price ||
                                    course?.price ||
                                    0;
                                } else {
                                  price =
                                    course?.pricing?.liveSession?.finalPrice ||
                                    course?.pricing?.liveSession?.price ||
                                    course?.price * 1.5 ||
                                    0;
                                }
                                return (price && typeof price === 'number') ? price.toLocaleString() : "0";
                              })()}{" "}
                              × {item.quantity}
                            </p>
                            <p className="text-lg font-bold text-green-600">
                              = ₹
                              {(() => {
                                let price = 0;
                                if (item.sessionType === "recorded") {
                                  price =
                                    course?.pricing?.recordedSession
                                      ?.finalPrice ||
                                    course?.pricing?.recordedSession?.price ||
                                    course?.price ||
                                    0;
                                } else {
                                  price =
                                    course?.pricing?.liveSession?.finalPrice ||
                                    course?.pricing?.liveSession?.price ||
                                    course?.price * 1.5 ||
                                    0;
                                }
                                const totalPrice = price * item.quantity;
                                return (totalPrice && typeof totalPrice === 'number') ? totalPrice.toLocaleString() : "0";
                              })()}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handlePayNow(item)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            disabled={loading}
                          >
                            Pay Now
                          </button>
                          <button
                            onClick={() =>
                              handleRemoveFromCart(courseId, item.sessionType)
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
                    {cartItems.map((item) => {
                      const course = item.course;
                      const courseId = item.courseId;

                      if (!courseId) return null;

                      return (
                        <div
                          key={`${courseId}-${item.sessionType}`}
                          className="flex justify-between text-sm"
                        >
                          <div className="flex flex-col">
                            <span className="text-gray-600 truncate">
                              {course?.title || "Course"} × {item.quantity}
                            </span>
                            <span
                              className={`text-xs ${
                                item.sessionType === "recorded"
                                  ? "text-green-600"
                                  : "text-blue-600"
                              }`}
                            >
                              {item.sessionType === "recorded"
                                ? "Recorded"
                                : "Live"}
                            </span>
                          </div>
                          <span className="font-medium">
                            ₹
                            {(() => {
                              let price = 0;
                              if (item.sessionType === "recorded") {
                                price =
                                  course?.pricing?.recordedSession
                                    ?.finalPrice ||
                                  course?.pricing?.recordedSession?.price ||
                                  course?.price ||
                                  0;
                              } else {
                                price =
                                  course?.pricing?.liveSession?.finalPrice ||
                                  course?.pricing?.liveSession?.price ||
                                  course?.price * 1.5 ||
                                  0;
                              }
                              const totalPrice = price * item.quantity;
                              return (totalPrice && typeof totalPrice === 'number') ? totalPrice.toLocaleString() : "0";
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
                        ₹{(getTotalPrice() && typeof getTotalPrice() === 'number') ? getTotalPrice().toLocaleString() : "0"}
                      </span>
                    </div>
                  </div>

                  <button
                    className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    disabled={loading}
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && selectedItem && (
        <div className="fixed inset-0 backdrop-blur-lg bg-black bg-opacity-75 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                Complete Payment
              </h2>
              <button
                onClick={handleBackToCart}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Course Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    {selectedItem.course?.title}
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Course: {selectedItem.course?.category}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Session:{" "}
                      {selectedItem.sessionType === "recorded"
                        ? "Recorded"
                        : "Live"}
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      ₹{(selectedItem.price && typeof selectedItem.price === 'number') ? selectedItem.price.toLocaleString() : "0"}
                    </p>
                  </div>

                  {/* QR Code Section */}
                  <div className="text-center">
                    <h4 className="font-semibold mb-2">Scan QR Code to Pay</h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center border-2 border-blue-200">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📱</div>
                          <p className="text-sm text-gray-600">QR Code</p>
                          <p className="text-xs text-gray-500">
                            Scan with any UPI app
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Form */}
                <div>
                  <form onSubmit={handleSubmitPayment} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        UTR Number *
                      </label>
                      <input
                        type="text"
                        value={paymentData.utrNumber}
                        onChange={(e) =>
                          setPaymentData((prev) => ({
                            ...prev,
                            utrNumber: e.target.value,
                          }))
                        }
                        placeholder="Enter UTR number from your payment"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter the UTR (Unique Transaction Reference) number from
                        your payment receipt
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Screenshot *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Upload a screenshot of your payment confirmation (Max
                        5MB)
                      </p>
                      {paymentData.paymentScreenshot && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ File selected: {paymentData.paymentScreenshot.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        value={paymentData.additionalNotes}
                        onChange={(e) =>
                          setPaymentData((prev) => ({
                            ...prev,
                            additionalNotes: e.target.value,
                          }))
                        }
                        placeholder="Any additional information about your payment..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={handleBackToCart}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Back to Cart
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {submitting ? "Submitting..." : "Submit Payment"}
                      </button>
                    </div>
                  </form>

                  {/* Payment Instructions */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Payment Instructions:
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Scan the QR code with any UPI app</li>
                      <li>
                        • Pay the exact amount: ₹
                        {(selectedItem.price && typeof selectedItem.price === 'number') ? selectedItem.price.toLocaleString() : "0"}
                      </li>
                      <li>• Save the UTR number from your payment receipt</li>
                      <li>• Take a screenshot of the payment confirmation</li>
                      <li>• Enter the UTR number above and submit</li>
                      <li>• Your payment will be verified within 24 hours</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleCheckoutModal;
