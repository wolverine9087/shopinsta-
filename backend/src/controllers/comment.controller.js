import Comment from "../models/Comment.js";
import Reel from "../models/Reel.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

// ========================================
// CREATE COMMENT
// ========================================
export const createComment = asyncHandler(async (req, res) => {
  const { reelId } = req.params;
  const { text } = req.body;

  const userId = req.user.userId;

  // Validate comment text
  if (!text || !text.trim()) {
    throw new ApiError(400, "Comment text is required");
  }

  // Check whether reel exists
  const reel = await Reel.findById(reelId);

  if (!reel) {
    throw new ApiError(404 ,"Reel not found");
  }

  // Create comment
  const comment = await Comment.create({
    text: text.trim(),
    user: userId,
    reel: reelId,
  });

  // Populate user details
  await comment.populate(
    "user",
    "name avatar"
  );

  return res.status(201).json({
    success: true,
    message: "Comment created successfully",
    comment,
  });
});

// ========================================
// GET COMMENTS OF A REEL
// ========================================
export const getReelComments = asyncHandler(async (req, res) => {
    const { reelId } = req.params;

    // Check whether reel exists
    const reel = await Reel.findById(reelId);

    if (!reel) {
      throw new ApiError(404 ,"Reel not found");
    }

    // Find comments of this reel
    const comments = await Comment.find({ reel: reelId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  }
);

// ========================================
// UPDATE COMMENT
// ========================================
export const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { text } = req.body;

    const userId = req.user.userId;

    // Validate comment text
    if (!text || !text.trim()) {
      throw new ApiError(400 ,"Comment text is required");
    }

    // Find comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new ApiError(404 ,"Comment not found");
    }

    // Check comment ownership
    if (comment.user.toString() !== userId.toString()) {
      throw new ApiError(403  ,"You can update only your own comment");
    }

    // Update comment
    comment.text = text.trim();

    await comment.save();

    // Populate user details
    await comment.populate("user","name avatar");

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      comment,
    });
  }
);

// ========================================
// DELETE COMMENT
// ========================================
export const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const userId = req.user.userId;

    // Find comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new ApiError(404 ,"Comment not found");
    }

    // Check comment ownership
    if (comment.user.toString() !== userId.toString()) {
      throw new ApiError(403 ,"You can delete only your own comment");
    }

    // Delete comment
    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  }
);
