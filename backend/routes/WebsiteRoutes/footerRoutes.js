import express from "express";
import Footer from "../../models/Website/Footer.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { isAdmin } from "../../middleware/isAdmin.js";

const router = express.Router();

// Get current Footer content (public endpoint)
router.get("/", async (req, res) => {
  try {
    const footer = await Footer.findOne({ isActive: true }).sort({
      createdAt: -1,
    });
    if (!footer) {
      // Return default content if no content found
      return res.json({
        companyInfo: {
          name: "IICPA Institute",
          tagline:
            "Empowering future finance professionals with world-class education, expert guidance, and industry-relevant skills for career success.",
          contact: {
            phone: "+91 98765 43210",
            email: "info@iicpa.com",
            address: "123 Education Street, Learning City, LC 12345",
          },
        },
        footerLinks: {
          courses: [
            { name: "Finance Courses", href: "/courses/finance" },
            { name: "Accounting", href: "/courses/accounting" },
            { name: "Taxation", href: "/courses/taxation" },
            { name: "Auditing", href: "/courses/auditing" },
            { name: "Investment Banking", href: "/courses/investment-banking" },
          ],
          resources: [
            { name: "Blog", href: "/blog" },
            { name: "Study Materials", href: "/resources" },
            { name: "Practice Tests", href: "/practice" },
            { name: "Career Guidance", href: "/career" },
            { name: "Placement Support", href: "/placement" },
          ],
          company: [
            { name: "About Us", href: "/about" },
            { name: "Our Team", href: "/team" },
            { name: "Success Stories", href: "/success" },
            { name: "Partners", href: "/partners" },
            { name: "Contact Us", href: "/contact" },
          ],
          support: [
            { name: "Help Center", href: "/help" },
            { name: "Live Sessions", href: "/live" },
            { name: "Student Login", href: "/login" },
            { name: "FAQ", href: "/faq" },
            { name: "Privacy Policy", href: "/privacy" },
          ],
        },
        socialLinks: [
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
        ],
        bottomBar: {
          copyright: "IICPA Institute. All rights reserved.",
          legalLinks: [
            { name: "Terms of Service", href: "/terms" },
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Cookie Policy", href: "/cookies" },
          ],
        },
        colors: {
          background:
            "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
          accent: "text-[#3cd664]",
          text: "text-white",
          textSecondary: "text-gray-300",
        },
      });
    }

    // Clean up the response to remove MongoDB _id fields from nested arrays
    const cleanFooter = {
      companyInfo: footer.companyInfo,
      footerLinks: {
        courses: footer.footerLinks.courses.map((link) => ({
          name: link.name,
          href: link.href,
        })),
        resources: footer.footerLinks.resources.map((link) => ({
          name: link.name,
          href: link.href,
        })),
        company: footer.footerLinks.company.map((link) => ({
          name: link.name,
          href: link.href,
        })),
        support: footer.footerLinks.support.map((link) => ({
          name: link.name,
          href: link.href,
        })),
      },
      socialLinks: footer.socialLinks.map((social) => ({
        platform: social.platform,
        href: social.href,
        icon: social.icon,
      })),
      bottomBar: {
        copyright: footer.bottomBar.copyright,
        legalLinks: footer.bottomBar.legalLinks.map((link) => ({
          name: link.name,
          href: link.href,
        })),
      },
      colors: footer.colors,
    };

    res.json(cleanFooter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Footer entries (admin only)
router.get("/all", requireAuth, isAdmin, async (req, res) => {
  try {
    const footers = await Footer.find().sort({ createdAt: -1 });
    res.json(footers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new Footer content (admin only)
router.post("/", requireAuth, isAdmin, async (req, res) => {
  try {
    // Deactivate all existing entries
    await Footer.updateMany({}, { isActive: false });

    // Create new entry
    const footer = await Footer.create(req.body);
    res.status(201).json(footer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Footer content (admin only)
router.put("/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    const footer = await Footer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!footer) {
      return res.status(404).json({ error: "Footer content not found" });
    }

    res.json(footer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Activate Footer content (admin only)
router.put("/activate/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    // Deactivate all entries first
    await Footer.updateMany({}, { isActive: false });

    // Activate the selected entry
    const footer = await Footer.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    if (!footer) {
      return res.status(404).json({ error: "Footer content not found" });
    }

    res.json(footer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Footer content (admin only)
router.delete("/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    const footer = await Footer.findByIdAndDelete(req.params.id);

    if (!footer) {
      return res.status(404).json({ error: "Footer content not found" });
    }

    res.json({ message: "Footer content deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
