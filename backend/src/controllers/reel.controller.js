import Reel from "../models/Reel.js";
import Product from "../models/Product.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { uploadImage, uploadVideo } from "../services/media.service.js";

// ========================================
// CREATE REEL
// ========================================
export const createReel = asyncHandler(async (req, res) => {
    const {
      product,
      videoUrl,
      thumbnailUrl,
      caption,
    } = req.body;

    const sellerId = req.user.userId;

    const videoFile = req.files?.video?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    // Validate required fields
    if (!product || (!videoFile && !videoUrl)) {
      throw new ApiError(400 ,"Product and video file are required");
    }

    // Check product
    const productExists = await Product.findById(product);

    if (!productExists) {
      throw new ApiError(404 ,"Product not found");
    }

    // Check product ownership
    if (productExists.seller.toString() !== sellerId.toString()) {
      throw new ApiError(403 ,"You can create reels only for your own products");
    }

    const uploadedVideoUrl = videoFile
      ? (await uploadVideo(videoFile.buffer, "shopinsta/reels")).url
      : videoUrl;
    const uploadedThumbnailUrl = thumbnailFile
      ? (await uploadImage(thumbnailFile.buffer, "shopinsta/reel-thumbnails")).url
      : thumbnailUrl;

    // Create reel
    const reel = await Reel.create({
      seller: sellerId,
      product,
      videoUrl: uploadedVideoUrl,
      thumbnailUrl: uploadedThumbnailUrl || "",
      caption: caption || "",
    });

    // Populate related data
    await reel.populate([
      {
        path: "seller",
        select: "name avatar",
      },
      {
        path: "product",
        select:"name price images stock isAvailable",
      },
    ]);

    return res.status(201).json({
      success: true,
      message: "Reel created successfully",
      reel,
    });
  }
);

// ========================================
// GET ALL REELS
// ========================================
export const getReels = asyncHandler(async (req, res) => {
    const filter = { isPublished: true };
    const totalReels = await Reel.countDocuments(filter);
    const categoryLikes = new Map();

    if (req.user?.userId) {
      const likedReels = await Reel.find({ ...filter, likes: req.user.userId })
        .select("product")
        .lean();
      const likedProducts = await Product.find({
        _id: { $in: likedReels.map((reel) => reel.product) },
      }).select("category").lean();

      likedProducts.forEach((product) => {
        if (product.category) {
          const categoryId = product.category.toString();
          categoryLikes.set(categoryId, (categoryLikes.get(categoryId) || 0) + 1);
        }
      });
    }

    const reels = await Reel.find(filter)
      .populate("seller", "name avatar")
      .populate({ path: "product", select: "name price images stock isAvailable category", populate: { path: "category", select: "name" } })
      .lean();

    const maxCategoryLikes = Math.max(0, ...categoryLikes.values());
    const rankedReels = reels
      .map((reel) => {
        const categoryId = reel.product?.category?._id?.toString();
        const categoryAffinity = maxCategoryLikes
          ? (categoryLikes.get(categoryId) || 0) / maxCategoryLikes
          : 0;
        const likes = reel.likes?.length || 0;
        const views = reel.views || 0;
        const engagement = likes / Math.max(views, likes, 1);
        const ageInDays = Math.max(
          0,
          (Date.now() - new Date(reel.createdAt).getTime()) / 86_400_000
        );
        const freshness = 1 / (1 + ageInDays / 14);

        return {
          reel,
          score:
            categoryAffinity * 4 +
            engagement * 1.25 +
            Math.log1p(likes) * 0.35 +
            freshness * 0.5,
        };
      })
      .sort((a, b) =>
        b.score - a.score ||
        new Date(b.reel.createdAt) - new Date(a.reel.createdAt)
      )
      .map(({ reel }) => reel);

    return res.status(200).json({
      success: true,
      count: rankedReels.length,
      total: totalReels,
      page: 1,
      pages: totalReels > 0 ? 1 : 0,
      reels: rankedReels,
    });
  }
);

