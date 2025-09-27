import mongoose from 'mongoose';
import RefundPolicy from './models/refundPolicy.js';
import connectDB from './config/db.js';

// Connect to database
connectDB();

const seedRefundPolicy = async () => {
  try {
    // Clear existing refund policies
    await RefundPolicy.deleteMany({});
    console.log('Cleared existing refund policies');

    // Create default refund policy
    const defaultRefundPolicy = new RefundPolicy({
      title: "Refund Policy",
      lastUpdated: "January 2025",
      sections: [
        {
          title: "Overview",
          content: "At IICPA Institute, we are committed to providing high-quality educational services. We understand that circumstances may arise where you need to request a refund. This policy outlines the terms and conditions under which refunds may be granted.",
          subsections: [],
          listItems: []
        },
        {
          title: "Refund Eligibility",
          content: "Our refund policy is designed to be fair and transparent. Refunds are granted based on specific criteria outlined below.",
          subsections: [
            {
              title: "Full Refund (100%)",
              content: "You may be eligible for a full refund if:",
              listItems: [
                "You request a refund within 7 days of course enrollment",
                "You have not accessed more than 20% of the course content",
                "The course has not yet started (for scheduled courses)",
                "Technical issues prevent you from accessing the course",
                "We cancel the course due to insufficient enrollment"
              ]
            },
            {
              title: "Partial Refund (50-80%)",
              content: "You may be eligible for a partial refund if:",
              listItems: [
                "You request a refund within 14 days of course enrollment",
                "You have accessed between 20-50% of the course content",
                "The course has started but you have valid reasons for withdrawal",
                "You experience technical difficulties that we cannot resolve"
              ]
            },
            {
              title: "No Refund",
              content: "Refunds will not be granted in the following cases:",
              listItems: [
                "You have accessed more than 50% of the course content",
                "You request a refund after 14 days from enrollment",
                "You have completed the course or received a certificate",
                "You violate our terms of service or code of conduct",
                "You request a refund for completed live sessions"
              ]
            }
          ],
          listItems: []
        },
        {
          title: "Refund Process",
          content: "To request a refund, follow these steps:",
          subsections: [
            {
              title: "Step 1: Submit Refund Request",
              content: "To request a refund, please contact our support team with the following information:",
              listItems: [
                "Your full name and email address",
                "Course name and enrollment date",
                "Reason for refund request",
                "Supporting documentation (if applicable)"
              ]
            },
            {
              title: "Step 2: Review Process",
              content: "Our team will review your request within 3-5 business days. We may contact you for additional information or clarification.",
              listItems: []
            },
            {
              title: "Step 3: Refund Processing",
              content: "If approved, your refund will be processed within 7-10 business days. The refund will be issued to the original payment method used for the purchase.",
              listItems: []
            }
          ],
          listItems: []
        },
        {
          title: "Special Circumstances",
          content: "We understand that special circumstances may arise. Here's how we handle them:",
          subsections: [
            {
              title: "Medical Emergencies",
              content: "In case of medical emergencies or other unforeseen circumstances, we may consider refund requests on a case-by-case basis. Please provide appropriate documentation to support your request.",
              listItems: []
            },
            {
              title: "Course Cancellation",
              content: "If we cancel a course due to insufficient enrollment or other reasons, you will receive a full refund automatically. No action is required on your part.",
              listItems: []
            },
            {
              title: "Technical Issues",
              content: "If you experience technical issues that prevent you from accessing course content, please contact our technical support team first. If the issues cannot be resolved, we will process your refund request.",
              listItems: []
            }
          ],
          listItems: []
        },
        {
          title: "Important Notes",
          content: "Please keep the following important information in mind:",
          subsections: [],
          listItems: [
            "Refund processing times may vary depending on your payment method and bank",
            "All refunds are processed in the original currency of payment",
            "Processing fees charged by payment processors are non-refundable",
            "Refund requests must be submitted by the original purchaser",
            "We reserve the right to modify this policy at any time"
          ]
        },
        {
          title: "Dispute Resolution",
          content: "If you are not satisfied with our refund decision, you may request a review by our management team. All disputes will be handled fairly and in accordance with our terms of service and applicable laws.",
          subsections: [],
          listItems: []
        },
        {
          title: "Policy Updates",
          content: "We reserve the right to update this refund policy at any time. Changes will be posted on our website with an updated 'Last updated' date. Continued use of our services after changes constitutes acceptance of the updated policy.",
          subsections: [],
          listItems: []
        }
      ],
      contactInfo: {
        email: "refunds@iicpa.com",
        phone: "+91 98765 43210",
        address: "123 Education Street, Learning City, LC 12345",
        businessHours: "Monday - Friday, 9:00 AM - 6:00 PM (IST)"
      },
      isActive: true
    });

    await defaultRefundPolicy.save();
    console.log('✅ Default refund policy created successfully');

    console.log('🎉 Refund policy seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding refund policy:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedRefundPolicy();
