import Joi from "joi";

const twoFactorSchema = Joi.object({
  otp: Joi.string().required().min(6).max(6).messages({
    "any.required": "OTP is required.",
    "string.min": "OTP must have 6 characters.",
  }),
  email: Joi.string().required().email().messages({
    "any.required": "Email is required.",
    "string.email": "Enter the valid email address.",
  }),
});

export default twoFactorSchema;
