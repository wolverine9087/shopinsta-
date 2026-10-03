import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Product seller
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Product category
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // Product name
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    // Product description
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },

    // Product price
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Available stock
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    // Product images
    images: [
      {
        type: String,
        trim: true,
      },
    ],

    // Product availability
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
