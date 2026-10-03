import express from "express";

import {
  getSellerProfile,
  updateSellerProfile,
  getSellerDashboard,
  getSellerProducts,
  getSellerReels,
  getSellerOrders,
  getPublicSellerProfile,
} from "../controllers/seller.controller.js";

import protect from "../middleware/auth.middleware.js";
import role from "../middleware/role.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  updateSellerProfileSchema,
} from "../validations/user.validation.js";

const router = express.Router();


// ==========================================
// SELLER ROUTES
// ==========================================

// Seller dashboard
router.get("/dashboard",protect,role("seller"),getSellerDashboard);

// Seller profile
router.get("/profile",protect,role("seller"),getSellerProfile);

// Update seller profile
router.patch("/profile",protect,role("seller"),validate(updateSellerProfileSchema),updateSellerProfile);

// Seller products
router.get("/products",protect,role("seller"),getSellerProducts);

// Seller reels
router.get("/reels",protect,role("seller"),getSellerReels); 

// Seller orders
router.get("/orders",protect,role("seller"),getSellerOrders);

// ==========================================
// PUBLIC SELLER PROFILE
// ==========================================

router.get("/:sellerId/public",getPublicSellerProfile);


export default router;
