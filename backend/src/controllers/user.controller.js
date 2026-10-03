import User from "../models/User.js";
import Product from "../models/Product.js";
import Reel from "../models/Reel.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

import {
  findUserById,
  comparePassword,
  updateUserProfile,
  changeUserPassword,
  deleteUser,
} from "../services/user.service.js";

// ========================================
// GET MY PROFILE
// ========================================
export const getMyProfile = asyncHandler(async (req, res) => {
    const userId = req.user.userId;

    const user = await findUserById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res.status(200).json({
      success: true,
      user,
    });
  }
);

// ========================================
// UPDATE MY PROFILE
// ========================================
export const updateMyProfile = asyncHandler(async (req, res) => {
    const userId = req.user.userId;

    const {
      name,
      avatar,
      phone,
      bio,
      storeName,
    } = req.body;

    const user = await findUserById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (name !== undefined && !name.trim()) {
      throw new ApiError(400, "Name cannot be empty");
    }

    const updatedUser = await updateUserProfile(userId, {
        name,
        avatar,
        phone,
        bio,
        storeName,
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
});

// ========================================
// CHANGE PASSWORD
// ========================================
export const changePassword = asyncHandler(async (req, res) => {
    const userId = req.user.userId;

    const {currentPassword, newPassword} = req.body;

    if (!currentPassword || !newPassword) {
      throw new ApiError(400, "Current password and new password are required");
    }

    if (newPassword.length < 6) {
      throw new ApiError(400, "New password must be at least 6 characters");
    }

    const user = await findUserById(userId, true);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await comparePassword(currentPassword, user.password);

    if (!isPasswordCorrect) {
      throw new ApiError(401, "Current password is incorrect");
    }

    await changeUserPassword(userId, newPassword);

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  });

// ========================================
// GET PUBLIC USER PROFILE
// ========================================
export const getPublicUserProfile = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("name avatar bio role createdAt")
      .lean();

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const productCount = await Product.countDocuments({
        seller: userId,
        isAvailable: true,
    });

    const reelCount = await Reel.countDocuments({
        seller: userId,
        isPublished: true,
    });

    return res.status(200).json({
      success: true,
      user,
      stats: {
        productCount,
        reelCount,
      },
    });
});

// ========================================
// DELETE MY ACCOUNT
// ========================================
export const deleteMyAccount = asyncHandler(async (req, res) => {
    const userId = req.user.userId;

    const user = await findUserById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    await deleteUser(userId);

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
});

// ========================================
// BECOME A SELLER
// ========================================
export const becomeSeller = asyncHandler(async (req, res) => {
  const user = await findUserById(req.user.userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role === "seller") {
    throw new ApiError(409, "This account is already a seller");
  }

  const updatedUser = await updateUserProfile(req.user.userId, {
    role: "seller",
    storeName: req.body.storeName,
  });

  return res.status(200).json({
    success: true,
    message: "Your seller shop is ready",
    user: updatedUser,
  });
});
