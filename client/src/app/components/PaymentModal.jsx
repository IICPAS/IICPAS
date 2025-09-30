"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import Swal from "sweetalert2";

const PaymentModal = ({
  isOpen,
  onClose,
  course,
  totalAmount,
  onSuccess,
  onCloseCheckout,
}) => {
  const [utrNumber, setUtrNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const handleSubmit = async (e) => {
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
          courseId: course._id,
          amount: totalAmount,
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
          onSuccess && onSuccess();
          onClose();
          onCloseCheckout && onCloseCheckout();
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
    <div className="fixed inset-0 background-blur-lg bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Complete Payment</h2>
          <button
            onClick={() => {
              onClose();
              onCloseCheckout && onCloseCheckout();
            }}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Course Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">{course.title}</h3>
            <p className="text-2xl font-bold text-green-600">
              ₹{totalAmount.toLocaleString()}
            </p>
          </div>

          {/* QR Code Section */}
          <div className="mb-6 text-center">
            <h3 className="text-lg font-semibold mb-4">Scan QR Code to Pay</h3>
            <div className="bg-white border-2 border-blue-200 rounded-lg p-4 inline-block">
              <Image
                src="/upi.jpeg"
                alt="UPI QR Code"
                width={200}
                height={200}
                className="mx-auto"
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Scan with any UPI app to pay ₹{totalAmount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              UPI ID: 8810380146@ptaxis
            </p>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                Enter the UTR (Unique Transaction Reference) number from your
                payment receipt
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
                  onClose();
                  onCloseCheckout && onCloseCheckout();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
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

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">
              Payment Instructions:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Scan the QR code with any UPI app</li>
              <li>• Pay the exact amount: ₹{totalAmount.toLocaleString()}</li>
              <li>• Save the UTR number from your payment receipt</li>
              <li>• Enter the UTR number above and submit</li>
              <li>• Your payment will be verified within 24 hours</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
