import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaEye,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const OrderHistoryModal = ({ isOpen, onClose, center }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/kit-orders/center-orders`,
        { withCredentials: true }
      );
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load order history");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock className="text-yellow-500" />;
      case "approved":
      case "processing":
      case "shipped":
      case "delivered":
        return <FaCheckCircle className="text-green-500" />;
      case "rejected":
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
            <p className="text-sm text-gray-600">View all your kit orders</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-500 text-xl" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading orders...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold">
                        Order #{order._id.slice(-8)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                      {getStatusIcon(order.status)}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        ₹{order.totals.payable}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(order.orderDate)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Course Type:</span>{" "}
                      {order.courseType}
                    </div>
                    <div>
                      <span className="font-medium">Total Items:</span>{" "}
                      {order.totals.totalQuantity}
                    </div>
                    <div>
                      <span className="font-medium">Items:</span>{" "}
                      {order.items.length}
                    </div>
                  </div>

                  {order.adminRemarks && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium text-blue-800">
                        Admin Remarks:
                      </span>
                      <p className="text-blue-700 mt-1">{order.adminRemarks}</p>
                    </div>
                  )}

                  {order.shippingDetails?.trackingNumber && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-green-800">
                            Tracking:
                          </span>
                          <p className="text-green-700">
                            {order.shippingDetails.trackingNumber}
                          </p>
                          <p className="text-green-600 text-sm">
                            {order.shippingDetails.courierName}
                          </p>
                        </div>
                        {order.shippingDetails.estimatedDelivery && (
                          <div className="text-right">
                            <span className="text-sm text-green-600">
                              Est. Delivery:
                            </span>
                            <p className="text-green-700">
                              {formatDate(
                                order.shippingDetails.estimatedDelivery
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() =>
                        setSelectedOrder(
                          selectedOrder?._id === order._id ? null : order
                        )
                      }
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      <FaEye />
                      {selectedOrder?._id === order._id
                        ? "Hide Details"
                        : "View Details"}
                    </button>
                  </div>

                  {selectedOrder?._id === order._id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-3">Order Details</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span>{item.courseName}</span>
                            <span className="font-medium">
                              ₹{item.total} ({item.quantity} × ₹{item.price})
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t mt-3 pt-3">
                        <div className="flex justify-between text-sm">
                          <span>Gross Total:</span>
                          <span>₹{order.totals.grossTotal}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Discount:</span>
                          <span>-₹{order.totals.bulkDiscountAmount}</span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold">
                          <span>Final Amount:</span>
                          <span>₹{order.totals.payable}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryModal;

