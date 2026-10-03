import express from "express";

import {
  createComment,
  getReelComments,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();


// ==========================================
// Get all comments of a reel
// ==========================================
router.get("/reel/:reelId",getReelComments);

// ==========================================
// Create a comment
// ==========================================
router.post("/reel/:reelId",protect,createComment);

// ==========================================
// Update a comment
// ==========================================
router.patch("/:commentId",protect,updateComment);

// ==========================================
// Delete a comment
// ==========================================
router.delete("/:commentId",protect,deleteComment);

export default router;
