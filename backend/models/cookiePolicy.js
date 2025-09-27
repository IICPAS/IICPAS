import mongoose from 'mongoose';

const cookiePolicySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: "Cookie Policy"
  },
  lastUpdated: {
    type: String,
    required: true,
    default: "January 2025"
  },
  sections: [{
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    subsections: [{
      title: {
        type: String,
        required: false
      },
      content: {
        type: String,
        required: false
      },
      listItems: [{
        type: String,
        required: false
      }]
    }]
  }],
  contactInfo: {
    email: {
      type: String,
      required: true,
      default: "privacy@iicpa.com"
    },
    phone: {
      type: String,
      required: true,
      default: "+91 98765 43210"
    },
    address: {
      type: String,
      required: true,
      default: "123 Education Street, Learning City, LC 12345"
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
cookiePolicySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('CookiePolicy', cookiePolicySchema);
