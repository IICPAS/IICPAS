import ContactForm from "../models/ContactForm.js";

// Get active contact form configuration (public endpoint)
export const getActiveContactForm = async (req, res) => {
  try {
    const contactForm = await ContactForm.findOne({ isActive: true }).sort({ createdAt: -1 });
    
    if (!contactForm) {
      // Return default configuration if no active form found
      return res.json({
        smallText: "🎓 Get In Touch",
        mainHeading: "We're Here To Help And Ready To Hear From You",
        formFields: {
          nameField: {
            placeholder: "Enter your name",
            required: true,
            visible: true,
          },
          emailField: {
            placeholder: "Enter your email",
            required: true,
            visible: true,
          },
          phoneField: {
            placeholder: "Write about your phone",
            required: true,
            visible: true,
          },
          messageField: {
            placeholder: "Write Your Message",
            required: true,
            visible: true,
            rows: 5,
          },
        },
        submitButton: {
          text: "Submit",
          icon: "FaPaperPlane",
          color: "bg-green-500 hover:bg-green-600",
        },
        messages: {
          successMessage: "Message sent successfully!",
          errorMessage: "Submission failed",
        },
        colors: {
          smallText: "text-green-600",
          mainHeading: "text-slate-900",
          buttonText: "text-white",
        },
        image: {
          url: "/images/contact-section.jpg",
          alt: "Contact Support",
        },
      });
    }
    
    res.status(200).json(contactForm);
  } catch (error) {
    console.error("Error fetching contact form:", error);
    res.status(500).json({ error: "Failed to fetch contact form configuration" });
  }
};

// Get all contact form configurations (admin only)
export const getAllContactForms = async (req, res) => {
  try {
    const contactForms = await ContactForm.find().sort({ createdAt: -1 });
    res.status(200).json(contactForms);
  } catch (error) {
    console.error("Error fetching contact forms:", error);
    res.status(500).json({ error: "Failed to fetch contact form configurations" });
  }
};

// Get single contact form by ID (admin only)
export const getContactFormById = async (req, res) => {
  try {
    const { id } = req.params;
    const contactForm = await ContactForm.findById(id);
    
    if (!contactForm) {
      return res.status(404).json({ error: "Contact form configuration not found" });
    }
    
    res.status(200).json(contactForm);
  } catch (error) {
    console.error("Error fetching contact form by ID:", error);
    res.status(500).json({ error: "Failed to fetch contact form configuration" });
  }
};

// Create new contact form configuration (admin only)
export const createContactForm = async (req, res) => {
  try {
    const contactFormData = req.body;
    
    // Validate required fields
    if (!contactFormData.smallText || !contactFormData.mainHeading) {
      return res.status(400).json({ error: "Small text and main heading are required" });
    }
    
    // If this form is being set as active, deactivate all others first
    if (contactFormData.isActive) {
      await ContactForm.updateMany({}, { isActive: false });
    }
    
    const contactForm = new ContactForm(contactFormData);
    await contactForm.save();
    
    res.status(201).json(contactForm);
  } catch (error) {
    console.error("Error creating contact form:", error);
    res.status(500).json({ error: "Failed to create contact form configuration" });
  }
};

// Update contact form configuration (admin only)
export const updateContactForm = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // If this form is being set as active, deactivate all others first
    if (updateData.isActive) {
      await ContactForm.updateMany({}, { isActive: false });
    }
    
    const contactForm = await ContactForm.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!contactForm) {
      return res.status(404).json({ error: "Contact form configuration not found" });
    }
    
    res.status(200).json(contactForm);
  } catch (error) {
    console.error("Error updating contact form:", error);
    res.status(500).json({ error: "Failed to update contact form configuration" });
  }
};

// Toggle active status (admin only)
export const toggleContactFormStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    // If activating this form, deactivate all others first
    if (isActive) {
      await ContactForm.updateMany({}, { isActive: false });
    }
    
    const contactForm = await ContactForm.findByIdAndUpdate(
      id,
      { isActive },
      { new: true, runValidators: true }
    );
    
    if (!contactForm) {
      return res.status(404).json({ error: "Contact form configuration not found" });
    }
    
    res.status(200).json(contactForm);
  } catch (error) {
    console.error("Error toggling contact form status:", error);
    res.status(500).json({ error: "Failed to update contact form status" });
  }
};

// Delete contact form configuration (admin only)
export const deleteContactForm = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contactForm = await ContactForm.findByIdAndDelete(id);
    
    if (!contactForm) {
      return res.status(404).json({ error: "Contact form configuration not found" });
    }
    
    res.status(200).json({ message: "Contact form configuration deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact form:", error);
    res.status(500).json({ error: "Failed to delete contact form configuration" });
  }
};
