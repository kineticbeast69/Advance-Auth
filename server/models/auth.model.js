import mongoose from "mongoose";

const AuthSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "editor"],
    },
    isVerifiedEmail: { type: Boolean, default: false },
    emailVerificationOTP: { type: String, default: "", maxLength: 6 },
    isEmailVerificationOTPExpired: { type: Number, default: 0 },
    twoFactorOTP: { type: String, default: "", maxLength: 6 },
    isExpiredTwoFactorOTP: { type: Number, default: 0 },
    resetPasswordOTP: { type: String, default: "", maxLength: 6 },
    isExpiredResetPasswordOTP: { type: Number, default: 0 },
  },
  { timestamps: true }
); //auths model schema

const AuthModel = mongoose.models.Auths || mongoose.model("Auths", AuthSchema);

export default AuthModel;
