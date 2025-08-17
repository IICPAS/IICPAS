import mongoose from "mongoose";

const kitOrderItemSchema = new mongoose.Schema({
  courseId: { type: Number, required: true },
  courseName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
});

const kitOrderTotalsSchema = new mongoose.Schema({
  totalQuantity: { type: Number, required: true },
  grossTotal: { type: Number, required: true },
  bulkDiscountPercent: { type: Number, default: 0 },
  bulkDiscountAmount: { type: Number, default: 0 },
  discountedPrice: { type: Number, required: true },
  combinationDiscounts: { type: Number, default: 0 },
  netKitPrice: { type: Number, required: true },
  payable: { type: Number, required: true },
});

const kitOrderSchema = new mongoose.Schema(
  {
    centerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Center",
      required: true,
    },
    centerName: { type: String, required: true },
    courseType: {
      type: String,
      enum: ["Classroom", "Recorded", "Live"],
      required: true,
    },
    items: [kitOrderItemSchema],
    totals: kitOrderTotalsSchema,
    walletBalance: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "processing",
        "shipped",
        "delivered",
      ],
      default: "pending",
    },
    adminRemarks: { type: String },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    processedAt: { type: Date },
    shippingDetails: {
      trackingNumber: String,
      courierName: String,
      shippedAt: Date,
      estimatedDelivery: Date,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentMethod: String,
    transactionId: String,
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
kitOrderSchema.index({ centerId: 1, status: 1 });
kitOrderSchema.index({ orderDate: -1 });
kitOrderSchema.index({ status: 1 });

export const KitOrder = mongoose.model("KitOrder", kitOrderSchema);

