import express from "express";
import { KitOrder } from "../models/KitOrder.js";
import { Center } from "../models/Center.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify center authentication
const verifyCenter = async (req, res, next) => {
  const token = req.cookies.centerToken;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const center = await Center.findById(decoded.id);

    if (!center) {
      return res.status(401).json({ message: "Center not found" });
    }

    req.center = center;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Create new kit order
router.post("/create", verifyCenter, async (req, res) => {
  try {
    const { courseType, items, totals, walletBalance } = req.body;

    // Validate order data
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    if (totals.payable > walletBalance) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // Create the order
    const kitOrder = new KitOrder({
      centerId: req.center._id,
      centerName: req.center.name,
      courseType,
      items,
      totals,
      walletBalance,
    });

    await kitOrder.save();

    res.status(201).json({
      message: "Kit order created successfully. Awaiting admin approval.",
      order: {
        id: kitOrder._id,
        status: kitOrder.status,
        orderDate: kitOrder.orderDate,
        totalAmount: kitOrder.totals.payable,
      },
    });
  } catch (error) {
    console.error("Kit order creation error:", error);
    res.status(500).json({
      message: "Failed to create kit order",
      error: error.message,
    });
  }
});

// Get center's kit orders
router.get("/center-orders", verifyCenter, async (req, res) => {
  try {
    const orders = await KitOrder.find({ centerId: req.center._id })
      .sort({ orderDate: -1 })
      .select("-__v");

    res.json({ orders });
  } catch (error) {
    console.error("Get center orders error:", error);
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

// Get specific order details
router.get("/order/:orderId", verifyCenter, async (req, res) => {
  try {
    const order = await KitOrder.findOne({
      _id: req.params.orderId,
      centerId: req.center._id,
    }).select("-__v");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ order });
  } catch (error) {
    console.error("Get order details error:", error);
    res.status(500).json({
      message: "Failed to fetch order details",
      error: error.message,
    });
  }
});

// Cancel order (only if pending)
router.patch("/cancel/:orderId", verifyCenter, async (req, res) => {
  try {
    const order = await KitOrder.findOne({
      _id: req.params.orderId,
      centerId: req.center._id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Cannot cancel order. Order is already being processed.",
      });
    }

    order.status = "cancelled";
    await order.save();

    res.json({
      message: "Order cancelled successfully",
      order: {
        id: order._id,
        status: order.status,
      },
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({
      message: "Failed to cancel order",
      error: error.message,
    });
  }
});

// Admin: Get all kit orders
router.get("/admin/all", async (req, res) => {
  try {
    const orders = await KitOrder.find({})
      .populate("centerId", "name email phone")
      .populate("processedBy", "name email")
      .sort({ orderDate: -1 })
      .select("-__v");

    res.json({ orders });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

// Admin: Update order status
router.patch("/admin/update-status/:orderId", async (req, res) => {
  try {
    const { status, adminRemarks, shippingDetails } = req.body;

    const order = await KitOrder.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    if (adminRemarks) order.adminRemarks = adminRemarks;
    if (shippingDetails) order.shippingDetails = shippingDetails;

    if (status !== "pending") {
      order.processedAt = new Date();
      // TODO: Add admin ID from session
      // order.processedBy = req.admin._id;
    }

    await order.save();

    res.json({
      message: "Order status updated successfully",
      order: {
        id: order._id,
        status: order.status,
        adminRemarks: order.adminRemarks,
      },
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
});

// Get order statistics
router.get("/stats", verifyCenter, async (req, res) => {
  try {
    const stats = await KitOrder.aggregate([
      { $match: { centerId: req.center._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totals.payable" },
        },
      },
    ]);

    const totalOrders = await KitOrder.countDocuments({
      centerId: req.center._id,
    });
    const totalSpent = await KitOrder.aggregate([
      {
        $match: {
          centerId: req.center._id,
          status: { $in: ["approved", "processing", "shipped", "delivered"] },
        },
      },
      { $group: { _id: null, total: { $sum: "$totals.payable" } } },
    ]);

    res.json({
      stats,
      totalOrders,
      totalSpent: totalSpent[0]?.total || 0,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      message: "Failed to fetch statistics",
      error: error.message,
    });
  }
});

export default router;

