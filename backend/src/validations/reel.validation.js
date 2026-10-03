import Joi from "joi";

// ========================================
// CREATE REEL VALIDATION
// ========================================

export const createReelSchema = Joi.object({
  product: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Product ID is required",
      "any.required": "Product ID is required",
    }),

  videoUrl: Joi.string()
    .trim()
    .uri()
    .optional()
    .messages({
      "string.empty": "Video URL is required",
      "string.uri": "Video URL must be a valid URL",
      "any.required": "Video URL is required",
    }),

  caption: Joi.string()
    .trim()
    .max(500)
    .allow("")
    .default("")
    .messages({
      "string.max": "Caption cannot exceed 500 characters",
    }),

  thumbnailUrl: Joi.string()
    .trim()
    .uri()
    .allow("")
    .default("")
    .messages({
      "string.uri": "Thumbnail must be a valid URL",
    }),
});

// ========================================
// UPDATE REEL VALIDATION
// ========================================

export const updateReelSchema = Joi.object({
  caption: Joi.string()
    .trim()
    .max(500)
    .allow("")
    .messages({
      "string.max": "Caption cannot exceed 500 characters",
    }),

  thumbnailUrl: Joi.string()
    .trim()
    .uri()
    .allow("")
    .messages({
      "string.uri": "Thumbnail must be a valid URL",
    }),

  isPublished: Joi.boolean()
    .messages({
      "boolean.base": "isPublished must be true or false",
    }),
}).min(1);
