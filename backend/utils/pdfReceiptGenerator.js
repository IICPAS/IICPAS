import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

export const generateReceiptPDF = async (transaction) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Payment Receipt</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #003057;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #003057;
          margin-bottom: 10px;
        }
        .receipt-title {
          font-size: 28px;
          color: #003057;
          margin: 0;
        }
        .receipt-subtitle {
          color: #666;
          margin: 5px 0 0 0;
          font-size: 14px;
        }
        .content {
          max-width: 600px;
          margin: 0 auto;
        }
        .transaction-info {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: bold;
          color: #555;
        }
        .value {
          color: #333;
        }
        .amount {
          color: #28a745;
          font-weight: bold;
        }
        .status {
          color: #28a745;
          font-weight: bold;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
        .utr-box {
          background: #f8f9fa;
          border: 2px dashed #dee2e6;
          padding: 15px;
          text-align: center;
          margin: 15px 0;
          border-radius: 5px;
        }
        .utr-number {
          font-family: monospace;
          font-size: 18px;
          font-weight: bold;
          color: #003057;
        }
        @media print {
          body { margin: 0; padding: 15px; }
          .content { max-width: none; }
        }
      </style>
    </head>
    <body>
      <div class="content">
        <div class="header">
          <div class="logo">IICPAS INSTITUTE</div>
          <h1 class="receipt-title">Payment Receipt</h1>
          <p class="receipt-subtitle">Transaction Receipt & Confirmation</p>
        </div>

        <div class="transaction-info">
          <div class="info-row">
            <span class="label">Receipt Number:</span>
            <span class="value">#${transaction._id
              .toString()
              .slice(-8)
              .toUpperCase()}</span>
          </div>
          <div class="info-row">
            <span class="label">Transaction Date:</span>
            <span class="value">${new Date(
              transaction.createdAt
            ).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}</span>
          </div>
          <div class="info-row">
            <span class="label">Student Name:</span>
            <span class="value">${transaction.studentId?.name || "N/A"}</span>
          </div>
          <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">${transaction.studentId?.email || "N/A"}</span>
          </div>
          <div class="info-row">
            <span class="label">Course:</span>
            <span class="value">${transaction.courseId?.title || "N/A"}</span>
          </div>
          <div class="info-row">
            <span class="label">Session Type:</span>
            <span class="value">${
              transaction.sessionType.charAt(0).toUpperCase() +
              transaction.sessionType.slice(1)
            }</span>
          </div>
          <div class="info-row">
            <span class="label">Payment Amount:</span>
            <span class="value amount">Rs. ${
              transaction.amount?.toLocaleString("en-IN") || "N/A"
            }</span>
          </div>
          <div class="info-row">
            <span class="label">Payment Status:</span>
            <span class="value status">${
              transaction.status.charAt(0).toUpperCase() +
              transaction.status.slice(1)
            }</span>
          </div>
          ${
            transaction.approvedBy
              ? `
          <div class="info-row">
            <span class="label">Approved By:</span>
            <span class="value">${transaction.approvedBy}</span>
          </div>
          `
              : ""
          }
        </div>

        <div class="utr-box">
          <div style="font-weight: bold; margin-bottom: 5px; color: #666;">Unique Transaction Reference (UTR)</div>
          <div class="utr-number">${transaction.utrNumber || "N/A"}</div>
        </div>

        ${
          transaction.adminNotes
            ? `
        <div class="info-row">
          <span class="label">Admin Notes:</span>
          <span class="value">${transaction.adminNotes}</span>
        </div>
        `
            : ""
        }

        ${
          transaction.additionalNotes
            ? `
        <div class="info-row">
          <span class="label">Student Notes:</span>
          <span class="value">${transaction.additionalNotes}</span>
        </div>
        `
            : ""
        }

        <div class="footer">
          <p>Thank you for your payment! This receipt confirms your successful payment for IICPAS Institute course.</p>
          <p>For any queries, please contact us at support@iicpas.com or call +91-9876543210</p>
          <p><strong>This is a system-generated receipt. Please keep this for your records.</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "15mm",
        bottom: "20mm",
        left: "15mm",
      },
    });

    return pdfBuffer;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
