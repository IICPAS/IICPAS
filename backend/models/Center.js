import mongoose from "mongoose";

const centerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  pincode: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  manager: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    }
  },
  facilities: [{
    type: String,
    trim: true
  }],
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }],
  capacity: {
    type: Number,
    default: 50
  },
  status: {
    type: String,
    enum: ["active", "inactive", "maintenance"],
    default: "active"
  },
  coordinates: {
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    }
  },
  images: [{
    type: String // Image URLs
  }],
  description: {
    type: String,
    trim: true
  },
  timings: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee"
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

// Indexes for efficient queries
centerSchema.index({ city: 1, state: 1 });
centerSchema.index({ status: 1 });
centerSchema.index({ name: 1 });

// Update the updatedAt field before saving
centerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Center = mongoose.model("Center", centerSchema);
export default Center;