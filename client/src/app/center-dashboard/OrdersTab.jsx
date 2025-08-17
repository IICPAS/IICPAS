import React, { useState, useEffect } from "react";
import { FaShareAlt, FaEye, FaDownload, FaSearch } from "react-icons/fa";
import axios from "axios";

export default function OrdersTab({ center }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch orders data
    const fetchOrders = async () => {
      try {
        // This would be replaced with actual API call
        // const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/centers/orders`, {
        //   withCredentials: true,
        // });
        // setOrders(res.data.orders);
        
        // Mock data for now
        setOrders([
          {
            id: "ORD001",
            date: "2024-08-15",
            status: "Delivered",
            total: 2500,
            items: 3,
            paymentStatus: "Paid"
          },
          {
            id: "ORD002", 
            date: "2024-08-14",
            status: "Processing",
            total: 1800,
            items: 2,
            paymentStatus: "Pending"
          },
          {
            id: "ORD003",
            date: "2024-08-13", 
            status: "Shipped",
            total: 3200,
            items: 4,
            paymentStatus: "Paid"
          }
        ]);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <main className="flex-1 px-8 py-6 bg-white">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-8 py-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-2xl font-bold text-blue-700 flex items-center">
          Orders <FaShareAlt className="ml-2 text-blue-600 cursor-pointer" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-blue-700 cursor-pointer">
            GNAAGBN
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Export
          </button>
          <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            Filter
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Order ID</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Date</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Items</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Total</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Payment</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <tr key={order.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 font-medium text-blue-600">{order.id}</td>
                    <td className="px-6 py-4 text-gray-700">{order.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{order.items}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">₹{order.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                          <FaDownload className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'No orders found matching your search.' : 'No orders found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow border p-4">
          <div className="text-sm text-gray-600">Total Orders</div>
          <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4">
          <div className="text-sm text-gray-600">Total Revenue</div>
          <div className="text-2xl font-bold text-green-600">
            ₹{orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4">
          <div className="text-sm text-gray-600">Pending Orders</div>
          <div className="text-2xl font-bold text-yellow-600">
            {orders.filter(order => order.status === 'Processing').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4">
          <div className="text-sm text-gray-600">Delivered Orders</div>
          <div className="text-2xl font-bold text-green-600">
            {orders.filter(order => order.status === 'Delivered').length}
          </div>
        </div>
      </div>
    </main>
  );
}
