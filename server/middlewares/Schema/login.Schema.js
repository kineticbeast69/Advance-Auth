import Joi from "joi";

const loginSchema = Joi.object({
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

export default loginSchema;
