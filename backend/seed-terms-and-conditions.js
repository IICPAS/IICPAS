import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TermsAndConditions from './models/termsAndConditions.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedTermsAndConditions = async () => {
  try {
    await connectDB();

    // Check if terms and conditions already exist
    const existingTerms = await TermsAndConditions.findOne();
    if (existingTerms) {
      console.log('⚠️ Terms and conditions already exist. Skipping seed.');
      process.exit(0);
    }

    const termsAndConditionsData = {
      title: "Terms & Conditions",
      lastUpdated: "January 2025",
      sections: [
        {
          title: "Acceptance of Terms",
          content: "By accessing and using IICPA Institute's website, services, and educational programs, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.",
          subsections: []
        },
        {
          title: "Description of Service",
          content: "IICPA Institute provides educational services including but not limited to:",
          subsections: [
            {
              title: "",
              content: "",
              listItems: [
                "Online and offline courses in accounting, finance, and related fields",
                "Certification programs and professional development courses",
                "Study materials, resources, and learning tools",
                "Assessment and examination services",
                "Career guidance and placement assistance",
                "Webinars, workshops, and training sessions"
              ]
            }
          ]
        },
        {
          title: "User Registration and Accounts",
          content: "This section covers the requirements and responsibilities for user accounts.",
          subsections: [
            {
              title: "Account Creation",
              content: "To access certain features of our services, you must create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.",
              listItems: []
            },
            {
              title: "Account Security",
              content: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to:",
              listItems: [
                "Use a strong and unique password",
                "Notify us immediately of any unauthorized use of your account",
                "Log out from your account at the end of each session",
                "Not share your account credentials with others"
              ]
            }
          ]
        },
        {
          title: "Course Enrollment and Payment",
          content: "This section outlines the enrollment process, payment terms, and course access policies.",
          subsections: [
            {
              title: "Enrollment Process",
              content: "Course enrollment is subject to availability and completion of the enrollment process, including payment of applicable fees. We reserve the right to refuse enrollment to any individual at our discretion.",
              listItems: []
            },
            {
              title: "Payment Terms",
              content: "",
              listItems: [
                "All fees must be paid in full before course access is granted",
                "Payment methods include credit cards, debit cards, bank transfers, and digital wallets",
                "Prices are subject to change without prior notice",
                "Late payment fees may apply for overdue amounts",
                "All payments are non-refundable except as specified in our Refund Policy"
              ]
            },
            {
              title: "Course Access",
              content: "Course access is granted for the duration specified in the course description. Access may be extended at our discretion or for an additional fee. Sharing course access with others is strictly prohibited.",
              listItems: []
            }
          ]
        },
        {
          title: "Intellectual Property Rights",
          content: "This section covers the intellectual property rights and permitted use of our content.",
          subsections: [
            {
              title: "Our Content",
              content: "All content, materials, and resources provided through our services, including but not limited to text, graphics, logos, images, audio, video, and software, are the property of IICPA Institute or its licensors and are protected by copyright and other intellectual property laws.",
              listItems: []
            },
            {
              title: "Permitted Use",
              content: "You may use our content solely for personal, non-commercial educational purposes. You may not:",
              listItems: [
                "Copy, distribute, or reproduce any content without permission",
                "Modify, adapt, or create derivative works",
                "Use content for commercial purposes",
                "Remove copyright or proprietary notices",
                "Share login credentials or course access"
              ]
            }
          ]
        },
        {
          title: "User Conduct and Prohibited Activities",
          content: "This section outlines the expected user conduct and activities that are prohibited on our platform.",
          subsections: [
            {
              title: "",
              content: "",
              listItems: [
                "Violating any applicable laws or regulations",
                "Infringing on intellectual property rights",
                "Transmitting harmful or malicious code",
                "Attempting to gain unauthorized access to our systems",
                "Interfering with the proper functioning of our services",
                "Harassing, abusing, or threatening other users or staff",
                "Posting false, misleading, or inappropriate content",
                "Using our services for any unlawful or prohibited purpose"
              ]
            }
          ]
        },
        {
          title: "Certification and Assessment",
          content: "This section covers certification requirements, academic integrity, and consequences of violations.",
          subsections: [
            {
              title: "Certification Requirements",
              content: "Certification is awarded upon successful completion of course requirements, including passing assessments and examinations. We reserve the right to modify certification requirements and assessment criteria.",
              listItems: []
            },
            {
              title: "Academic Integrity",
              content: "All students must maintain the highest standards of academic integrity. Violations include but are not limited to:",
              listItems: [
                "Cheating on examinations or assessments",
                "Plagiarism or unauthorized collaboration",
                "Falsifying academic records",
                "Using unauthorized materials during assessments"
              ]
            },
            {
              title: "Consequences of Violations",
              content: "Violations of academic integrity may result in immediate termination of enrollment, revocation of certificates, and permanent ban from our services.",
              listItems: []
            }
          ]
        },
        {
          title: "Privacy and Data Protection",
          content: "Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our Privacy Policy, which is incorporated into these Terms and Conditions by reference.",
          subsections: []
        },
        {
          title: "Limitation of Liability",
          content: "To the maximum extent permitted by law, IICPA Institute shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of our services.",
          subsections: []
        },
        {
          title: "Termination",
          content: "We may terminate or suspend your account and access to our services immediately, without prior notice, for any reason, including but not limited to breach of these Terms and Conditions. Upon termination, your right to use our services will cease immediately.",
          subsections: []
        },
        {
          title: "Governing Law and Dispute Resolution",
          content: "These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or relating to these terms shall be subject to the exclusive jurisdiction of the courts in [City], India.",
          subsections: []
        },
        {
          title: "Modifications to Terms",
          content: "We reserve the right to modify these Terms and Conditions at any time. We will notify users of any material changes by posting the updated terms on our website. Your continued use of our services after such modifications constitutes acceptance of the updated terms.",
          subsections: []
        }
      ],
      contactInfo: {
        email: "legal@iicpa.com",
        phone: "+91 98765 43210",
        address: "123 Education Street, Learning City, LC 12345",
        businessHours: "Monday - Friday, 9:00 AM - 6:00 PM (IST)"
      },
      isActive: true
    };

    const newTermsAndConditions = new TermsAndConditions(termsAndConditionsData);
    await newTermsAndConditions.save();

    console.log('✅ Terms and conditions seeded successfully!');
    console.log('📋 Created terms and conditions with ID:', newTermsAndConditions._id);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding terms and conditions:', error);
    process.exit(1);
  }
};

seedTermsAndConditions();
