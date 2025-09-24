import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Student from "../models/Students.js";
import Teacher from "../models/Teacher.js";
import College from "../models/College.js";
import Company from "../models/Company.js";
import Individual from "../models/Individual.js";
import NewsletterSubscription from "../models/NewsletterSubscription.js";

dotenv.config();

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "your-email@gmail.com",
      pass: process.env.EMAIL_PASS || "your-app-password",
    },
  });
};

// Email templates
const emailTemplates = {
  profileUpdate: (studentName) => ({
    subject: "Profile Updated Successfully - IICPA Institute",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">IICPA Institute</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Profile Update Confirmation</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Dear <strong>${studentName}</strong>,
          </p>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Your profile has been successfully updated on the IICPA Institute platform.
          </p>
          
          <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">What's New?</h3>
            <ul style="color: #666; font-size: 14px;">
              <li>Profile image updated</li>
              <li>Account information verified</li>
              <li>Security settings maintained</li>
            </ul>
          </div>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            If you did not make these changes, please contact our support team immediately.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/student-dashboard?tab=profile" 
               style="background-color: #4caf50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Profile
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
            Best regards,<br>
            IICPA Institute Team
          </p>
        </div>
        
        <div style="background-color: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>© 2024 IICPA Institute. All rights reserved.</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `,
    text: `
      Profile Update Confirmation - IICPA Institute
      
      Dear ${studentName},
      
      Your profile has been successfully updated on the IICPA Institute platform.
      
      What's New?
      - Profile image updated
      - Account information verified
      - Security settings maintained
      
      If you did not make these changes, please contact our support team immediately.
      
      View your profile: ${process.env.CLIENT_URL || 'http://localhost:3000'}/student-dashboard?tab=profile
      
      Best regards,
      IICPA Institute Team
    `
  }),

  welcomeEmail: (studentName, email) => ({
    subject: "Welcome to IICPA Institute - Your Learning Journey Begins!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to IICPA Institute</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${studentName}!</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Welcome to IICPA Institute! We're excited to have you join our learning community.
          </p>
          
          <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2e7d32; margin-top: 0;">Your Account Details</h3>
            <p style="color: #666; margin: 5px 0;"><strong>Name:</strong> ${studentName}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Role:</strong> Student</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/student-dashboard" 
               style="background-color: #4caf50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Access Dashboard
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
            Best regards,<br>
            IICPA Institute Team
          </p>
        </div>
      </div>
    `,
    text: `
      Welcome to IICPA Institute!
      
      Hello ${studentName}!
      
      Welcome to IICPA Institute! We're excited to have you join our learning community.
      
      Your Account Details:
      - Name: ${studentName}
      - Email: ${email}
      - Role: Student
      
      Access your dashboard: ${process.env.CLIENT_URL || 'http://localhost:3000'}/student-dashboard
      
      Best regards,
      IICPA Institute Team
    `
  })
};

// Email service functions
export const sendEmail = async (to, template, data = {}) => {
  try {
    const transporter = createTransporter();
    const emailTemplate = emailTemplates[template];
    
    if (!emailTemplate) {
      throw new Error(`Email template '${template}' not found`);
    }

    const emailContent = typeof emailTemplate === 'function' 
      ? emailTemplate(data) 
      : emailTemplate;

    const mailOptions = {
      from: `"IICPA Institute" <${process.env.EMAIL_USER || "noreply@iicpa.in"}>`,
      to: to,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

// Specific email functions
export const sendProfileUpdateEmail = async (studentEmail, studentName) => {
  return await sendEmail(studentEmail, 'profileUpdate', { studentName });
};

export const sendWelcomeEmail = async (studentEmail, studentName) => {
  return await sendEmail(studentEmail, 'welcomeEmail', { studentName, email: studentEmail });
};

// Bulk email functions
export const sendBulkEmail = async (recipients, subject, htmlContent, textContent, logData = null) => {
  try {
    const transporter = createTransporter();
    const results = [];
    let successCount = 0;
    let failureCount = 0;

    console.log(`Starting bulk email to ${recipients.length} recipients`);

    // Update log status to sending if logData provided
    if (logData) {
      await logData.updateOne({ status: 'sending' });
    }

    for (const recipient of recipients) {
      try {
        const mailOptions = {
          from: `"IICPA Institute" <${process.env.EMAIL_USER || "noreply@iicpa.in"}>`,
          to: recipient.email,
          subject: subject,
          text: textContent,
          html: htmlContent,
        };

        const result = await transporter.sendMail(mailOptions);
        const resultData = {
          email: recipient.email,
          name: recipient.name || 'User',
          type: recipient.type || 'Unknown',
          status: 'success',
          messageId: result.messageId,
          sentAt: new Date()
        };
        results.push(resultData);
        successCount++;
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        const resultData = {
          email: recipient.email,
          name: recipient.name || 'User',
          type: recipient.type || 'Unknown',
          status: 'failed',
          error: error.message,
          sentAt: new Date()
        };
        results.push(resultData);
        failureCount++;
        console.error(`Failed to send email to ${recipient.email}:`, error.message);
      }
    }

    console.log(`Bulk email completed: ${successCount} successful, ${failureCount} failed`);
    
    // Update log with results if logData provided
    if (logData) {
      await logData.updateOne({
        status: 'completed',
        successCount,
        failureCount,
        results,
        completedAt: new Date()
      });
    }
    
    return {
      success: true,
      totalRecipients: recipients.length,
      successCount,
      failureCount,
      results
    };
  } catch (error) {
    console.error("Bulk email error:", error);
    
    // Update log status to failed if logData provided
    if (logData) {
      await logData.updateOne({
        status: 'failed',
        completedAt: new Date()
      });
    }
    
    return { success: false, error: error.message };
  }
};

// Get all email addresses from different user types
export const getAllEmailAddresses = async () => {
  try {
    const [students, teachers, colleges, companies, individuals, newsletterSubs] = await Promise.all([
      Student.find({}, { email: 1, name: 1, _id: 0 }),
      Teacher.find({}, { email: 1, name: 1, _id: 0 }),
      College.find({}, { email: 1, name: 1, _id: 0 }),
      Company.find({}, { email: 1, name: 1, _id: 0 }),
      Individual.find({}, { email: 1, name: 1, _id: 0 }),
      NewsletterSubscription.find({}, { email: 1, _id: 0 })
    ]);

    // Combine all email addresses and remove duplicates
    const allEmails = [
      ...students.map(s => ({ email: s.email, name: s.name, type: 'Student' })),
      ...teachers.map(t => ({ email: t.email, name: t.name, type: 'Teacher' })),
      ...colleges.map(c => ({ email: c.email, name: c.name, type: 'College' })),
      ...companies.map(c => ({ email: c.email, name: c.name, type: 'Company' })),
      ...individuals.map(i => ({ email: i.email, name: i.name, type: 'Individual' })),
      ...newsletterSubs.map(n => ({ email: n.email, name: 'Newsletter Subscriber', type: 'Newsletter' }))
    ];

    // Remove duplicates based on email address
    const uniqueEmails = allEmails.filter((email, index, self) => 
      index === self.findIndex(e => e.email === email.email)
    );

    return {
      success: true,
      totalEmails: uniqueEmails.length,
      emails: uniqueEmails,
      breakdown: {
        students: students.length,
        teachers: teachers.length,
        colleges: colleges.length,
        companies: companies.length,
        individuals: individuals.length,
        newsletter: newsletterSubs.length
      }
    };
  } catch (error) {
    console.error("Error fetching email addresses:", error);
    return { success: false, error: error.message };
  }
};

// Test email function
export const testEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("Email server connection verified successfully");
    return { success: true, message: "Email server connection verified" };
  } catch (error) {
    console.error("Email server connection failed:", error);
    return { success: false, error: error.message };
  }
};

export default {
  sendEmail,
  sendProfileUpdateEmail,
  sendWelcomeEmail,
  sendBulkEmail,
  getAllEmailAddresses,
  testEmailConnection,
  emailTemplates
};
