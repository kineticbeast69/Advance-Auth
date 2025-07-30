import Joi from "joi";

const resetPasswordOtp = Joi.object({
  email: Joi.string().required().email().messages({
    "any.required": "Email is required.",
    "string.email": "Enter the valid email address.",
  }),
});
export default resetPasswordOtp;
