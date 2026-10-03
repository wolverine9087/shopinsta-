import express from "express";

import { getCategories, getCategoryById } from "../controllers/category.controller.js";

const router = express.Router();


// ==========================================
// Get all categories
// ==========================================
router.get("/",getCategories);

// ==========================================
// Get single category
// ==========================================
router.get("/:categoryId",getCategoryById);

export default router;
