import express from "express";
import Student from "../models/Students.js";
import Course from "../models/Content/Course.js";

const router = express.Router();

// Add item to cart
router.post("/add/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const { courseId, sessionType } = req.body;

    console.log("Adding to cart:", { studentId, courseId, sessionType });

    const student = await Student.findById(studentId);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // Check if item already exists
    const existingItem = student.cart.find(
      (item) =>
        item.courseId.toString() === courseId &&
        item.sessionType === sessionType
    );

    if (existingItem) {
      // Don't increase quantity - just return success message
      const totalQuantity = student.cart.reduce(
        (sum, item) => sum + (item.quantity || 1),
        0
      );

      return res.json({
        success: true,
        message: "Item already in cart",
        cartCount: totalQuantity,
      });
    } else {
      // Add new item
      student.cart.push({
        courseId,
        sessionType,
        quantity: 1,
      });
    }

    await student.save();

    // Calculate total quantity (sum of all item quantities)
    const totalQuantity = student.cart.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );

    res.json({
      success: true,
      message: "Item added to cart",
      cartCount: totalQuantity,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ success: false, message: "Failed to add to cart" });
  }
});

// Get cart items
router.get("/get/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log("Getting cart for student:", studentId);

    const student = await Student.findById(studentId).populate("cart.courseId");

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    console.log("Raw student cart:", student.cart);

    const cartItems = student.cart.map((item) => {
      console.log("Processing cart item:", item);
      console.log("Course populated:", item.courseId);

      return {
        courseId: item.courseId._id,
        course: item.courseId,
        sessionType: item.sessionType,
        quantity: item.quantity || 1,
      };
    });

    console.log("Processed cart items:", cartItems);

    // Calculate total quantity (sum of all item quantities)
    const totalQuantity = cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    console.log("Total quantity:", totalQuantity);

    res.json({
      success: true,
      cart: cartItems,
      cartCount: totalQuantity,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ success: false, message: "Failed to get cart" });
  }
});

// Update quantity
router.put("/update/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const { courseId, sessionType, quantity } = req.body;

    console.log("Update quantity request:", {
      studentId,
      courseId,
      sessionType,
      quantity,
    });

    const student = await Student.findById(studentId);
    if (!student) {
      console.log("Student not found:", studentId);
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    console.log("Student cart before update:", student.cart);

    const cartItem = student.cart.find(
      (item) =>
        item.courseId.toString() === courseId &&
        item.sessionType === sessionType
    );

    if (!cartItem) {
      console.log("Cart item not found:", { courseId, sessionType });
      console.log(
        "Available cart items:",
        student.cart.map((item) => ({
          courseId: item.courseId.toString(),
          sessionType: item.sessionType,
        }))
      );
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    console.log("Found cart item:", cartItem);
    cartItem.quantity = quantity;
    await student.save();

    console.log("Quantity updated successfully");

    res.json({
      success: true,
      message: "Quantity updated",
    });
  } catch (error) {
    console.error("Update quantity error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update quantity" });
  }
});

// Remove item from cart
router.delete("/remove/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const { courseId, sessionType } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    student.cart = student.cart.filter(
      (item) =>
        !(
          item.courseId.toString() === courseId &&
          item.sessionType === sessionType
        )
    );

    await student.save();

    // Calculate total quantity (sum of all item quantities)
    const totalQuantity = student.cart.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );

    res.json({
      success: true,
      message: "Item removed from cart",
      cartCount: totalQuantity,
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to remove from cart" });
  }
});

// Clear entire cart
router.delete("/clear/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    student.cart = [];
    await student.save();

    res.json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ success: false, message: "Failed to clear cart" });
  }
});

export default router;
