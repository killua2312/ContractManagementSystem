const Joi = require("joi");

const contractSchema = Joi.object({
  client: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Client is required",
    "string.min": "Client must be at least 3 characters long.",
    "string.max": "Client must be at most 50 characters long.",
  }),
  title: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 3 characters long.",
    "string.max": "Title must be at most 50 characters long.",
  }),
  status: Joi.string().valid("Draft", "Finalized").required().messages({
    "any.only": "Status must be one of [Draft, Finalized].",
  }),
  data: Joi.string().required().messages({
    "string.empty": "Contract data is required.",
  }),
});

const querySchema = Joi.object({
  status: Joi.string()
    .valid("Draft", "Finalized")
    .optional()
    .messages({ "any.only": "Status must be either 'Draft' or 'Finalized'" }),
  searchTerm: Joi.alternatives()
    .try(Joi.string().guid({ version: ["uuidv4"] }), Joi.string().allow(""))
    .optional()
    .messages({ "string.base": "Search term must be a valid UUID or string." }),
  page: Joi.number().integer().positive().default(1).messages({
    "number.base": "Page must be a number.",
    "number.positive": "Page must be a positive integer.",
    "number.integer": "Page must be an integer",
  }),
  limit: Joi.number().integer().positive().default(10).messages({
    "number.base": "Limit must be a number.",
    "number.positive": "Limit must be a positive integer.",
    "number.integer": "Limit must be an integer",
  }),
});

const queryIdSchema = Joi.object({
  id: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required(),
});

const updateSchema = Joi.object({
  status: Joi.string()
    .valid("Draft", "Finalized")
    .optional()
    .messages({ "any.only": "Status must be either 'Draft' or 'Finalized'" }),
  data: Joi.string().optional().messages({
    "string.empty": "Contract data is required.",
  }),
});

module.exports = { contractSchema, querySchema, queryIdSchema, updateSchema };
