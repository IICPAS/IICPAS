import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Transaction from "../models/Transaction.js";
import Booking from "../models/Booking.js";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate PDF receipt
const generateReceiptPDF = async (transactionData) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const fileName = `receipt_${transactionData.razorpay_order_id}.pdf`;
    const filePath = path.join(process.cwd(), "uploads", "receipts", fileName);

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // PDF content
    doc.fontSize(20).text("PAYMENT RECEIPT", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Receipt ID: ${transactionData.razorpay_order_id}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Time: ${new Date().toLocaleTimeString()}`);
    doc.moveDown();
    doc.text(`Email: ${transactionData.email}`);
    doc.text(`Training: ${transactionData.for}`);
    doc.text(`Amount: ₹${transactionData.amount}`);
    doc.text(`Payment ID: ${transactionData.razorpay_payment_id}`);
    doc.moveDown();
    doc.fontSize(10).text("Thank you for your payment!", { align: "center" });

    doc.end();

    stream.on("finish", () => {
      resolve(fileName);
    });

    stream.on("error", reject);
  });
};

// Send email with receipt
const sendReceiptEmail = async (email, fileName, transactionData) => {
  const filePath = path.join(process.cwd(), "uploads", "receipts", fileName);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Payment Receipt - LMS Booking",
    html: `
      <h2>Payment Successful!</h2>
      <p>Dear User,</p>
      <p>Your payment of ₹${transactionData.amount} for ${transactionData.for} has been processed successfully.</p>
      <p>Please find your receipt attached.</p>
      <p>Thank you for choosing our services!</p>
    `,
    attachments: [
      {
        filename: fileName,
        path: filePath,
      },
    ],
  };

  return transporter.sendMail(mailOptions);
};

router.post("/create-order", async (req, res) => {
  const { price, email, trainingTitle, category, hrs, type } = req.body;

  try {
    const options = {
      amount: Math.round(price * 100), // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
      notes: {
        email,
        trainingTitle,
        category,
        hrs,
        type,
      },
    };
    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  try {
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");
    if (expectedSignature === razorpay_signature) {
      // Fetch the order from Razorpay to get notes and amount
      const order = await razorpay.orders.fetch(razorpay_order_id);
      const { email, trainingTitle, category, hrs, type } = order.notes || {};
      const amount = order.amount ? order.amount / 100 : undefined;

      // Generate receipt PDF
      const receiptFileName = await generateReceiptPDF({
        email,
        amount,
        for: trainingTitle,
        razorpay_order_id,
        razorpay_payment_id,
      });

      // Send email with receipt
      await sendReceiptEmail(email, receiptFileName, {
        email,
        amount,
        for: trainingTitle,
        razorpay_order_id,
        razorpay_payment_id,
      });

      // Save transaction
      await Transaction.create({
        email,
        amount,
        for: trainingTitle,
        razorpay_order_id,
        razorpay_payment_id,
        status: "success",
        receiptLink: `/uploads/receipts/${receiptFileName}`,
      });

      // Create booking after successful payment
      const start = new Date();
      start.setHours(10, 0);
      const end = new Date(start.getTime() + 1 * 60 * 60 * 1000); // Default 1 hour

      await Booking.create({
        by: email,
        title: trainingTitle,
        hrs: hrs || 1, // Use from frontend, fallback to 1 hou
        status: "pending",
        type: type || "individual", // Use from frontend, fallback to individual
        category: category || "onsite", // Use from frontend, fallback to onsite
      });

      return res.json({ success: true });
    } else {
      return res
        .status(400)
        .json({ success: false, error: "Signature mismatch" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