// ========================================
// GET SINGLE REEL
// ========================================
export const getReelById = asyncHandler(async (req, res) => {
    const { reelId } = req.params;

    const reel = await Reel.findOne({
      _id: reelId,
      isPublished: true,
    })
      .populate("seller", "name avatar")
      .populate("product","name description price images stock isAvailable")
      .lean();

    if (!reel) {
      throw new ApiError(404 ,"Reel not found");
    }

    return res.status(200).json({
      success: true,
      reel,
    });
  }
);

// ========================================
// GET SELLER REELS
// ========================================
export const getSellerReels = asyncHandler(async (req, res) => {
    const sellerId = req.user.userId; 

    const reels = await Reel.find({
      seller: sellerId, 
    })
      .populate("product" ,"name price images stock isAvailable")
      .sort({ createdAt: -1 }) 
      .lean();

    return res.status(200).json({
      success: true,
      count: reels.length,
      reels,
    });
  }
);

// ========================================
// UPDATE REEL
// ========================================
export const updateReel = asyncHandler(async (req, res) => {
    const { reelId } = req.params;

    const {
      caption,
      thumbnailUrl,
      isPublished,
    } = req.body;

    const sellerId = req.user.userId;

    // Find reel
    const reel = await Reel.findById(reelId);

    if (!reel) {
      throw new ApiError(404, "Reel not found");
    }

    // Check ownership
    if (reel.seller.toString() !== sellerId.toString()) {
      throw new ApiError(403, "You can update only your own reels");
    }

    // Update caption
    if (caption !== undefined) {
      reel.caption = caption.trim();
    }

    // Update thumbnail
    if (thumbnailUrl !== undefined) {
      reel.thumbnailUrl = thumbnailUrl;
    }

    // Publish / unpublish
    if (isPublished !== undefined) {
      reel.isPublished = isPublished;
    }

    await reel.save();

    // Populate related data
    await reel.populate([
      {
        path: "seller",
        select: "name avatar",
      },
      {
        path: "product",
        select:
          "name price images stock isAvailable",
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Reel updated successfully",
      reel,
    });
  }
);

// ========================================
// DELETE REEL
// ========================================
export const deleteReel = asyncHandler(async (req, res) => {
    const { reelId } = req.params;

    const sellerId = req.user.userId;

    // Find reel
    const reel = await Reel.findById(reelId);

    if (!reel) {
      throw new ApiError(404, "Reel not found");
    }

    // Check ownership
    if (reel.seller.toString() !== sellerId.toString()) {
      throw new ApiError(403, "You can delete only your own reels");
    }

    await Reel.findByIdAndDelete(reelId);

    return res.status(200).json({
      success: true,
      message: "Reel deleted successfully",
    });
  }
);

// ========================================
// LIKE / UNLIKE REEL
// ========================================
export const toggleLike = asyncHandler(async (req, res) => {
    const { reelId } = req.params;

    const userId = req.user.userId;

    // Find reel
    const reel = await Reel.findById(reelId);

    if (!reel) {
      throw new ApiError(404, "Reel not found");
    }

    // Check whether user already liked
    const alreadyLiked = reel.likes.some(
      (id) =>
        id.toString() ===
        userId.toString()
    );

    // ========================================
    // UNLIKE
    // ========================================
    if (alreadyLiked) {
      reel.likes = reel.likes.filter(
        (id) =>
          id.toString() !==
          userId.toString()
      );

      await reel.save();

      return res.status(200).json({
        success: true,
        message: "Reel unliked",
        liked: false,
        likesCount: reel.likes.length,
      });
    }

    // ========================================
    // LIKE
    // ========================================
    reel.likes.push(userId);

    await reel.save();

    return res.status(200).json({
      success: true,
      message: "Reel liked",
      liked: true,
      likesCount: reel.likes.length,
    });
  }
);

// ========================================
// INCREMENT VIEWS
// ========================================
export const incrementViews = asyncHandler(async (req, res) => {
    const { reelId } = req.params;

    const reel = await Reel.findByIdAndUpdate(reelId,
        {
          $inc: {
            views: 1,
          },
        },
        {
          new: true,
        }
    );

    if (!reel) {
      throw new ApiError(404, "Reel not found");
    }

    return res.status(200).json({
      success: true,
      views: reel.views,
    });
  }
);
