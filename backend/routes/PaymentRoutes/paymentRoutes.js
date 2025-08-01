import express from "express";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
import pg from "pg-sdk-node";

dotenv.config();

const { StandardCheckoutClient, Env, StandardCheckoutPayRequest } = pg;

const {
  CLIENT_ID,
  CLIENT_SECRET,
  CLIENT_VERSION,
  BASE_URL_BACKEND,
  CLIENT_URL,
} = process.env;

// Validate required environment variables
const validateEnvVars = () => {
  const missing = [];
  if (!CLIENT_ID) missing.push("CLIENT_ID");
  if (!CLIENT_SECRET) missing.push("CLIENT_SECRET");
  if (!CLIENT_VERSION) missing.push("CLIENT_VERSION");
  if (!BASE_URL_BACKEND) missing.push("BASE_URL_BACKEND");
  if (!CLIENT_URL) missing.push("CLIENT_URL");

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
};

// Initialize environment and client
let env, client;

try {
  validateEnvVars();
  env = Env.SANDBOX; // or Env.PRODUCTION for live
  client = StandardCheckoutClient.getInstance(
    CLIENT_ID,
    CLIENT_SECRET,
    CLIENT_VERSION,
    env
  );
  console.log("✅ PhonePe SDK initialized successfully");
} catch (error) {
  console.error("❌ PhonePe SDK initialization failed:", error.message);
}

const router = express.Router();

// ✅ Create payment order
router.post("/create-order", async (req, res) => {
  try {
    // Check if client is initialized
    if (!client) {
      return res.status(500).json({
        error: "Payment service not initialized. Check environment variables.",
      });
    }

    const { value } = req.body;

    if (!value || isNaN(value)) {
      return res.status(400).json({ error: "Valid amount is required" });
    }

    console.log("💰 Creating payment order for amount:", value);

    const merchantOrderId = randomUUID();
    const redirectUrl = `${BASE_URL_BACKEND.replace(
      /\/$/,
      ""
    )}/api/v1/payments/check-status?merchantOrderId=${merchantOrderId}`;
    console.log("🔄 Redirect URL:", redirectUrl);

    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(parseFloat(value))
      .redirectUrl(redirectUrl)
      .build();

    console.log("📤 Payment request:", JSON.stringify(request, null, 2));

    const response = await client.pay(request);
    console.log("✅ Payment order created successfully");

    return res.json({
      success: true,
      checkOutPageUrl: response.redirectUrl,
      merchantOrderId: merchantOrderId,
    });
  } catch (err) {
    console.error("❌ Error creating order:", err.message || err);
    return res.status(500).json({
      error: "Payment order creation failed",
      details: err.message,
    });
  }
});

// ✅ Check payment status
router.get("/check-status", async (req, res) => {
  try {
    // Check if client is initialized
    if (!client) {
      return res.status(500).json({
        error: "Payment service not initialized. Check environment variables.",
      });
    }

    const { merchantOrderId } = req.query;

    if (!merchantOrderId) {
      return res.status(400).json({ error: "Merchant Order ID is required" });
    }

    console.log("🔍 Checking payment status for:", merchantOrderId);

    const response = await client.getOrderStatus(merchantOrderId);
    const status = response.state;

    console.log("📊 Payment status:", status);

    if (status === "COMPLETED") {
      return res.redirect(`${CLIENT_URL}/success`);
    } else {
      return res.redirect(`${CLIENT_URL}/failure`);
    }
  } catch (err) {
    console.error("❌ Error checking payment status:", err.message || err);
    return res.status(500).json({
      error: "Error retrieving payment status",
      details: err.message,
    });
  }
});

// Health check endpoint
router.get("/health", (req, res) => {
  const health = {
    status: client ? "healthy" : "unhealthy",
    environment: env === Env.SANDBOX ? "sandbox" : "production",
    timestamp: new Date().toISOString(),
    envVars: {
      CLIENT_ID: CLIENT_ID ? "set" : "missing",
      CLIENT_SECRET: CLIENT_SECRET ? "set" : "missing",
      CLIENT_VERSION: CLIENT_VERSION ? "set" : "missing",
      BASE_URL_BACKEND: BASE_URL_BACKEND ? "set" : "missing",
      CLIENT_URL: CLIENT_URL ? "set" : "missing",
    },
  };

  res.json(health);
});

export default router;
