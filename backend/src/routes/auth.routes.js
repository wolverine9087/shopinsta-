import express from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../controllers/auth.controller.js";

import protect from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  registerSchema,
  loginSchema,
} from "../validations/auth.validation.js";

const router = express.Router();


// ==========================================
// Authentication Routes
// ==========================================

// Register
router.post("/register",validate(registerSchema),registerUser);

// Login
router.post("/login",validate(loginSchema),loginUser);

// Logout
router.post("/logout",logoutUser);

// Get currently logged-in user
router.get("/me",protect,getCurrentUser);


export default router;

