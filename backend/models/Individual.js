import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const individualSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6, select: false },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

// Hash password before save
individualSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
individualSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

const Individual = mongoose.model("Individual", individualSchema);
export default Individual;
