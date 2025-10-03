// Test script for PDF receipt generation
import { generateReceiptPDF } from "./utils/pdfReceiptGenerator.js";

// Mock transaction data for testing
const mockTransaction = {
  _id: { toString: () => "507f1f77bcf86cd799439011" },
  studentId: {
    name: "Test Student",
    email: "test@example.com",
  },
  courseId: {
    title: "Test Course",
    category: "Testing",
    price: 5000,
  },
  sessionType: "recorded",
  amount: 4750,
  utrNumber: "TEST-UTR-123456",
  additionalNotes: "Test payment receipt",
  status: "approved",
  adminNotes: "Test approval",
  approvedBy: "test-admin",
  createdAt: new Date(),
  updatedAt: new Date(),
};

try {
  console.log("🔄 Generating test PDF receipt...");

  const pdfBuffer = await generateReceiptPDF(mockTransaction);

  console.log("✅ PDF generated successfully!");
  console.log(`📄 PDF size: ${pdfBuffer.length} bytes`);

  // Optionally save to file for inspection
  const fs = await import("fs");
  const filename = `test-receipt-${Date.now()}.pdf`;
  fs.writeFileSync(filename, pdfBuffer);
  console.log(`💾 PDF saved as: ${filename}`);

  console.log("🎉 PDF receipt generation test completed successfully!");
} catch (error) {
  console.error("❌ Error generating PDF:", error.message);
  process.exit(1);
}
