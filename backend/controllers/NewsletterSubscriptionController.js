import NewsletterSubscription from "../models/NewsletterSubscription.js";

// Subscribe to newsletter
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email, name, phone, source = "newsletter" } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email is required" 
      });
    }

    // Check if email already exists
    const existingSubscription = await NewsletterSubscription.findOne({ email: email.toLowerCase() });
    
    if (existingSubscription) {
      if (existingSubscription.status === "unsubscribed") {
        // Reactivate subscription
        existingSubscription.status = "active";
        existingSubscription.subscribedAt = new Date();
        existingSubscription.unsubscribedAt = undefined;
        if (name) existingSubscription.name = name;
        if (phone) existingSubscription.phone = phone;
        existingSubscription.source = source;
        existingSubscription.ipAddress = req.ip;
        existingSubscription.userAgent = req.get('User-Agent');
        await existingSubscription.save();
        
        return res.status(200).json({
          success: true,
          message: "Welcome back! You've been resubscribed to our newsletter.",
          subscription: existingSubscription
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "This email is already subscribed to our newsletter."
        });
      }
    }

    // Create new subscription
    const subscription = new NewsletterSubscription({
      email: email.toLowerCase(),
      name: name || "",
      phone: phone || "",
      source: source,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await subscription.save();

    res.status(201).json({
      success: true,
      message: "Successfully subscribed to newsletter!",
      subscription: {
        email: subscription.email,
        subscribedAt: subscription.subscribedAt
      }
    });

  } catch (error) {
    console.error("Newsletter subscription error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to subscribe to newsletter. Please try again."
    });
  }
};

// Get all subscriptions (admin only)
export const getAllSubscriptions = async (req, res) => {
  try {
    const { page = 1, limit = 50, status, search } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    let filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    const subscriptions = await NewsletterSubscription
      .find(filter)
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await NewsletterSubscription.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: subscriptions,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total: total
      }
    });

  } catch (error) {
    console.error("Get subscriptions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subscriptions"
    });
  }
};

// Get subscription stats (admin only)
export const getSubscriptionStats = async (req, res) => {
  try {
    const total = await NewsletterSubscription.countDocuments();
    const active = await NewsletterSubscription.countDocuments({ status: "active" });
    const unsubscribed = await NewsletterSubscription.countDocuments({ status: "unsubscribed" });
    const bounced = await NewsletterSubscription.countDocuments({ status: "bounced" });

    // Get recent subscriptions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recent = await NewsletterSubscription.countDocuments({
      subscribedAt: { $gte: thirtyDaysAgo }
    });

    // Get subscriptions by source
    const bySource = await NewsletterSubscription.aggregate([
      {
        $group: {
          _id: "$source",
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total,
        active,
        unsubscribed,
        bounced,
        recent,
        bySource
      }
    });

  } catch (error) {
    console.error("Get subscription stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subscription stats"
    });
  }
};

// Update subscription status (admin only)
export const updateSubscriptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const subscription = await NewsletterSubscription.findById(id);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found"
      });
    }

    subscription.status = status;
    if (notes) subscription.notes = notes;
    
    if (status === "unsubscribed") {
      subscription.unsubscribedAt = new Date();
    } else if (status === "active") {
      subscription.unsubscribedAt = undefined;
    }

    await subscription.save();

    res.status(200).json({
      success: true,
      message: "Subscription status updated successfully",
      subscription
    });

  } catch (error) {
    console.error("Update subscription error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update subscription"
    });
  }
};

// Unsubscribe from newsletter
export const unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const subscription = await NewsletterSubscription.findOne({ 
      email: email.toLowerCase() 
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Email not found in our subscription list"
      });
    }

    if (subscription.status === "unsubscribed") {
      return res.status(400).json({
        success: false,
        message: "Email is already unsubscribed"
      });
    }

    subscription.status = "unsubscribed";
    subscription.unsubscribedAt = new Date();
    await subscription.save();

    res.status(200).json({
      success: true,
      message: "Successfully unsubscribed from newsletter"
    });

  } catch (error) {
    console.error("Unsubscribe error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to unsubscribe"
    });
  }
};

// Delete subscription (admin only)
export const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await NewsletterSubscription.findByIdAndDelete(id);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Subscription deleted successfully"
    });

  } catch (error) {
    console.error("Delete subscription error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete subscription"
    });
  }
};
