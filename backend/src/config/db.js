import mongoose from "mongoose";
import Category from "../models/Category.js";
import { predefinedCategories } from "../data/predefinedCategories.js";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    await Category.bulkWrite(
      predefinedCategories.map(({ name, sortOrder }) => ({
        updateOne: {
          filter: { name },
          update: { $set: { sortOrder } },
          upsert: true,
        },
      }))
    );

    console.log(`MongoDB connected: ${connection.connection.host}`);
    console.log(`Loaded ${predefinedCategories.length} predefined categories`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
