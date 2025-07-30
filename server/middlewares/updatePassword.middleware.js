import updatePasswordOtp from "./Schema/updatePassword.schema.js";

export const updatePasswordMiddleware = (req, res, next) => {
  const { error } = updatePasswordOtp.validate(req.body);
  if (error)
    return res
      .status(409)
      .json({ status: false, message: error.details[0].message });
  next();
};
