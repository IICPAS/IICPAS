import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CookiePolicy from './models/cookiePolicy.js';

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

const seedCookiePolicy = async () => {
  try {
    console.log('🌱 Starting cookie policy seeding...');

    // Clear existing cookie policies
    await CookiePolicy.deleteMany({});
    console.log('🗑️ Cleared existing cookie policies');

    // Create default cookie policy
    const defaultCookiePolicy = new CookiePolicy({
      title: "Cookie Policy",
      lastUpdated: "January 2025",
      sections: [
        {
          title: "What Are Cookies",
          content: "Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners about how their site is being used.",
          subsections: []
        },
        {
          title: "How We Use Cookies",
          content: "IICPA Institute uses cookies to enhance your browsing experience and provide personalized services. We use cookies for the following purposes:",
          subsections: [
            {
              title: "",
              content: "",
              listItems: [
                "To remember your preferences and settings",
                "To analyze website traffic and usage patterns",
                "To provide personalized content and recommendations",
                "To improve website functionality and performance",
                "To enable social media features",
                "To track course progress and learning analytics"
              ]
            }
          ]
        },
        {
          title: "Types of Cookies We Use",
          content: "We use different types of cookies to provide you with the best possible experience on our website:",
          subsections: [
            {
              title: "Essential Cookies",
              content: "These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and remembering your login status.",
              listItems: [
                "Session management cookies",
                "Authentication cookies",
                "Security cookies",
                "Load balancing cookies"
              ]
            },
            {
              title: "Performance Cookies",
              content: "These cookies collect information about how visitors use our website, such as which pages are visited most often and if users get error messages from web pages.",
              listItems: [
                "Google Analytics cookies",
                "Website performance monitoring cookies",
                "Error tracking cookies"
              ]
            },
            {
              title: "Functionality Cookies",
              content: "These cookies allow the website to remember choices you make and provide enhanced, more personal features.",
              listItems: [
                "Language preference cookies",
                "Theme and display preference cookies",
                "Course progress tracking cookies",
                "User preference cookies"
              ]
            },
            {
              title: "Marketing Cookies",
              content: "These cookies are used to track visitors across websites to display relevant and engaging advertisements.",
              listItems: [
                "Social media advertising cookies",
                "Retargeting cookies",
                "Campaign tracking cookies"
              ]
            }
          ]
        },
        {
          title: "Third-Party Cookies",
          content: "We may also use third-party cookies from trusted partners to enhance our services:",
          subsections: [
            {
              title: "",
              content: "",
              listItems: [
                "Google Analytics: To analyze website usage and performance",
                "Social Media Platforms: To enable social sharing and login features",
                "Payment Processors: To process secure payments",
                "Video Platforms: To deliver course content and videos",
                "Communication Tools: To provide customer support and live chat"
              ]
            }
          ]
        },
        {
          title: "Managing Your Cookie Preferences",
          content: "You have control over how cookies are used on our website. Here are the different ways you can manage your cookie preferences:",
          subsections: [
            {
              title: "Browser Settings",
              content: "You can control and manage cookies through your browser settings. Most browsers allow you to:",
              listItems: [
                "View and delete cookies",
                "Block cookies from specific websites",
                "Block all cookies",
                "Set preferences for different types of cookies"
              ]
            },
            {
              title: "Cookie Consent",
              content: "When you first visit our website, you will see a cookie consent banner. You can choose to accept all cookies, reject non-essential cookies, or customize your preferences. You can change your preferences at any time by clicking the cookie settings link in our footer.",
              listItems: []
            }
          ]
        },
        {
          title: "Impact of Disabling Cookies",
          content: "If you choose to disable cookies, some features of our website may not function properly:",
          subsections: [
            {
              title: "",
              content: "",
              listItems: [
                "You may need to log in repeatedly",
                "Your course progress may not be saved",
                "Personalized content and recommendations may not be available",
                "Some interactive features may not work",
                "Website performance may be affected"
              ]
            }
          ]
        },
        {
          title: "Cookie Retention",
          content: "Different cookies have different lifespans. Session cookies are deleted when you close your browser, while persistent cookies remain on your device for a set period or until you delete them. We regularly review and update our cookie usage to ensure we only use necessary cookies for the shortest time possible.",
          subsections: []
        },
        {
          title: "Updates to This Policy",
          content: "We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website and updating the \"Last updated\" date.",
          subsections: []
        }
      ],
      contactInfo: {
        email: "privacy@iicpa.com",
        phone: "+91 98765 43210",
        address: "123 Education Street, Learning City, LC 12345"
      },
      isActive: true
    });

    await defaultCookiePolicy.save();
    console.log('✅ Cookie policy seeded successfully');

    console.log('🎉 Cookie policy seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding cookie policy:', error);
    process.exit(1);
  }
};

// Run the seeding
connectDB().then(() => {
  seedCookiePolicy();
});
