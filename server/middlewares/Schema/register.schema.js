import Joi from "joi";

const registerSchema = Joi.object({
  name: Joi.string().required().min(4).max(100).messages({
    "any.required": "Name is required.",
    "string.min": "Name must have atleast 4 characters.",
    "string.max": "Name can't be longer than 100 characters.",
  }),
  email: Joi.string().required().email().messages({
    "any.required": "Email is required.",
    "string.email": "Enter the valid email address.",
  }),
  password: Joi.string()
    .required()
    .min(5)
    .max(15)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?#&])[A-Za-z\\d@$!%*?#&]{8,}$"
      )
    )
    .messages({
      "any.required": "Password is required.",
      "string.min": "Password must have 5 characters.",
      "string.max": "Password can't be longer 15 characters.",
      "string.pattern.base":
        "Password must include uppercase, lowercase, number, and special character.",
    }),
});

export default registerSchema;
