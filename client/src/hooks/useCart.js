import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const useCart = (student) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch cart items
  const fetchCart = useCallback(async () => {
    if (!student?._id) {
      console.log("No student ID, clearing cart");
      setCartItems([]);
      setCartCount(0);
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching cart for student:", student._id);
      const response = await axios.get(
        `${API_BASE}/api/v1/cart/get/${student._id}`,
        {
          withCredentials: true,
        }
      );

      console.log("Cart API response:", response.data);

      if (response.data.success) {
        const cartData = response.data.cart || [];
        const countData = response.data.cartCount || cartData.length;

        console.log("Setting cart items:", cartData);
        console.log("Setting cart count:", countData);

        setCartItems(cartData);
        setCartCount(countData);
      } else {
        console.log("Cart API returned success: false");
        setCartItems([]);
        setCartCount(0);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      console.error("Error details:", error.response?.data);
      setCartItems([]);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  }, [student?._id]);

  // Add item to cart
  const addToCart = async (courseId, sessionType) => {
    if (!student?._id) {
      throw new Error("Please login first");
    }

    try {
      setLoading(true);
      console.log("Adding to cart:", {
        courseId,
        sessionType,
        studentId: student._id,
      });

      const response = await axios.post(
        `${API_BASE}/api/v1/cart/add/${student._id}`,
        { courseId, sessionType },
        { withCredentials: true }
      );

      console.log("Add to cart response:", response.data);

      if (response.data.success) {
        console.log("Add to cart successful, refreshing cart...");
        await fetchCart(); // Refresh cart
        return response.data;
      } else {
        console.log("Add to cart failed:", response.data);
        throw new Error(response.data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      console.error("Error response:", error.response?.data);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update quantity
  const updateQuantity = async (courseId, sessionType, quantity) => {
    if (!student?._id) return;

    try {
      setLoading(true);
      console.log("Updating quantity:", {
        courseId,
        sessionType,
        quantity,
        studentId: student._id,
      });

      const response = await axios.put(
        `${API_BASE}/api/v1/cart/update/${student._id}`,
        { courseId, sessionType, quantity },
        { withCredentials: true }
      );

      console.log("Update quantity response:", response.data);

      if (response.data.success) {
        await fetchCart(); // Refresh cart
      } else {
        throw new Error(response.data.message || "Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      console.error("Error response:", error.response?.data);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (courseId, sessionType) => {
    if (!student?._id) return;

    try {
      setLoading(true);
      const response = await axios.delete(
        `${API_BASE}/api/v1/cart/remove/${student._id}`,
        {
          data: { courseId, sessionType },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        await fetchCart(); // Refresh cart
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!student?._id) return;

    try {
      setLoading(true);
      const response = await axios.delete(
        `${API_BASE}/api/v1/cart/clear/${student._id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setCartItems([]);
        setCartCount(0);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
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

      return total + price * item.quantity;
    }, 0);
  };

  // Load cart when student changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cartItems,
    cartCount,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
    getTotalPrice,
  };
};
