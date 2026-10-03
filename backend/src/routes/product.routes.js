import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  getSellerProducts,
  updateProduct,
  deleteProduct,
  updateProductStock,
} from "../controllers/product.controller.js";

import protect from "../middleware/auth.middleware.js";
import role from "../middleware/role.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { uploadProductImages } from "../middleware/upload.middleware.js";

import {
  createProductSchema,
  updateProductSchema,
  updateStockSchema,
} from "../validations/product.validation.js";

const router = express.Router();


// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get all products
router.get("/",getProducts);

// Get single product
router.get("/:productId",getProductById);

// ==========================================
// SELLER ROUTES
// ==========================================

// Get seller's products
router.get("/seller/my-products",protect,role("seller"),getSellerProducts);

// Create product
router.post("/",protect,role("seller"),uploadProductImages,validate(createProductSchema),createProduct);

// Update product
router.patch("/:productId",protect,role("seller"),validate(updateProductSchema),updateProduct);

// Delete product
router.delete("/:productId",protect,role("seller"),deleteProduct);

// Update stock
router.patch("/:productId/stock",protect,role("seller"),validate(updateStockSchema),updateProductStock);


export default router;
