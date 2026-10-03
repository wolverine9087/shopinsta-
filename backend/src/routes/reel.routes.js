import express from "express";

import {
  createReel,
  getReels,
  getReelById,
  getSellerReels,
  updateReel,
  deleteReel,
  toggleLike,
  incrementViews,
} from "../controllers/reel.controller.js";

import protect from "../middleware/auth.middleware.js";
import role from "../middleware/role.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { uploadReelMedia } from "../middleware/upload.middleware.js";
import optionalAuth from "../middleware/optionalAuth.middleware.js";

import {
  createReelSchema,
  updateReelSchema,
} from "../validations/reel.validation.js";

const router = express.Router();


// ==========================================
// SELLER - SPECIFIC ROUTES FIRST
// ==========================================
router.get("/seller/my-reels",protect,role("seller"),getSellerReels);

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get all reels
router.get("/",optionalAuth,getReels);

// ==========================================
// SELLER - CREATE
// ==========================================
router.post("/",protect,role("seller"),uploadReelMedia,validate(createReelSchema),createReel);

// ==========================================
// REEL ACTIONS
// ==========================================

// Like / unlike reel
router.patch("/:reelId/like",protect,toggleLike);

// Increment views
router.patch("/:reelId/view",incrementViews);

// ==========================================
// SELLER - UPDATE / DELETE
// ==========================================

// Update reel
router.patch("/:reelId",protect,role("seller"),validate(updateReelSchema),updateReel);

// Delete reel
router.delete("/:reelId",protect,role("seller"),deleteReel);

// ==========================================
// SINGLE REEL
// ==========================================

router.get("/:reelId",getReelById);

export default router;
