import Joi from "joi";

// ========================================
// SHIPPING ADDRESS VALIDATION
// ========================================

const shippingAddressSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "Shipping name is required",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name cannot exceed 100 characters",
      "any.required": "Shipping name is required",
    }),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base":
        "Phone number must contain exactly 10 digits",
      "any.required": "Phone number is required",
    }),

  address: Joi.string()
    .trim()
    .min(5)
    .max(300)
    .required()
    .messages({
      "string.empty": "Address is required",
      "string.min": "Address must be at least 5 characters",
      "string.max": "Address cannot exceed 300 characters",
      "any.required": "Address is required",
    }),

  city: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "City is required",
      "string.min": "City must be at least 2 characters",
      "string.max": "City cannot exceed 100 characters",
      "any.required": "City is required",
    }),

  state: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "State is required",
      "string.min": "State must be at least 2 characters",
      "string.max": "State cannot exceed 100 characters",
      "any.required": "State is required",
    }),

  pincode: Joi.string()
    .trim()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      "string.empty": "Pincode is required",
      "string.pattern.base":
        "Pincode must contain exactly 6 digits",
      "any.required": "Pincode is required",
    }),
});

// ========================================
// CREATE ORDER VALIDATION
// ========================================

export const createOrderSchema = Joi.object({
  productId: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Product ID is required",
      "any.required": "Product ID is required",
    }),

  quantity: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .required()
    .messages({
      "number.base": "Quantity must be a number",
      "number.integer": "Quantity must be a whole number",
      "number.min": "Quantity must be at least 1",
      "number.max": "Maximum quantity is 100",
      "any.required": "Quantity is required",
    }),

  shippingAddress: shippingAddressSchema
    .required()
    .messages({
      "any.required": "Shipping address is required",
    }),
});
