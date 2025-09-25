import mongoose from "mongoose";

const footerSchema = new mongoose.Schema(
  {
    // Company Info
    companyInfo: {
      name: {
        type: String,
        required: true,
        default: "IICPA Institute",
      },
      tagline: {
        type: String,
        required: true,
        default:
          "Empowering future finance professionals with world-class education, expert guidance, and industry-relevant skills for career success.",
      },
      contact: {
        phone: { type: String, required: true, default: "+91 98765 43210" },
        email: { type: String, required: true, default: "info@iicpa.com" },
        address: {
          type: String,
          required: true,
          default: "123 Education Street, Learning City, LC 12345",
        },
      },
    },

    // Footer Links - Now organized into 3 columns
    footerLinks: {
      // Column 2: Company Policy Links
      companyPolicies: [
        {
          name: { type: String, required: true },
          href: { type: String, required: true },
        },
      ],
      // Column 3: General Links (About, Courses, etc.)
      generalLinks: [
        {
          name: { type: String, required: true },
          href: { type: String, required: true },
        },
      ],
    },

    // Social Links
    socialLinks: [
      {
        platform: { type: String, required: true },
        href: { type: String, required: true },
        icon: { type: String, required: true },
      },
    ],

    // Bottom Bar
    bottomBar: {
      copyright: {
        type: String,
        required: true,
        default: "IICPA Institute. All rights reserved.",
      },
      legalLinks: [
        {
          name: { type: String, required: true },
          href: { type: String, required: true },
        },
      ],
    },

    // Color scheme
    colors: {
      background: {
        type: String,
        default: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
      },
      accent: { type: String, default: "text-[#3cd664]" },
      text: { type: String, default: "text-white" },
      textSecondary: { type: String, default: "text-gray-300" },
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Set default values
footerSchema.pre("save", function (next) {
  if (this.isNew) {
    // Set default footer links for new 3-column structure
    if (
      !this.footerLinks.companyPolicies ||
      this.footerLinks.companyPolicies.length === 0
    ) {
      this.footerLinks.companyPolicies = [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Refund Policy", href: "/refund" },
        { name: "Terms & Conditions", href: "/terms" },
        { name: "Return Policy", href: "/return" },
      ];
    }

    if (
      !this.footerLinks.generalLinks ||
      this.footerLinks.generalLinks.length === 0
    ) {
      this.footerLinks.generalLinks = [
        { name: "About Us", href: "/about" },
        { name: "Courses", href: "/courses" },
        { name: "Blog", href: "/blog" },
        { name: "Contact Us", href: "/contact" },
        { name: "FAQ", href: "/faq" },
        { name: "Help Center", href: "/help" },
      ];
    }

    // Set default social links
    if (!this.socialLinks || this.socialLinks.length === 0) {
      this.socialLinks = [
        {
          platform: "Facebook",
          href: "https://facebook.com/iicpa",
          icon: "FaFacebook",
        },
        {
          platform: "Twitter",
          href: "https://twitter.com/iicpa",
          icon: "FaTwitter",
        },
        {
          platform: "LinkedIn",
          href: "https://linkedin.com/company/iicpa",
          icon: "FaLinkedin",
        },
        {
          platform: "Instagram",
          href: "https://instagram.com/iicpa",
          icon: "FaInstagram",
        },
        {
          platform: "YouTube",
          href: "https://youtube.com/iicpa",
          icon: "FaYoutube",
        },
      ];
    }

    // Set default legal links
    if (!this.bottomBar.legalLinks || this.bottomBar.legalLinks.length === 0) {
      this.bottomBar.legalLinks = [
        { name: "Terms of Service", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Cookie Policy", href: "/cookies" },
      ];
    }
  }
  next();
});

const Footer = mongoose.model("Footer", footerSchema);
export default Footer;
