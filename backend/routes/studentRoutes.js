import Student from "../models/Students.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

//FOR PDF Import
import PDFDocument from "pdfkit";
import Course from "../models/Content/Course.js";
import fs from "fs-extra";
import nodemailer from "nodemailer";
import express from "express";

dotenv.config();

const createToken = (student) => {
  return jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const router = express.Router();

//Register Student
router.post("/register", async (req, res) => {
  const { name, email, phone, password, mode, location, center } = req.body;

  try {
    const existing = await Student.findOne({ email });
    console.log(existing);
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const student = new Student({
      name,
      email,
      phone,
      password: hashed,
      mode,
      location,
      center,
    });
    await student.save();

    res.status(201).json({ message: "Registered", student });
  } catch (err) {
    res.status(500).json({ error: "Register failed", details: err.message });
  }
});

//Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ message: "Not found" });

    const match = await bcrypt.compare(password, student.password);
    if (!match) return res.status(401).json({ message: "Wrong password" });

    const token = createToken(student);
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // only HTTPS in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // 'none' for cross-site, 'lax' for local dev
      })
      .json({ message: "Login success", student });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err.message });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
});

// isStudent
router.get("/isstudent", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ student: null });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.id);
    if (!student) return res.status(404).json({ student: null });

    res.json({ student });
  } catch {
    res.status(401).json({ student: null });
  }
});

/*---- Course buy Routes ----- */
const generateReceiptPDF = async (student, course, receiptId) => {
  const doc = new PDFDocument();
  const filePath = `./receipts/${receiptId}.pdf`;
  await fs.ensureDir("./receipts");
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("Course Receipt", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Receipt ID: ${receiptId}`);
  doc.text(`Name: ${student.name}`);
  doc.text(`Email: ${student.email}`);
  doc.text(`Course: ${course.title}`);
  doc.text(`Amount Paid: ₹${course.price}`);
  doc.text(`Date: ${new Date().toLocaleString()}`);

  doc.end();
  return filePath;
};

const sendReceiptEmail = async (email, pdfPath) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"LMS" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Course Purchase Receipt",
    text: "Thank you for your purchase. Find the receipt attached.",
    attachments: [{ filename: "receipt.pdf", path: pdfPath }],
  });
};

// === POST /course-buy/:studentId ===

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Set in .env
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const student = await Student.findOne({ email });
  if (!student) return res.status(404).json({ message: "Student not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  student.otp = otp;
  student.otpExpiry = Date.now() + 10 * 60 * 1000;
  await student.save();

  try {
    await transporter.sendMail({
      from: `"Codemap LMS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Password Reset",
      html: `<p>Hello ${student.name},</p><p>Your OTP is <b>${otp}</b>. It will expire in 10 minutes.</p>`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Error sending OTP email:", err);
    res.status(500).json({ message: "Failed to send OTP email" });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const student = await Student.findOne({ email, otp });

  if (!student || student.otpExpiry < Date.now())
    return res.status(400).json({ message: "OTP invalid or expired" });

  student.password = newPassword; // hash in production
  student.otp = undefined;
  student.otpExpiry = undefined;
  await student.save();

  res.json({ message: "Password reset successful" });
});

router.post("/course-buy/:id", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    if (decoded.id !== req.params.id)
      return res.status(403).json({ message: "Forbidden" });

    const student = await Student.findById(req.params.id);
    const course = await Course.findById(req.body.courseId);
    if (!student || !course)
      return res.status(404).json({ message: "Student or course not found" });

    const orderId = `ORDER-${Date.now()}`;
    const payload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantTransactionId: orderId,
      merchantUserId: student._id.toString(),
      amount: course.price * 100,
      redirectUrl: `${process.env.PHONEPE_CALLBACK_URL}/${student._id}?courseId=${course._id}`,
      redirectMode: "POST",
      callbackUrl: `${process.env.PHONEPE_CALLBACK_URL}/${student._id}?courseId=${course._id}`,
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
      "base64"
    );
    const checksum =
      base64Payload + "/pg/v1/pay" + process.env.PHONEPE_SALT_KEY;
    const xVerify =
      crypto.createHash("sha256").update(checksum).digest("hex") + "###1";

    const phonepeRes = await axios.post(
      `${process.env.PHONEPE_BASE_URL}/pg/v1/pay`,
      { request: base64Payload },
      {
        headers: {
          "Content-Type": "routerlication/json",
          "X-VERIFY": xVerify,
          "X-MERCHANT-ID": process.env.PHONEPE_MERCHANT_ID,
        },
      }
    );

    const redirectUrl =
      phonepeRes.data.data.instrumentResponse.redirectInfo.url;
    res.json({ redirectUrl });
  } catch (err) {
    res.status(500).json({ message: "Payment failed", error: err.message });
  }
});

// === POST /verify-buy/:studentId ===
router.post("/verify-buy/:id", async (req, res) => {
  const courseId = req.query.courseId;
  const { merchantUserId, code } = req.body.data;

  if (code !== "PAYMENT_SUCCESS") {
    return res.status(400).json({ message: "Payment failed" });
  }

  try {
    const student = await Student.findById(req.params.id);
    const course = await Course.findById(courseId);

    if (!student || !course)
      return res.status(404).json({ message: "Invalid student or course" });

    // Add course if not already bought
    if (!student.course.includes(courseId)) {
      student.course.push(courseId);
    }

    // Generate + email receipt
    const receiptId = `R-${Date.now()}`;
    const pdfPath = await generateReceiptPDF(student, course, receiptId);
    await sendReceiptEmail(student.email, pdfPath);

    // Save receipt
    student.receipts.push({ id: receiptId, file: pdfPath });
    await student.save();

    res.redirect("/payment-success"); // Or res.json({ message: "Verified" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Verification failed", error: err.message });
  }
});

