"use client";

import React, { useState } from "react";
import axios from "axios";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";

// Load Razorpay script
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const TestPaymentPage = () => {
  const [formData, setFormData] = useState({
    amount: "",
    currency: "INR",
    receipt: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const displayMessage = (msg: string, type: "success" | "error" | "info") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  const createOrder = async () => {
    try {
      const response = await axios.post(
        `${API_BASE}/test-payment/create-order`,
        {
          amount: parseFloat(formData.amount),
          currency: formData.currency,
          receipt: formData.receipt || `receipt_${Date.now()}`,
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error creating order:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create order"
      );
    }
  };

  const verifyPayment = async (
    orderId: string,
    paymentId: string,
    signature: string
  ) => {
    try {
      const response = await axios.post(
        `${API_BASE}/test-payment/verify-payment`,
        {
          orderId,
          paymentId,
          signature,
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error verifying payment:", error);
      throw new Error(
        error.response?.data?.message || "Failed to verify payment"
      );
    }
  };

  const handlePayment = async () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      displayMessage("Please enter a valid amount", "error");
      return;
    }

    if (!formData.customerName || !formData.customerEmail) {
      displayMessage("Please fill in customer details", "error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Load Razorpay script
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) {
        throw new Error("Failed to load Razorpay script");
      }

      // Create order
      const orderData = await createOrder();

      if (!orderData.success) {
        throw new Error(orderData.message);
      }

      // Payment options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: "IICPA Institute",
        description: "Test Payment",
        order_id: orderData.data.orderId,
        prefill: {
          name: formData.customerName,
          email: formData.customerEmail,
          contact: formData.customerPhone,
        },
        theme: {
          color: "#10B981",
        },
        handler: async function (response: any) {
          try {
            // Verify payment
            const verificationResult = await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            if (verificationResult.success) {
              displayMessage(
                "Payment successful! Payment ID: " +
                  response.razorpay_payment_id,
                "success"
              );
            } else {
              displayMessage("Payment verification failed", "error");
            }
          } catch (error: any) {
            displayMessage(
              "Payment verification failed: " + error.message,
              "error"
            );
          }
        },
        modal: {
          ondismiss: function () {
            displayMessage("Payment cancelled by user", "info");
          },
        },
      };

      // Open Razorpay checkout
      const razorpay = (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      displayMessage("Payment failed: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    const paymentId = prompt("Enter Payment ID to refund:");
    if (!paymentId) return;

    const amount = prompt("Enter refund amount (leave empty for full refund):");

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/test-payment/refund`, {
        paymentId,
        amount: amount ? parseFloat(amount) : undefined,
        notes: { reason: "Test refund" },
      });

      if (response.data.success) {
        displayMessage("Refund processed successfully", "success");
      } else {
        displayMessage("Refund failed: " + response.data.message, "error");
      }
    } catch (error: any) {
      displayMessage(
        "Refund failed: " + (error.response?.data?.message || error.message),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Test Payment Gateway
            </h1>
            <p className="text-gray-600">Test Razorpay payment integration</p>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                messageType === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : messageType === "error"
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-blue-50 text-blue-800 border border-blue-200"
              }`}
            >
              {message}
            </div>
          )}

          <form className="space-y-6">
            {/* Amount */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Amount (₹)
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter amount"
                min="1"
                step="0.01"
                required
              />
            </div>

            {/* Currency */}
            <div>
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            {/* Receipt */}
            <div>
              <label
                htmlFor="receipt"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Receipt (Optional)
              </label>
              <input
                type="text"
                id="receipt"
                name="receipt"
                value={formData.receipt}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Receipt number"
              />
            </div>

            {/* Customer Name */}
            <div>
              <label
                htmlFor="customerName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Customer Name *
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter customer name"
                required
              />
            </div>

            {/* Customer Email */}
            <div>
              <label
                htmlFor="customerEmail"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Customer Email *
              </label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter customer email"
                required
              />
            </div>

            {/* Customer Phone */}
            <div>
              <label
                htmlFor="customerPhone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Customer Phone
              </label>
              <input
                type="tel"
                id="customerPhone"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter customer phone"
              />
            </div>

            {/* Payment Button */}
            <button
              type="button"
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {loading ? "Processing..." : "Make Payment"}
            </button>

            {/* Refund Button */}
            <button
              type="button"
              onClick={handleRefund}
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {loading ? "Processing..." : "Test Refund"}
            </button>
          </form>

          {/* Test Card Details */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Test Card Details
            </h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>
                <strong>Card Number:</strong> 4111 1111 1111 1111
              </p>
              <p>
                <strong>Expiry:</strong> Any future date
              </p>
              <p>
                <strong>CVV:</strong> Any 3 digits
              </p>
              <p>
                <strong>Name:</strong> Any name
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPaymentPage;
