import jwt from "jsonwebtoken";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

// ========================================
// PROTECT ROUTES
// ========================================
const protect = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;

    // ========================================
    // CHECK TOKEN
    // ========================================
    if (!token) {
      throw new ApiError(401, "Authentication required. Please login.");
    }

    // ========================================
    // VERIFY TOKEN
    // ========================================
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new ApiError(401, "Invalid or expired token");
    }

    // ========================================
    // ATTACH USER TO REQUEST
    // ========================================
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    // ========================================
    // CONTINUE
    // ========================================
    next();
  }
);

export default protect;

