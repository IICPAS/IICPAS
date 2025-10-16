import nodemailer from "nodemailer";
import {
  emailConfig,
  isEmailConfigured,
  setupEmailInstructions,
} from "../config/emailConfig.js";

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport(emailConfig);
};

// Send receipt email with PDF attachment
export const sendReceiptEmail = async (transaction, pdfBuffer) => {
  try {
    // Check if email is properly configured
    if (!isEmailConfigured()) {
      console.warn(
        "Email not properly configured. Showing setup instructions..."
      );
      setupEmailInstructions();

      // For development/testing, just mark as sent without actually sending
      // In production, you should throw an error
      return {
        success: true,
        emailSent: false,
        email: transaction.studentId?.email,
        messageId: "simulated-" + Date.now(),
        message: "Email not configured - simulated send for development",
      };
    }

    const transporter = createTransporter();

    // Test email configuration
    await transporter.verify();

    const studentName = transaction.studentId?.name || "Student";
    const studentEmail = transaction.studentId?.email;
    const courseName = transaction.courseId?.title || "Course";
    const amount = transaction.amount;

    if (!studentEmail) {
      throw new Error("Student email not found");
    }

    const mailOptions = {
      from: {
        name: "IICPAS Institute",
        address: emailConfig.auth.user,
      },
      to: studentEmail,
      subject: `Payment Receipt - Rs. ${amount?.toLocaleString(
        "en-IN"
      )} - ${courseName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #003057; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">IICPAS INSTITUTE</h1>
            <p style="margin: 5px 0 0 0; font-size: 16px;">Payment Receipt Confirmation</p>
          </div>
          
          <div style="padding: 20px; background: #f8f9fa;">
            <h2 style="color: #003057; margin-bottom: 15px;">Dear ${studentName},</h2>
            
            <p>We are pleased to confirm that your payment for <strong>${courseName}</strong> has been successfully processed.</p>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #28a745;">
              <p style="margin: 0; font-size: 14px;"><strong>Payment Details:</strong></p>
              <p style="margin: 5px 0 0 0; font-size: 18px; color: #28a745; font-weight: bold;">
                Amount: Rs. ${amount?.toLocaleString("en-IN") || "N/A"}
              </p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">
                UTR Number: ${transaction.utrNumber || "N/A"}
              </p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">
                Status: <span style="color: #28a745; font-weight: bold;">${
                  transaction.status.charAt(0).toUpperCase() +
                  transaction.status.slice(1)
                }</span>
              </p>
            </div>
            
            <p>Your detailed receipt is attached to this email as a PDF document for your records.</p>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; margin: 15px 0;">
              <p style="margin: 0; font-size: 14px; color: #856404;">
                <strong>📋 Important:</strong> Please keep this receipt safe. You may need it for:
              </p>
              <ul style="margin: 5px 0 0 20px; font-size: 14px; color: #856404;">
                <li>Course access and enrollment verification</li>
                <li>Tax purposes and expense tracking</li>
                <li>Customer support and inquiries</li>
              </ul>
            </div>
            
            <p>If you have any questions about this payment or need assistance with your course enrollment, please don't hesitate to contact us.</p>
            
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #dee2e6;">
              <p style="margin: 0; font-size: 14px; color: #666;">
                <strong>Need Help?</strong><br>
                Email: support@iicpas.com<br>
                Phone: +91-9876543210<br>
                Website: www.iicpas.com
              </p>
            </div>
          </div>
          
          <div style="background: #343a40; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2025 IICPAS Institute. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">This is an automated email. Please do not reply directly to this email.</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `Receipt-${transaction._id.toString().slice(-8)}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Receipt email sent successfully:", result.messageId);

    return {
      success: true,
      messageId: result.messageId,
      email: studentEmail,
    };
  } catch (error) {
    console.error("Error sending receipt email:", error);
    throw error;
  }
};

// Test email configuration
export const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("Email configuration is valid");
    return true;
  } catch (error) {
    console.error("Email configuration error:", error);
    return false;
  }
};
