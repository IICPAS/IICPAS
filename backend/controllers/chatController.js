import ChatConversation from "../models/ChatConversation.js";
import { v4 as uuidv4 } from 'uuid';

// Create or update chat conversation
export const saveChatMessage = async (req, res) => {
  try {
    const { sessionId, message, userDetails, userAgent, ipAddress } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ 
        success: false, 
        message: "Session ID and message are required" 
      });
    }

    // Find existing conversation or create new one
    let conversation = await ChatConversation.findOne({ sessionId });

    if (!conversation) {
      // Create new conversation
      conversation = new ChatConversation({
        sessionId,
        userDetails: userDetails || {},
        messages: [message],
        userAgent: userAgent || "",
        ipAddress: ipAddress || ""
      });
    } else {
      // Add message to existing conversation
      conversation.messages.push(message);
      conversation.lastMessageAt = new Date();
      
      // Update user details if provided
      if (userDetails) {
        conversation.userDetails = { ...conversation.userDetails, ...userDetails };
      }
    }

    await conversation.save();

    res.status(200).json({
      success: true,
      message: "Chat message saved successfully",
      conversation
    });

  } catch (error) {
    console.error("Error saving chat message:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get all chat conversations for admin
export const getAllChatConversations = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { 'userDetails.name': { $regex: search, $options: 'i' } },
        { 'userDetails.email': { $regex: search, $options: 'i' } },
        { 'userDetails.phone': { $regex: search, $options: 'i' } }
      ];
    }

    const conversations = await ChatConversation.find(filter)
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-messages'); // Exclude messages for list view

    const total = await ChatConversation.countDocuments(filter);

    res.status(200).json({
      success: true,
      conversations,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error("Error fetching chat conversations:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get specific chat conversation with messages
export const getChatConversation = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const conversation = await ChatConversation.findOne({ sessionId });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    res.status(200).json({
      success: true,
      conversation
    });

  } catch (error) {
    console.error("Error fetching chat conversation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Update conversation status
export const updateConversationStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status } = req.body;

    if (!['active', 'completed', 'abandoned'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const conversation = await ChatConversation.findOneAndUpdate(
      { sessionId },
      { 
        status,
        completedAt: status === 'completed' ? new Date() : null
      },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Conversation status updated successfully",
      conversation
    });

  } catch (error) {
    console.error("Error updating conversation status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get chat statistics
export const getChatStatistics = async (req, res) => {
  try {
    const totalConversations = await ChatConversation.countDocuments();
    const activeConversations = await ChatConversation.countDocuments({ status: 'active' });
    const completedConversations = await ChatConversation.countDocuments({ status: 'completed' });
    const abandonedConversations = await ChatConversation.countDocuments({ status: 'abandoned' });

    // Get conversations from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentConversations = await ChatConversation.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.status(200).json({
      success: true,
      statistics: {
        total: totalConversations,
        active: activeConversations,
        completed: completedConversations,
        abandoned: abandonedConversations,
        recent: recentConversations
      }
    });

  } catch (error) {
    console.error("Error fetching chat statistics:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Delete conversation
export const deleteConversation = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const conversation = await ChatConversation.findOneAndDelete({ sessionId });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Conversation deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting conversation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