// --- GET /list-receipts/:studentId ---
router.get("/list-receipts/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({ receipts: student.receipts });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch receipts", error: err.message });
  }
});

// --- Serve/download receipt file ---
router.get("/download-receipt/:receiptId", async (req, res) => {
  try {
    const { receiptId } = req.params;
    const filePath = path.resolve(`./receipts/${receiptId}.pdf`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    res.download(filePath, `receipt-${receiptId}.pdf`);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to download receipt", error: err.message });
  }
});

router.post("/session-buy/:id", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    if (decoded.id !== req.params.id)
      return res.status(403).json({ message: "Forbidden" });

    const student = await Student.findById(req.params.id);
    const session = await LiveSession.findById(req.body.sessionId);
    if (!student || !session)
      return res.status(404).json({ message: "Invalid data" });

    const orderId = `SESSION-${Date.now()}`;
    const payload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantTransactionId: orderId,
      merchantUserId: student._id.toString(),
      amount: session.price * 100,
      redirectUrl: `${process.env.PHONEPE_CALLBACK_URL}/${student._id}?sessionId=${session._id}`,
      redirectMode: "POST",
      callbackUrl: `${process.env.PHONEPE_CALLBACK_URL}/${student._id}?sessionId=${session._id}`,
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const base64 = Buffer.from(JSON.stringify(payload)).toString("base64");
    const checksum = base64 + "/pg/v1/pay" + process.env.PHONEPE_SALT_KEY;
    const xVerify =
      crypto.createHash("sha256").update(checksum).digest("hex") + "###1";

    const payRes = await axios.post(
      `${process.env.PHONEPE_BASE_URL}/pg/v1/pay`,
      { request: base64 },
      {
        headers: {
          "X-VERIFY": xVerify,
          "X-MERCHANT-ID": process.env.PHONEPE_MERCHANT_ID,
          "Content-Type": "routerlication/json",
        },
      }
    );

    res.json({
      redirectUrl: payRes.data.data.instrumentResponse.redirectInfo.url,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Verufy session buy

router.post("/verify-session-buy/:id", async (req, res) => {
  const { code, merchantUserId } = req.body.data;
  const sessionId = req.query.sessionId;

  if (code !== "PAYMENT_SUCCESS") {
    return res.status(400).json({ message: "Payment failed" });
  }

  try {
    const student = await Student.findById(req.params.id);
    const session = await LiveSession.findById(sessionId);
    if (!student || !session)
      return res.status(404).json({ message: "Invalid session or student" });

    const receiptId = `SESSION-R-${Date.now()}`;
    const pdfPath = await generateReceiptPDF(
      student,
      {
        title: session.title,
        price: session.price,
      },
      receiptId
    );
    await sendReceiptEmail(student.email, pdfPath);

    student.receipts.push({ id: receiptId, file: pdfPath });
    await student.save();

    res.redirect("/payment-success");
  } catch (err) {
    res
      .status(500)
      .json({ message: "Verification failed", error: err.message });
  }
});

router.get("/get-cart/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    console.log(student);
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({ cart: student.cart || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Ticket By Id

router.post("/ticket/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const { message } = req.body;
    if (!message)
      return res.status(400).json({ message: "Message is required" });

    const ticket = new Ticket({
      name: student.name,
      email: student.email,
      phone: student.phone,
      message,
      resolve: "",
    });

    await ticket.save();
    res.json({ message: "Ticket submitted", ticket });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Ticket creation failed", error: err.message });
  }
});

router.patch("/student/profile/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const { phone, mode, location, center, password } = req.body;

    // Allow only certain fields to update
    if (phone) student.phone = phone;
    if (mode) student.mode = mode;
    if (location) student.location = location;
    if (center) student.center = center;

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      student.password = hashed;
    }

    await student.save();
    res.json({ message: "Profile updated successfully", student });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

router.post("/add-to-cart/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const { courseId } = req.body;
    if (!courseId)
      return res.status(400).json({ message: "courseId is required" });

    if (student.cart.includes(courseId)) {
      return res.status(400).json({ message: "Course already in cart" });
    }

    student.cart.push(courseId);
    await student.save();

    res.json({ message: "Course added to cart", cart: student.cart });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add to cart", error: err.message });
  }
});

router.post("/remove-cart/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const { courseId } = req.body;
    if (!courseId)
      return res.status(400).json({ message: "courseId is required" });

    const index = student.cart.indexOf(courseId);
    if (index === -1)
      return res.status(404).json({ message: "Course not in cart" });

    student.cart.splice(index, 1);
    await student.save();

    res.json({ message: "Course removed from cart", cart: student.cart });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to remove from cart", error: err.message });
  }
});

router.delete("/clear-cart/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.cart = [];
    await student.save();

    res.json({ message: "Cart cleared successfully", cart: [] });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to clear cart", error: err.message });
  }
});

router.get("/student/:id/courses", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("course");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ enrolledCourses: student.course });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch courses", error: err.message });
  }
});

// GET /api/v1/students/list-courses/:id
router.get("/list-courses/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const enrolledCourses = await Course.find({
      _id: { $in: student.courses },
    }).populate({
      path: "chapters",
      populate: {
        path: "topics",
        populate: {
          path: "quiz",
        },
      },
    });

    res.json({ courses: enrolledCourses });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch enrolled courses",
      error: err.message,
    });
  }
});

export default router;
