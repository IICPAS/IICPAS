import React, { useState, useEffect } from "react";
import { FaTimes, FaWallet, FaCreditCard } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const KitOrderModal = ({ isOpen, onClose, center }) => {
  const [courseType, setCourseType] = useState("Classroom");
  const [quantities, setQuantities] = useState({});
  const [walletBalance, setWalletBalance] = useState(10000);

  // Course data with kit prices
  const courses = [
    {
      id: 1,
      name: "Basic Accounting & Tally Foundation (Level 1)",
      price: 450,
    },
    { id: 2, name: "Microsoft Excel (Level 1)", price: 270 },
    { id: 3, name: "Payroll or Salary Statement (Level 1)", price: 270 },
    { id: 4, name: "Income Tax Computation (Level 1)", price: 450 },
    { id: 5, name: "TDS Computation (Level 1)", price: 360 },
    { id: 6, name: "GST Computation (Level 1)", price: 450 },
    { id: 7, name: "GST Return Filing (Level 1)", price: 450 },
    { id: 8, name: "Tally Advanced (Level 2)", price: 450 },
    { id: 9, name: "ITR Filing (Individual) (Level 2)", price: 450 },
    { id: 10, name: "TDS Return Filing (Level 2)", price: 450 },
    { id: 11, name: "PF & ESI Return Filing (Level 2)", price: 450 },
    { id: 12, name: "Business Taxation (Level 2)", price: 450 },
    { id: 13, name: "Financial Statements & MIS (Level 2)", price: 450 },
    { id: 14, name: "Microsoft Word", price: 180 },
    { id: 15, name: "Microsoft Powerpoint", price: 225 },
    {
      id: 16,
      name: "Communication Skills and Personality Development",
      price: 600,
    },
  ];

  // Calculate totals
  const totalQuantity = Object.values(quantities).reduce(
    (sum, qty) => sum + (parseInt(qty) || 0),
    0
  );
  const grossTotal = courses.reduce((sum, course) => {
    const qty = parseInt(quantities[course.id]) || 0;
    return sum + course.price * qty;
  }, 0);

  // Calculate discounts
  const bulkDiscountPercent =
    totalQuantity >= 10 ? 10 : totalQuantity >= 5 ? 5 : 0;
  const bulkDiscountAmount = (grossTotal * bulkDiscountPercent) / 100;
  const discountedPrice = grossTotal - bulkDiscountAmount;

  // Calculate combination discounts (example logic)
  const combinationDiscounts = 0; // This would be calculated based on specific course combinations
  const netKitPrice = discountedPrice - combinationDiscounts;
  const payable = Math.max(0, netKitPrice);

  const handleQuantityChange = (courseId, value) => {
    const numValue = parseInt(value) || 0;
    setQuantities((prev) => ({
      ...prev,
      [courseId]: numValue >= 0 ? numValue : 0,
    }));
  };

  const handleOrder = async () => {
    if (totalQuantity === 0) {
      toast.error("Please select at least one kit to order");
      return;
    }

    if (payable > walletBalance) {
      toast.error("Insufficient wallet balance. Please add more funds.");
      return;
    }

    try {
      const orderData = {
        courseType,
        items: courses
          .map((course) => ({
            courseId: course.id,
            courseName: course.name,
            quantity: parseInt(quantities[course.id]) || 0,
            price: course.price,
            total: (parseInt(quantities[course.id]) || 0) * course.price,
          }))
          .filter((item) => item.quantity > 0),
        totals: {
          totalQuantity,
          grossTotal,
          bulkDiscountPercent,
          bulkDiscountAmount,
          discountedPrice,
          combinationDiscounts,
          netKitPrice,
          payable,
        },
        walletBalance,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/kit-orders/create`,
        orderData,
        { withCredentials: true }
      );

      toast.success(response.data.message);
      onClose();
    } catch (error) {
      console.error("Order failed:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <FaWallet className="text-green-600 text-xl" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Order Kits</h2>
              <p className="text-sm text-gray-600">
                Available Wallet: ₹{walletBalance.toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-500 text-xl" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-140px)]">
          {/* Left Side - Course List */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Course Type Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Course Type</h3>
              <div className="flex gap-4">
                {["Classroom", "Recorded", "Live"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="courseType"
                      value={type}
                      checked={courseType === type}
                      onChange={(e) => setCourseType(e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="font-medium">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Course Table */}
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Course
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Kit Price
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course, index) => {
                    const qty = parseInt(quantities[course.id]) || 0;
                    const price = course.price * qty;
                    return (
                      <tr
                        key={course.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-3 text-sm">{course.name}</td>
                        <td className="px-4 py-3 text-sm">₹{course.price}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            value={quantities[course.id] || ""}
                            onChange={(e) =>
                              handleQuantityChange(course.id, e.target.value)
                            }
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          ₹{price}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="w-80 bg-gray-50 p-6 border-l">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Total Quantity:</span>
                <input
                  type="text"
                  value={totalQuantity}
                  readOnly
                  className="w-20 px-2 py-1 border border-gray-300 rounded bg-white text-right"
                />
              </div>

              <div className="flex justify-between">
                <span>Gross Total:</span>
                <span className="font-medium">₹{grossTotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Discounted Price:</span>
                <span className="font-medium">₹{discountedPrice}</span>
              </div>

              <div className="flex justify-between">
                <span>Bulk Order Discount %:</span>
                <span className="font-medium">{bulkDiscountPercent}%</span>
              </div>

              <div className="flex justify-between">
                <span>Bulk Order Discount Amount:</span>
                <span className="font-medium">₹{bulkDiscountAmount}</span>
              </div>

              <div className="flex justify-between">
                <span>Net Price:</span>
                <input
                  type="text"
                  value={netKitPrice}
                  readOnly
                  className="w-20 px-2 py-1 border border-gray-300 rounded bg-white text-right"
                />
              </div>

              <div className="flex justify-between">
                <span>Wallet Available:</span>
                <span className="font-medium">₹{walletBalance}</span>
              </div>

              <div className="flex justify-between">
                <span>Combination Discounts:</span>
                <span className="font-medium">-₹{combinationDiscounts}</span>
              </div>

              <div className="flex justify-between">
                <span>Net Kit Price:</span>
                <span className="font-medium">-₹{netKitPrice}</span>
              </div>

              <div className="flex justify-between font-semibold text-lg border-t pt-3">
                <span>Payable:</span>
                <input
                  type="text"
                  value={payable}
                  readOnly
                  className="w-20 px-2 py-1 border border-gray-300 rounded bg-white text-right font-semibold"
                />
              </div>
            </div>

            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Pay through UPI/Card/EMI/Net Banking etc. and place Order.
              </p>
            </div>

            <button
              onClick={handleOrder}
              disabled={totalQuantity === 0 || payable > walletBalance}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitOrderModal;
