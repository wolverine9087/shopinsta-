import express from "express";

import {
  getMyProfile,
  updateMyProfile,
  changePassword,
  getPublicUserProfile,
  deleteMyAccount,
  becomeSeller,
} from "../controllers/user.controller.js";

import protect from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  updateUserProfileSchema,
  changePasswordSchema,
  becomeSellerSchema,
} from "../validations/user.validation.js";

const router = express.Router();


// ==========================================
// LOGGED-IN USER PROFILE
// ==========================================

// Get my profile
router.get("/profile",protect,getMyProfile);

// Update my profile
router.patch("/profile",protect,validate(updateUserProfileSchema),updateMyProfile);

// ==========================================
// PASSWORD
// ==========================================

// Change password
router.patch("/password",protect,validate(changePasswordSchema),changePassword);

// ==========================================
// PUBLIC USER PROFILE
// ==========================================

// Get public user profile
router.get("/:userId/public",getPublicUserProfile);

// ==========================================
// ACCOUNT
// ==========================================

router.post("/become-seller",protect,validate(becomeSellerSchema),becomeSeller);

// Delete my account
router.delete("/account",protect,deleteMyAccount);


export default router;
