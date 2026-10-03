import Joi from "joi";

export const becomeSellerSchema = Joi.object({
  storeName: Joi.string().trim().min(2).max(100).required(),
}).required();

export const updateUserProfileSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50),

  avatar: Joi.string()
    .trim()
    .uri()
    .allow(""),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .allow("")
    .messages({
      "string.pattern.base": "Phone number must be exactly 10 digits",
    }),

  bio: Joi.string()
    .trim()
    .max(500)
    .allow(""),

  storeName: Joi.string()
    .trim()
    .max(100)
    .allow(""),
}).min(1);

export const updateSellerProfileSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50),

  avatar: Joi.string()
    .trim()
    .uri()
    .allow(""),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .allow("")
    .messages({
      "string.pattern.base": "Phone number must be exactly 10 digits",
    }),

  bio: Joi.string()
    .trim()
    .max(500)
    .allow(""),

  storeName: Joi.string()
    .trim()
    .min(2)
    .max(100),
}).min(1);

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      "string.empty": "Current password is required",
      "any.required": "Current password is required",
    }),

  newPassword: Joi.string()
    .min(6)
    .max(100)
    .required()
    .messages({
      "string.empty": "New password is required",
      "string.min": "New password must be at least 6 characters",
      "string.max": "New password cannot exceed 100 characters",
      "any.required": "New password is required",
    }),

  confirmPassword: Joi.any()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Please confirm your new password",
    }),
});
