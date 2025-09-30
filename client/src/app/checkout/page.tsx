"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import CheckoutModal from "../components/CheckoutModal";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartCourses, setCartCourses] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  useEffect(() => {
    fetchStudentAndCart();
  }, []);

  const fetchStudentAndCart = async () => {
    try {
      // Fetch student data
      const studentRes = await axios.get(
        `${API_BASE}/api/v1/students/isstudent`,
        {
          withCredentials: true,
        }
      );

      if (studentRes.data.student) {
        setStudent(studentRes.data.student);
        const studentId = studentRes.data.student._id;

        // Fetch cart courses
        const cartRes = await axios.get(
          `${API_BASE}/api/v1/students/get-cart/${studentId}`,
          { withCredentials: true }
        );

        if (cartRes.data.cart && cartRes.data.cart.length > 0) {
          setCartCourses(cartRes.data.cart);
          const total = cartRes.data.cart.reduce(
            (sum, course) => sum + (course.price || 0),
            0
          );
          setTotalAmount(total);
        } else {
          // No courses in cart, redirect to courses page
          Swal.fire({
            title: "Cart Empty",
            text: "Your cart is empty. Add some courses to proceed to checkout.",
            icon: "info",
            confirmButtonText: "Browse Courses",
          }).then(() => {
            router.push("/courses");
          });
        }
      } else {
        // Not logged in, redirect to login
        Swal.fire({
          title: "Login Required",
          text: "Please login to proceed to checkout.",
          icon: "info",
          confirmButtonText: "Login",
        }).then(() => {
          router.push("/student-login?redirect=checkout");
        });
      }
    } catch (error) {
      console.error("Error fetching student and cart:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to load checkout data. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/courses");
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (courseId, sessionType = "recorded") => {
    try {
      const response = await axios.post(
        `${API_BASE}/api/v1/students/remove-cart/${student._id}`,
        { courseId, sessionType },
        { withCredentials: true }
      );

      if (response.data.message) {
        // Remove from local state
        setCartCourses((prev) =>
          prev.filter((course) => course._id !== courseId)
        );
        const newTotal = cartCourses
          .filter((course) => course._id !== courseId)
          .reduce((sum, course) => sum + (course.price || 0), 0);
        setTotalAmount(newTotal);

        Swal.fire({
          title: "Removed",
          text: "Course removed from cart",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to remove course from cart",
        icon: "error",
      });
    }
  };

  const handleOpenCheckout = () => {
    setShowCheckoutModal(true);
  };

  const handleCartUpdate = () => {
    fetchStudentAndCart();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Checkout</h1>
          <p className="text-gray-600">
            Review your order and complete payment
          </p>
        </div>

        {/* Cart Items */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Courses</h2>

          {cartCourses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Your cart is empty</p>
              <button
                onClick={() => router.push("/courses")}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Courses
              </button>
            </div>
          ) : (
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
                    <h3 className="font-semibold text-gray-800">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600">{course.category}</p>
                    <p className="text-lg font-bold text-green-600">
                      ₹{course.price?.toLocaleString() || "N/A"}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        handleRemoveFromCart(course._id, course.sessionType)
                      }
                      className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove from cart"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        {cartCourses.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              {cartCourses.map((course) => (
                <div key={course._id} className="flex justify-between">
                  <span className="text-gray-600">{course.title}</span>
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

            <div className="mt-6">
              <button
                onClick={handleOpenCheckout}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {showCheckoutModal && (
          <CheckoutModal
            isOpen={showCheckoutModal}
            onClose={() => setShowCheckoutModal(false)}
            cartCourses={cartCourses}
            student={student}
            onCartUpdate={handleCartUpdate}
          />
        )}
      </div>
    </div>
  );
}
