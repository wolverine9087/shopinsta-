import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getSellerOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";

import protect from "../middleware/auth.middleware.js";
import role from "../middleware/role.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  createOrderSchema,
} from "../validations/order.validation.js";

const router = express.Router();


// ==========================================
// USER ROUTES
// ==========================================

// Place an order
router.post("/",protect,validate(createOrderSchema),createOrder);

// Get my orders
router.get("/my-orders",protect,getMyOrders);

// Cancel my order
router.patch("/:orderId/cancel",protect,cancelOrder);

// ==========================================
// SELLER ROUTES
// ==========================================

// Get orders for my products
router.get("/seller/orders",protect,role("seller"),getSellerOrders);

// Update order status
router.patch("/seller/:orderId/status",protect,role("seller"),updateOrderStatus);

// ==========================================
// GET SINGLE ORDER
// ==========================================

// Get single order
router.get("/:orderId",protect,getOrderById);

export default router;
