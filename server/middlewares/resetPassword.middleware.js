import resetPasswordOtp from "./Schema/resetPassword.schema.js";

export const resetPasswordMiddleware = (req, res, next) => {
  const { error } = resetPasswordOtp.validate(req.user);
  if (error)
    return res
      .status(409)
      .json({ status: false, message: error.details[0].message });
  next();
};
