import AuditActivity from "../models/AuditActivity.js";
import dayjs from "dayjs";

// Track a new audit activity
export const trackActivity = async (req, res) => {
  try {
    const {
      userId,
      route,
      duration,
      ip,
      city,
      region,
      country,
      timestamp,
      sessionId,
      userAgent,
      referrer,
      deviceType,
      browser,
      os,
    } = req.body;

    // Validate required fields
    if (!userId || !route || !duration || !ip || !sessionId) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: userId, route, duration, ip, sessionId",
      });
    }

    // Create new audit activity
    const auditActivity = new AuditActivity({
      userId,
      route,
      duration,
      ip,
      city: city || "unknown",
      region: region || "unknown",
      country: country || "unknown",
      timestamp: timestamp || new Date(),
      sessionId,
      userAgent: userAgent || req.headers["user-agent"] || "unknown",
      referrer: referrer || req.headers.referer || "",
      deviceType: deviceType || "unknown",
      browser: browser || "unknown",
      os: os || "unknown",
    });

    await auditActivity.save();

    res.status(201).json({
      success: true,
      message: "Activity tracked successfully",
      data: auditActivity,
    });
  } catch (error) {
    console.error("Error tracking activity:", error);
    res.status(500).json({
      success: false,
      message: "Failed to track activity",
      error: error.message,
    });
  }
};

// Get all audit activities with pagination and filters
export const getAuditActivities = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      userId,
      ip,
      sessionId,
      route,
      startDate,
      endDate,
      country,
      city,
    } = req.query;

    const skip = (page - 1) * limit;
    const filter = {};

    // Apply filters
    if (userId) filter.userId = userId;
    if (ip) filter.ip = ip;
    if (sessionId) filter.sessionId = sessionId;
    if (route) filter.route = { $regex: route, $options: "i" };
    if (country) filter.country = { $regex: country, $options: "i" };
    if (city) filter.city = { $regex: city, $options: "i" };

    // Date range filter
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const activities = await AuditActivity.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await AuditActivity.countDocuments(filter);

    res.json({
      success: true,
      data: activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching audit activities:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch audit activities",
      error: error.message,
    });
  }
};

// Get audit statistics
export const getAuditStats = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = dayjs().subtract(parseInt(days), "day").toDate();

    // Get basic stats
    const totalActivities = await AuditActivity.countDocuments({
      timestamp: { $gte: startDate },
    });

    const uniqueUsers = await AuditActivity.distinct("userId", {
      timestamp: { $gte: startDate },
    });

    const uniqueIPs = await AuditActivity.distinct("ip", {
      timestamp: { $gte: startDate },
    });

    const uniqueSessions = await AuditActivity.distinct("sessionId", {
      timestamp: { $gte: startDate },
    });

    // Get total duration
    const durationStats = await AuditActivity.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          totalDuration: { $sum: "$duration" },
          avgDuration: { $avg: "$duration" },
        },
      },
    ]);

    // Get top routes
    const topRoutes = await AuditActivity.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$route",
          count: { $sum: 1 },
          totalDuration: { $sum: "$duration" },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // Get top countries
    const topCountries = await AuditActivity.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // Get daily activity
    const dailyActivity = await AuditActivity.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$timestamp",
            },
          },
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: "$userId" },
          totalDuration: { $sum: "$duration" },
        },
      },
      {
        $project: {
          date: "$_id",
          count: 1,
          uniqueUsers: { $size: "$uniqueUsers" },
          totalDuration: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalActivities,
        uniqueUsers: uniqueUsers.length,
        uniqueIPs: uniqueIPs.length,
        uniqueSessions: uniqueSessions.length,
        totalDuration: durationStats[0]?.totalDuration || 0,
        avgDuration: Math.round(durationStats[0]?.avgDuration || 0),
        topRoutes,
        topCountries,
        dailyActivity,
      },
    });
  } catch (error) {
    console.error("Error fetching audit stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch audit statistics",
      error: error.message,
    });
  }
};

// Get user activity summary
export const getUserActivitySummary = async (req, res) => {
  try {
    const { userId, days } = req.params;
    const daysToUse = days ? parseInt(days) : 7;

    const summary = await AuditActivity.getUserActivitySummary(
      userId,
      daysToUse
    );

    res.json({
      success: true,
      data: summary[0] || {
        totalSessions: 0,
        totalDuration: 0,
        totalRoutes: 0,
        uniqueIPs: 0,
      },
    });
  } catch (error) {
    console.error("Error fetching user activity summary:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user activity summary",
      error: error.message,
    });
  }
};

// Get IP activity summary
export const getIPActivitySummary = async (req, res) => {
  try {
    const { ip, days } = req.params;
    const daysToUse = days ? parseInt(days) : 7;

    const summary = await AuditActivity.getIPActivitySummary(
      ip,
      daysToUse
    );

    res.json({
      success: true,
      data: summary[0] || {
        totalUsers: 0,
        totalSessions: 0,
        totalDuration: 0,
        totalRoutes: 0,
      },
    });
  } catch (error) {
    console.error("Error fetching IP activity summary:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch IP activity summary",
      error: error.message,
    });
  }
};

// Delete audit activities (admin only)
export const deleteAuditActivities = async (req, res) => {
  try {
    const { startDate, endDate, userId, ip } = req.body;

    const filter = {};

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    if (userId) filter.userId = userId;
    if (ip) filter.ip = ip;

    const result = await AuditActivity.deleteMany(filter);

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} audit activities`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting audit activities:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete audit activities",
      error: error.message,
    });
  }
};
