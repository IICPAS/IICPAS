import express from "express";
import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const {
  MERCHANT_ID,
  SALT_KEY,
  SALT_INDEX,
  BASE_URL,
  REDIRECT_URL,
  CALLBACK_URL,
  CLIENT_ID,
  CLIENT_SECRET,
} = process.env;

const encodePayload = (data) =>
  Buffer.from(JSON.stringify(data)).toString("base64");

const generateXVerify = (payload, path) => {
  const fullString = payload + path + SALT_KEY;
  const hash = crypto.createHash("sha256").update(fullString).digest("hex");
  return `${hash}###${SALT_INDEX}`;
};

// 🔐 Fetch access token (v2 APIs)
const getAccessToken = async () => {
  const data = new URLSearchParams({
    grantType: "client_credentials",
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    clientVersion: "1", // Always 1 for now
  });

  try {
    const res = await axios.post(`${BASE_URL}/oauth2/token`, data.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return res.data.accessToken; // ⬅️ returns just the token
  } catch (err) {
    console.error("❌ Failed to get access token:", err.response?.data || err);
    throw new Error("Failed to get access token");
  }
};

// 🔹 POST /api/v1/payment/initiate-payment
router.post("/initiate-payment", async (req, res) => {
  const { amount, transactionId } = req.body;

  const paymentData = {
    merchantId: MERCHANT_ID,
    transactionId,
    merchantUserId: "guest_user",
    amount: amount * 100,
    redirectUrl: REDIRECT_URL,
    redirectMode: "POST",
    callbackUrl: CALLBACK_URL,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const payload = encodePayload(paymentData);
  const xVerify = generateXVerify(payload, "/pg/v1/pay");

  try {
    const accessToken = await getAccessToken(); // 🔑 get token

    const response = await axios.post(
      `${BASE_URL}/pg/v1/pay`,
      { request: payload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerify,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const redirectUrl = response.data.data.instrumentResponse.redirectInfo.url;
    res.json({ success: true, redirectUrl });
  } catch (err) {
    console.error(
      "❌ Payment initiation failed:",
      err.response?.data || err.message
    );
    res
      .status(500)
      .json({ success: false, error: "Payment initiation failed" });
  }
});

// 🔹 GET /api/v1/payment/check-status/:transactionId
router.get("/check-status/:transactionId", async (req, res) => {
  const { transactionId } = req.params;
  const path = `/pg/v1/status/${MERCHANT_ID}/${transactionId}`;
  const xVerify = generateXVerify("", path);

  try {
    const accessToken = await getAccessToken(); // 🔑 token for secure API

    const response = await axios.get(`${BASE_URL}${path}`, {
      headers: {
        "X-VERIFY": xVerify,
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.json({ success: true, data: response.data });
  } catch (err) {
    console.error("❌ Status check failed:", err.response?.data || err.message);
    res.status(500).json({ success: false, error: "Status check failed" });
  }
});

// 🔹 POST /api/v1/payment/payment-callback
router.post("/payment-callback", (req, res) => {
  console.log("📩 PhonePe callback received:", req.body);
  res.sendStatus(200);
});

export default router;
