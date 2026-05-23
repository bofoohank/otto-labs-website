import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    referralCode: {
      type: String,
      trim: true,
      default: "",
    },

    password: {
      type: String,
      required: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    phoneVerified: {
      type: Boolean,
      default: false,
    },

    role: {
  type: String,
  enum: ["Member", "Mod", "Admin"],
  default: "Member",
},

    emailVerifyCode: String,
    emailVerifyExpires: Date,

    phoneVerifyCode: String,
    phoneVerifyExpires: Date,

    resetPasswordCode: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);