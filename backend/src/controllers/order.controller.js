import Order from "../models/Order.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

import {
  createOrderService,
  cancelOrderService,
} from "../services/order.service.js";

// ========================================
// CREATE ORDER
// ========================================
export const createOrder = asyncHandler(async (req, res) => {
    const { productId ,quantity ,shippingAddress } = req.body;

    const userId = req.user.userId;

    // Create order through service
    const order = await createOrderService({
      userId,
      productId,
      quantity,
      shippingAddress,
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  }
);

// ========================================
// GET MY ORDERS
// ========================================
export const getMyOrders = asyncHandler(async (req, res) => {
    const userId = req.user.userId;

    const orders = await Order.find({user: userId})
      .populate("product","name price images")
      .populate("seller","name email")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  }
);

// ========================================
// GET SINGLE ORDER
// ========================================
export const getOrderById = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const userId = req.user.userId;

    const order = await Order.findById(orderId)
      .populate("product","name price images")
      .populate("seller","name email")
      .populate("user","name email")
      .lean();

    if (!order) {
      throw new ApiError(404 ,"Order not found");
    }

    // Check whether current user is buyer
    const isBuyer = order.user._id.toString() === userId.toString();

    // Check whether current user is seller
    const isSeller = order.seller._id.toString() === userId.toString();

    // Only buyer or seller can view order
    if (!isBuyer && !isSeller) {
      throw new ApiError(403 ,"You are not allowed to view this order");
    }

    return res.status(200).json({
      success: true,
      order,
    });
  }
);

// ========================================
// CANCEL ORDER
// ========================================
export const cancelOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const userId = req.user.userId;

    const order = await cancelOrderService(orderId, userId);

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  }
);

// ========================================
// GET SELLER ORDERS
// ========================================
export const getSellerOrders = asyncHandler(async (req, res) => {
    const sellerId = req.user.userId;

    const orders = await Order.find({ seller: sellerId })
      .populate("product", "name price images")
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  }
);

// ========================================
// UPDATE ORDER STATUS
// ========================================
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const sellerId = req.user.userId;

    const allowedStatuses = [
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    // Validate status
    if (!allowedStatuses.includes(orderStatus)) {
      throw new ApiError(400, "Invalid order status");
    }

    // Find order
    const order = await Order.findById(orderId);

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    // Check seller ownership
    if (order.seller.toString() !== sellerId.toString()) {
      throw new ApiError(403, "You can update only your own orders");
    }

    // Cancelled orders cannot be updated
    if (order.orderStatus === "Cancelled" ) {
      throw new ApiError(400, "Cancelled order cannot be updated");
    }

    // Update order status
    order.orderStatus = orderStatus;

    // COD becomes paid after delivery
    if (orderStatus === "Delivered") {
      order.paymentStatus = "Paid";
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  }
);

