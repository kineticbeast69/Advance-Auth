import twoFactorSchema from "./Schema/twoFactorOtp.schema.js";

export const twoFactorOtpMiddleware = (req, res, next) => {
  const { error } = twoFactorSchema.validate(req.body);
  if (error)
    return res
      .status(409)
      .json({ status: false, message: error.details[0].message });
  next();
};
