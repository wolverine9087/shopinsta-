import mongoose from "mongoose";

const reelSchema = new mongoose.Schema(
  {
    // Seller who uploaded the reel
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Product shown in the reel
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // Video URL from Cloudinary
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional video thumbnail
    thumbnailUrl: {
      type: String,
      default: "",
      trim: true,
    },

    // Reel caption
    caption: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    // Number of views
    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Users who liked this reel
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Whether the reel is visible
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Reel = mongoose.model("Reel", reelSchema);

export default Reel;
