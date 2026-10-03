import ApiError from "../utils/apiError.js";

// ========================================
// ROLE AUTHORIZATION MIDDLEWARE
// ========================================
const role = (...allowedRoles) => { 
    return (req, res, next) => {
    // ========================================
    // CHECK AUTHENTICATION
    // ========================================
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    // ========================================
    // CHECK USER ROLE
    // ========================================
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "You do not have permission to access this resource");
    }

    // ========================================
    // CONTINUE
    // ========================================
    next();
  };
};

export default role;
