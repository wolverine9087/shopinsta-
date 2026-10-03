import User from "../models/User.js";
import Product from "../models/Product.js";
import Reel from "../models/Reel.js";
import Order from "../models/Order.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

// ========================================
// GET SELLER PROFILE
// ========================================
export const getSellerProfile = asyncHandler(async (req, res) => {
    const sellerId = req.user.userId;

    const seller = await User.findById(sellerId)
      .select("-password")
      .lean();

    if (!seller) {
      throw new ApiError(404, "Seller not found");
    }

    if (seller.role !== "seller") {
      throw new ApiError(403, "Only sellers can access this profile");
    }

    return res.status(200).json({
      success: true,
      seller,
    });
  }
);

// ========================================
// UPDATE SELLER PROFILE
// ========================================
export const updateSellerProfile = asyncHandler(async (req, res) => {
    const sellerId = req.user.userId;

    const {
      name,
      avatar,
      phone,
      bio,
      storeName,
    } = req.body;

    const seller = await User.findById(sellerId);

    if (!seller) {
      throw new ApiError(404, "Seller not found");
    }

    if (seller.role !== "seller") {
      throw new ApiError(403, "Only sellers can update this profile");
    }

    // Update name
    if (name !== undefined) {
      if (!name.trim()) {
        throw new ApiError(400, "Name cannot be empty");
      }

      seller.name = name.trim();
    }

    // Update avatar
    if (avatar !== undefined) {
      seller.avatar = avatar;
    }

    // Update phone
    if (phone !== undefined) {
      seller.phone = phone;
    }

    // Update bio
    if (bio !== undefined) {
      seller.bio = bio.trim();
    }

    // Update store name
    if (storeName !== undefined) {
      seller.storeName = storeName.trim();
    }

    await seller.save();

    const updatedSeller = await User.findById(sellerId)
        .select("-password")
        .lean();

    return res.status(200).json({
      success: true,
      message: "Seller profile updated successfully",
      seller: updatedSeller,
    });
  });

// ========================================
// GET SELLER DASHBOARD
// ========================================
export const getSellerDashboard = asyncHandler(async (req, res) => {
    const sellerId = req.user.userId;

    // ========================================
    // PRODUCT STATISTICS
    // ========================================

    const totalProducts = await Product.countDocuments({ seller: sellerId });

    const availableProducts = await Product.countDocuments({
        seller: sellerId,
        isAvailable: true,
      });

    // ========================================
    // REEL STATISTICS
    // ========================================

    const totalReels = await Reel.countDocuments({ seller: sellerId, });

    const reelStats = await Reel.aggregate([
        {
          $match: {
            seller: sellerId,
          },
        },
        {
          $group: {
            _id: null,

            totalViews: {
              $sum: "$views",
            },

            totalLikes: {
              $sum: {
                $size: "$likes",
              },
            },
          },
        },
    ]);

    // ========================================
    // ORDER STATISTICS
    // ========================================

    const totalOrders = await Order.countDocuments({ seller: sellerId });

    const pendingOrders = await Order.countDocuments({
        seller: sellerId,
        orderStatus: "Pending",
      });

    const confirmedOrders = await Order.countDocuments({
        seller: sellerId,
        orderStatus: "Confirmed",
      });

    const shippedOrders = await Order.countDocuments({
        seller: sellerId,
        orderStatus: "Shipped",
      });

    const deliveredOrders = await Order.countDocuments({
        seller: sellerId,
        orderStatus: "Delivered",
      });

    const cancelledOrders = await Order.countDocuments({
        seller: sellerId,
        orderStatus: "Cancelled",
      });

    // ========================================
    // REVENUE
    // ========================================

    const revenueStats = await Order.aggregate([
        {
          $match: {
            seller: sellerId,
            orderStatus: "Delivered",
          },
        },
        {
          $group: {
            _id: null,

            totalRevenue: {
              $sum: "$totalAmount",
            },
          },
        },
    ]);

    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;

    // ========================================
    // REEL STATS VALUES
    // ========================================

    const totalViews = reelStats.length > 0 ? reelStats[0].totalViews : 0;

    const totalLikes = reelStats.length > 0 ? reelStats[0].totalLikes : 0;

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,
      dashboard: {
        products: {
          total: totalProducts,
          available: availableProducts,
        },

        reels: {
          total: totalReels,
          views: totalViews,
          likes: totalLikes,
        },

        orders: {
          total: totalOrders,
          pending: pendingOrders,
          confirmed: confirmedOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders,
        },

        revenue: {
          total: totalRevenue,
        },
      },
    });
});

// ========================================
// GET SELLER PRODUCTS
// ========================================
export const getSellerProducts = asyncHandler(async (req, res) => {
    const sellerId = req.user.userId;

    const products = await Product.find({ seller: sellerId })
      .populate("category","name image")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
});

// ========================================
// GET SELLER REELS
// ========================================
export const getSellerReels = asyncHandler(async (req, res) => {
    const sellerId = req.user.userId;

    const reels = await Reel.find({ seller: sellerId })
      .populate("product", "name price images stock isAvailable")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: reels.length,
      reels,
    });
});

// ========================================
// GET SELLER ORDERS
// ========================================
export const getSellerOrders = asyncHandler(async (req, res) => {
    const sellerId = req.user.userId;

    const {
      status,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = { seller: sellerId };

    // Filter by order status
    if (status) {
      filter.orderStatus = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(filter)
      .populate("product", "name price images")
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const totalOrders = await Order.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: orders.length,
      total: totalOrders,
      page: Number(page),
      pages: Math.ceil(totalOrders / Number(limit)),
      orders,
    });
  });

// ========================================
// GET SELLER PUBLIC PROFILE
// ========================================
export const getPublicSellerProfile =  asyncHandler(async (req, res) => {
    const { sellerId } = req.params;

    const seller = await User.findOne({
      _id: sellerId,
      role: "seller",
    })
      .select("name avatar bio storeName createdAt")
      .lean();

    if (!seller) {
      throw new ApiError(404, "Seller not found");
    }

    const productCount = await Product.countDocuments({
        seller: sellerId,
        isAvailable: true,
    });

    const reelCount = await Reel.countDocuments({
        seller: sellerId,
        isPublished: true,
    });

    return res.status(200).json({
      success: true,
      seller: {
        ...seller,
        productCount,
        reelCount,
      },
    });
});
