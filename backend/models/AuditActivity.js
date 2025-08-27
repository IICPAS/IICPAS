import mongoose from 'mongoose';

const auditActivitySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  route: {
    type: String,
    required: true,
    index: true
  },
  method: {
    type: String,
    required: true,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    default: 'GET'
  },
  statusCode: {
    type: Number,
    required: true,
    min: 100,
    max: 599
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  requestSize: {
    type: Number,
    default: 0
  },
  responseSize: {
    type: Number,
    default: 0
  },
  ip: {
    type: String,
    required: true,
    index: true
  },
  city: {
    type: String,
    default: 'unknown'
  },
  region: {
    type: String,
    default: 'unknown'
  },
  country: {
    type: String,
    default: 'unknown'
  },
  latitude: {
    type: Number,
    default: null
  },
  longitude: {
    type: Number,
    default: null
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  userAgent: {
    type: String,
    default: 'unknown'
  },
  event: {
    type: String,
    default: 'api_request'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for efficient querying
auditActivitySchema.index({ timestamp: -1 });
auditActivitySchema.index({ userId: 1, timestamp: -1 });
auditActivitySchema.index({ ip: 1, timestamp: -1 });
auditActivitySchema.index({ sessionId: 1, timestamp: -1 });
auditActivitySchema.index({ method: 1, timestamp: -1 });
auditActivitySchema.index({ statusCode: 1, timestamp: -1 });
auditActivitySchema.index({ event: 1, timestamp: -1 });

// Virtual for formatted duration
auditActivitySchema.virtual('durationFormatted').get(function() {
  const minutes = Math.floor(this.duration / 60);
  const seconds = this.duration % 60;
  return `${minutes}m ${seconds}s`;
});

// Method to get user activity summary
auditActivitySchema.statics.getUserActivitySummary = async function(userId, days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return await this.aggregate([
    {
      $match: {
        userId: userId,
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalSessions: { $addToSet: '$sessionId' },
        totalDuration: { $sum: '$duration' },
        totalRoutes: { $addToSet: '$route' },
        uniqueIPs: { $addToSet: '$ip' }
      }
    },
    {
      $project: {
        totalSessions: { $size: '$totalSessions' },
        totalDuration: 1,
        totalRoutes: { $size: '$totalRoutes' },
        uniqueIPs: { $size: '$uniqueIPs' }
      }
    }
  ]);
};

// Method to get IP activity summary
auditActivitySchema.statics.getIPActivitySummary = async function(ip, days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return await this.aggregate([
    {
      $match: {
        ip: ip,
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalUsers: { $addToSet: '$userId' },
        totalSessions: { $addToSet: '$sessionId' },
        totalDuration: { $sum: '$duration' },
        totalRoutes: { $addToSet: '$route' }
      }
    },
    {
      $project: {
        totalUsers: { $size: '$totalUsers' },
        totalSessions: { $size: '$totalSessions' },
        totalDuration: 1,
        totalRoutes: { $size: '$totalRoutes' }
      }
    }
  ]);
};

const AuditActivity = mongoose.model('AuditActivity', auditActivitySchema);

export default AuditActivity;
