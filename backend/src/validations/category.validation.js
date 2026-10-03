import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "Category name is required",
      "string.min": "Category name must be at least 2 characters",
      "string.max": "Category name cannot exceed 50 characters",
      "any.required": "Category name is required",
    }),

  description: Joi.string()
    .trim()
    .max(500)
    .allow("")
    .default(""),

  image: Joi.string()
    .trim()
    .uri()
    .allow("")
    .default(""),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50),

  description: Joi.string()
    .trim()
    .max(500)
    .allow(""),

  image: Joi.string()
    .trim()
    .uri()
    .allow(""),
}).min(1);
