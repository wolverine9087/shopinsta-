import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import generateToken from "../utils/generateToken.js";

import {
  findUserByEmail,
  findUserById,
  createUser,
  comparePassword,
} from "../services/user.service.js";

// ==========================================
// Register User
// ==========================================

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  // Create user
  const user = await createUser({
    name,
    email,
    password,
    role: role || "user",
  });

  // Generate JWT
  const token = generateToken(user);

  // Set authentication cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// ==========================================
// Login User
// ==========================================

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user including password
  const user = await findUserByEmail(email, true);

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Compare password
  const isPasswordCorrect = await comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate JWT
  const token = generateToken(user);

  // Set authentication cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// ==========================================
// Logout User
// ==========================================

export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

// ==========================================
// Get Current User
// ==========================================

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await findUserById(req.user.userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json({
    success: true,
    user,
  });
});

