import resendOtp from "./Schema/resendOtp.schema.js";

export const resendOtpMiddleware = (req, res, next) => {
  const { error } = resendOtp.validate(req.query);
  if (error) return res.status(409).json({ message: error.details[0].message });
  next();
};
