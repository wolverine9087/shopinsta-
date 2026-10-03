import Product from "../models/Product.js";
import Category from "../models/Category.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { uploadImage } from "../services/media.service.js";

// ========================================
// CREATE PRODUCT
// ========================================
export const createProduct = asyncHandler(
  async (req, res) => {
    const {
      name,
      description,
      price,
      stock,
      category,
      images,
    } = req.body;

    const sellerId = req.user.userId;

    // Validate required fields
    if (!name || !description || price === undefined || stock === undefined || !category) {
      throw new ApiError(400, "Name, description, price, stock and category are required");
    }

    // Validate price
    if (price < 0) {
      throw new ApiError(400 ,"Price cannot be negative");
    }

    // Validate stock
    if (stock < 0) {
      throw new ApiError(400 ,"Stock cannot be negative");
    }

    // Check category
    const categoryExists = await Category.findOne({ _id: category, sortOrder: { $exists: true } });

    if (!categoryExists) {
      throw new ApiError(404 ,"Category not found");
    }

    // Create product
    const imageUrls = req.files?.length
      ? await Promise.all(req.files.map(async (file) => (await uploadImage(file.buffer, "shopinsta/products")).url))
      : images || [];

    const product = await Product.create({
      seller: sellerId,
      category,
      name: name.trim(),
      description: description.trim(),
      price,
      stock,
      images: imageUrls,
      isAvailable: stock > 0,
    });

    // Populate seller and category
    await product.populate([
      {
        path: "seller",
        select: "name email avatar",
      },
      {
        path: "category",
        select: "name description image",
      },
    ]);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  }
);

// ========================================
// GET ALL PRODUCTS
// ========================================
export const getProducts = asyncHandler(
  async (req, res) => {
    const {
      category,
      seller,
      search,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {
      isAvailable: true,
    };

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Seller filter
    if (seller) {
      filter.seller = seller;
    }

    // Search by name
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Minimum price
    if (minPrice !== undefined) {
      filter.price = {
        ...filter.price,
        $gte: Number(minPrice),
      };
    }

    // Maximum price
    if (maxPrice !== undefined) {
      filter.price = {
        ...filter.price,
        $lte: Number(maxPrice),
      };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter)
      .populate("seller", "name avatar")
      .populate("category", "name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const totalProducts = await Product.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: products.length,
      total: totalProducts,
      page: Number(page),
      pages: Math.ceil(totalProducts / Number(limit)),
      products,
    });
  }
);

// ========================================
// GET SINGLE PRODUCT
// ========================================
export const getProductById = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const product = await Product.findById(productId)
      .populate("seller" ,"name email avatar")
      .populate("category" ,"name description image")
      .lean();

    if (!product) {
      throw new ApiError(404 ,"Product not found");
    }

    return res.status(200).json({
      success: true,
      product,
    });
  }
);

// ========================================
// GET SELLER PRODUCTS
// ========================================
export const getSellerProducts = asyncHandler(async (req, res) => {
    const sellerId = req.user.userId;

    const products = await Product.find({
      seller: sellerId,
    })
      .populate("category", "name image")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  }
);

// ========================================
// UPDATE PRODUCT
// ========================================
export const updateProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const sellerId = req.user.userId;

    const {
      name,
      description,
      price,
      stock,
      category,
      images,
      isAvailable,
    } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      throw new ApiError(404 ,"Product not found");
    }

    // Check ownership
    if (product.seller.toString() !== sellerId.toString()) {
      throw new ApiError(403 ,"You can update only your own products");
    }

    // Update name
    if (name !== undefined) {
      if (!name.trim()) {
        throw new ApiError(400 ,"Product name cannot be empty");
      }

      product.name = name.trim();
    }

    // Update description
    if (description !== undefined) {
      if (!description.trim()) {
        throw new ApiError(400 ,"Description cannot be empty");
      }

      product.description = description.trim();
    }

    // Update price
    if (price !== undefined) {
      if (price < 0) {
        throw new ApiError(400 ,"Price cannot be negative");
      }

      product.price = price;
    }

    // Update stock
    if (stock !== undefined) {
      if (stock < 0) {
        throw new ApiError(400 ,"Stock cannot be negative");
      }

      product.stock = stock;

      // Automatically update availability
      product.isAvailable = stock > 0;
    }

    // Update category
    if (category !== undefined) {
      const categoryExists = await Category.findById(category);

      if (!categoryExists) {
        throw new ApiError(404 ,"Category not found");
      } 

      product.category = category;
    }

    // Update images
    if (images !== undefined) {
      product.images = images;
    }

    // Manually update availability
    if (isAvailable !== undefined) {
      product.isAvailable = isAvailable;
    }

    await product.save();

    await product.populate([
      {
        path: "seller",
        select: "name email avatar",
      },
      {
        path: "category",
        select: "name description image",
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  }
);

// ========================================
// DELETE PRODUCT
// ========================================
export const deleteProduct = asyncHandler(
  async (req, res) => {
    const { productId } = req.params;

    const sellerId = req.user.userId;

    const product = await Product.findById(productId);

    if (!product) {
      throw new ApiError(404 ,"Product not found");
    }

    // Check ownership
    if (product.seller.toString() !== sellerId.toString()) {
      throw new ApiError(403 ,"You can delete only your own products");
    }

    await Product.findByIdAndDelete(productId);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  }
);

// ========================================
// UPDATE STOCK
// ========================================
export const updateProductStock = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { stock } = req.body;

    const sellerId = req.user.userId;

    // Validate stock
    if (stock === undefined || stock < 0) {
      throw new ApiError(400 ,"Valid stock value is required");
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new ApiError(404 ,"Product not found");
    }

    // Check ownership
    if (product.seller.toString() !== sellerId.toString()) {
      throw new ApiError(403 ,"You can update only your own products");
    }

    product.stock = stock;
    product.isAvailable = stock > 0;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      product,
    });
  });

