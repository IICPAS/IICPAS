import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const defaultPrivacyPolicy = {
  title: "Privacy Policy",
  lastUpdated: "January 2025",
  sections: [
    {
      title: "Introduction",
      content: "IICPA Institute (\"we,\" \"our,\" or \"us\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or enroll in our courses. Please read this privacy policy carefully.",
      subsections: []
    },
    {
      title: "Information We Collect",
      content: "We collect various types of information to provide and improve our services:",
      subsections: [
        {
          title: "Personal Information",
          content: "We may collect personal information that you voluntarily provide to us, including:",
          listItems: [
            "Name, email address, and phone number",
            "Date of birth and gender",
            "Educational background and qualifications",
            "Payment and billing information",
            "Course preferences and enrollment history",
            "Communication preferences"
          ]
        },
        {
          title: "Automatically Collected Information",
          content: "When you visit our website, we may automatically collect certain information, including:",
          listItems: [
            "IP address and device information",
            "Browser type and version",
            "Pages visited and time spent on our site",
            "Referring website information",
            "Cookies and similar tracking technologies"
          ]
        }
      ]
    },
    {
      title: "How We Use Your Information",
      content: "We use the information we collect for various purposes, including:",
      subsections: [],
      listItems: [
        "Providing and maintaining our educational services",
        "Processing course enrollments and payments",
        "Communicating with you about courses, updates, and promotions",
        "Personalizing your learning experience",
        "Improving our website and services",
        "Complying with legal obligations",
        "Preventing fraud and ensuring security"
      ]
    },
    {
      title: "Information Sharing and Disclosure",
      content: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:",
      subsections: [],
      listItems: [
        "With trusted service providers who assist us in operating our website and conducting our business",
        "When required by law or to protect our rights and safety",
        "In connection with a business transfer or acquisition",
        "With your explicit consent"
      ]
    },
    {
      title: "Data Security",
      content: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.",
      subsections: []
    },
    {
      title: "Your Rights",
      content: "Depending on your location, you may have certain rights regarding your personal information, including:",
      subsections: [],
      listItems: [
        "The right to access and receive a copy of your personal information",
        "The right to rectify inaccurate or incomplete information",
        "The right to erase your personal information",
        "The right to restrict or object to processing",
        "The right to data portability",
        "The right to withdraw consent"
      ]
    },
    {
      title: "Cookies and Tracking Technologies",
      content: "We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie settings through your browser preferences. For more detailed information, please refer to our Cookie Policy.",
      subsections: []
    },
    {
      title: "Third-Party Links",
      content: "Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.",
      subsections: []
    },
    {
      title: "Children's Privacy",
      content: "Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.",
      subsections: []
    },
    {
      title: "Changes to This Privacy Policy",
      content: "We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website and updating the \"Last updated\" date.",
      subsections: []
    },
    {
      title: "Contact Us",
      content: "If you have any questions about this Privacy Policy or our privacy practices, please contact us at:",
      subsections: []
    }
  ],
  contactInfo: {
    email: "privacy@iicpa.com",
    phone: "+91 98765 43210",
    address: "123 Education Street, Learning City, LC 12345"
  },
  isActive: true
};

const seedPrivacyPolicy = async () => {
  try {
    await connectDB();
    
    // Import the model dynamically
    const { default: PrivacyPolicy } = await import('./models/privacyPolicy.js');
    
    // Check if privacy policy already exists
    const existingPolicy = await PrivacyPolicy.findOne({ isActive: true });
    
    if (existingPolicy) {
      console.log('Privacy policy already exists. Updating...');
      await PrivacyPolicy.findByIdAndUpdate(existingPolicy._id, defaultPrivacyPolicy);
      console.log('Privacy policy updated successfully');
    } else {
      console.log('Creating new privacy policy...');
      const newPolicy = new PrivacyPolicy(defaultPrivacyPolicy);
      await newPolicy.save();
      console.log('Privacy policy created successfully');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding privacy policy:', error);
    process.exit(1);
  }
};

seedPrivacyPolicy();