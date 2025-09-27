import mongoose from 'mongoose';
import TermsOfService from './models/termsOfService.js';
import dotenv from 'dotenv';

dotenv.config();

const seedTermsOfService = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing terms of service
    await TermsOfService.deleteMany({});
    console.log('Cleared existing terms of service');

    // Create new terms of service
    const termsOfServiceData = {
      title: "Terms of Service",
      lastUpdated: "January 2025",
      sections: [
        {
          title: "Agreement to Terms",
          content: "By accessing and using IICPA Institute's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
          subsections: []
        },
        {
          title: "Use License",
          content: "Permission is granted to temporarily download one copy of the materials on IICPA Institute's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:",
          subsections: [
            {
              title: "",
              content: "",
              listItems: [
                "Modify or copy the materials",
                "Use the materials for any commercial purpose or for any public display",
                "Attempt to reverse engineer any software contained on the website",
                "Remove any copyright or other proprietary notations from the materials"
              ]
            }
          ]
        },
        {
          title: "Course Enrollment and Payment",
          content: "This section covers the terms and conditions related to course enrollment and payment processes.",
          subsections: [
            {
              title: "Enrollment Process",
              content: "By enrolling in any course, you agree to pay the specified fees and complete the course requirements as outlined in the course description.",
              listItems: []
            },
            {
              title: "Payment Terms",
              content: "",
              listItems: [
                "All fees must be paid in full before course access is granted",
                "Payment methods accepted include credit cards, debit cards, and bank transfers",
                "Prices are subject to change without notice",
                "Refunds are subject to our Refund Policy"
              ]
            }
          ]
        },
        {
          title: "User Accounts",
          content: "When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for:",
          subsections: [
            {
              title: "",
              content: "",
              listItems: [
                "Safeguarding the password and all activities under your account",
                "Notifying us immediately of any unauthorized use of your account",
                "Ensuring your account information remains accurate and up-to-date",
                "Maintaining the confidentiality of your account credentials"
              ]
            }
          ]
        },
        {
          title: "Prohibited Uses",
          content: "You may not use our service:",
          subsections: [
            {
              title: "",
              content: "",
              listItems: [
                "For any unlawful purpose or to solicit others to perform unlawful acts",
                "To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances",
                "To infringe upon or violate our intellectual property rights or the intellectual property rights of others",
                "To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate",
                "To submit false or misleading information",
                "To upload or transmit viruses or any other type of malicious code"
              ]
            }
          ]
        },
        {
          title: "Intellectual Property Rights",
          content: "The service and its original content, features, and functionality are and will remain the exclusive property of IICPA Institute and its licensors. The service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.",
          subsections: []
        },
        {
          title: "Termination",
          content: "We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.",
          subsections: []
        },
        {
          title: "Disclaimer",
          content: "The information on this website is provided on an \"as is\" basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms relating to our website and the use of this website.",
          subsections: []
        },
        {
          title: "Limitation of Liability",
          content: "In no event shall IICPA Institute, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.",
          subsections: []
        },
        {
          title: "Governing Law",
          content: "These Terms shall be interpreted and governed by the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.",
          subsections: []
        },
        {
          title: "Changes to Terms",
          content: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.",
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

    const newTermsOfService = new TermsOfService(termsOfServiceData);
    await newTermsOfService.save();

    console.log('Terms of Service seeded successfully:', newTermsOfService._id);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding terms of service:', error);
    process.exit(1);
  }
};

seedTermsOfService();
