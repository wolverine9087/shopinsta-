import bcrypt from "bcryptjs";
import User from "../models/User.js";

import ApiError from "../utils/apiError.js";

// ==========================================
// Find user by ID
// ==========================================
export const findUserById = async (userId, includePassword = false) => {
  let query = User.findById(userId);

  if (includePassword) {
    query = query.select("+password");
  } else {
    query = query.select("-password");
  }

  return await query;
};

// ==========================================
// Find user by email
// ==========================================
export const findUserByEmail = async (email,includePassword = false) => {
  let query = User.findOne({email: email.toLowerCase() });

  if (includePassword) {
    query = query.select("+password");
  } else {
    query = query.select("-password");
  }

  return await query;
};

// ==========================================
// Check password
// ==========================================
export const comparePassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

// ==========================================
// Hash password
// ==========================================
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// ==========================================
// Create user
// ==========================================
export const createUser = async ({
  name,
  email,
  password,
  role = "user",
}) => {
  const hashedPassword = await hashPassword(password);

  return await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role,
  });
};


// ==========================================
// Update user profile
// ==========================================
export const updateUserProfile = async (userId, updates) => {
  const allowedFields = [
    "name",
    "avatar",
    "phone",
    "bio",
    "storeName",
    "role",
  ];

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      if (typeof updates[field] === "string") {
        user[field] = updates[field].trim();
      } else {
        user[field] = updates[field];
      }
    }
  }

  await user.save();

  return user;
};


// ==========================================
// Change password
// ==========================================
export const changeUserPassword = async (userId, newPassword) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.password = await hashPassword(newPassword);

  await user.save();

  return user;
};


// ==========================================
// Delete user
// ==========================================
export const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};
