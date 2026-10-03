import Joi from "joi";

// ========================================
// CREATE PRODUCT VALIDATION
// ========================================

export const createProductSchema = Joi.object({
  category: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Category is required",
      "any.required": "Category is required",
    }),

  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "Product name is required",
      "string.min": "Product name must be at least 2 characters",
      "string.max": "Product name cannot exceed 100 characters",
      "any.required": "Product name is required",
    }),

  description: Joi.string()
    .trim()
    .min(10)
    .max(2000)
    .required()
    .messages({
      "string.empty": "Product description is required",
      "string.min": "Description must be at least 10 characters",
      "string.max": "Description cannot exceed 2000 characters",
      "any.required": "Product description is required",
    }),

  price: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      "number.base": "Price must be a number",
      "number.positive": "Price must be greater than 0",
      "any.required": "Price is required",
    }),

  stock: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      "number.base": "Stock must be a number",
      "number.integer": "Stock must be a whole number",
      "number.min": "Stock cannot be negative",
      "any.required": "Stock is required",
    }),

  images: Joi.array()
    .items(
      Joi.string()
        .trim()
        .uri()
        .messages({
          "string.uri": "Each image must be a valid URL",
        })
    )
    .default([])
    .messages({
      "array.base": "Images must be an array",
    }),
});

// ========================================
// UPDATE PRODUCT VALIDATION
// ========================================

export const updateProductSchema = Joi.object({
  category: Joi.string()
    .trim(),

  name: Joi.string()
    .trim()
    .min(2)
    .max(100),

  description: Joi.string()
    .trim()
    .min(10)
    .max(2000),

  price: Joi.number()
    .positive()
    .precision(2),

  stock: Joi.number()
    .integer()
    .min(0),

  images: Joi.array()
    .items(
      Joi.string()
        .trim()
        .uri()
        .messages({
          "string.uri": "Each image must be a valid URL",
        })
    ),

  isAvailable: Joi.boolean(),
}).min(1);

// ========================================
// UPDATE STOCK VALIDATION
// ========================================

export const updateStockSchema = Joi.object({
  stock: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      "number.base": "Stock must be a number",
      "number.integer": "Stock must be a whole number",
      "number.min": "Stock cannot be negative",
      "any.required": "Stock is required",
    }),
});
