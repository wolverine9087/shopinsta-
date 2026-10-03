import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ==========================================
    // Basic information
    // ==========================================
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // ==========================================
    // Authentication
    // ==========================================
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "seller"],
      default: "user",
    },

    // ==========================================
    // Profile
    // ==========================================
    avatar: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    // ==========================================
    // Seller information
    // ==========================================
    storeName: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model(
  "User",
  userSchema
);

export default User;
