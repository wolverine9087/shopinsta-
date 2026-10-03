import Category from "../models/Category.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

// ==========================================
// Create Category
// ==========================================

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body;

  // Check if category already exists
  const existingCategory = await Category.findOne({ name: name.trim() });

  if (existingCategory) {
    throw new ApiError(409, "Category already exists");
  }

  // Create category
  const category = await Category.create({
    name: name.trim(),
    description: description?.trim() || "",
    image: image || "",
  });

  return res.status(201).json({
    success: true,
    message: "Category created successfully",
    category,
  });
});

// ==========================================
// Get All Categories
// ==========================================

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ sortOrder: { $exists: true } })
    .sort({ sortOrder: 1 })
    .lean();

  return res.status(200).json({
    success: true,
    count: categories.length,
    categories,
  });
});

// ==========================================
// Get Single Category
// ==========================================

export const getCategoryById = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findOne({ _id: categoryId, sortOrder: { $exists: true } });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res.status(200).json({
    success: true,
    category,
  });
});

// ==========================================
// Update Category
// ==========================================

export const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { name, description, image } = req.body;

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // Check duplicate category name
  if (name !== undefined) {
    const duplicateCategory = await Category.findOne({
      name: name.trim(),
      _id: { $ne: categoryId },
    });

    if (duplicateCategory) {
      throw new ApiError(409, "Category name already exists");
    }

    category.name = name.trim();
  }

  // Update description
  if (description !== undefined) {
    category.description = description.trim();
  }

  // Update image
  if (image !== undefined) {
    category.image = image;
  }

  await category.save();

  return res.status(200).json({
    success: true,
    message: "Category updated successfully",
    category,
  });
});

// ==========================================
// Delete Category
// ==========================================

export const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findByIdAndDelete(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});

