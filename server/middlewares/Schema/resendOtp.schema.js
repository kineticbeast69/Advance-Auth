import Joi from "joi";

const resendOtp = Joi.object({
  email: Joi.string().required().email().messages({
    "any.reuqired": "Email is required",
    "string.email": "Enter the valid meail address",
  }),
});
export default resendOtp;
