import loginSchema from "./Schema/login.Schema.js";

export const loginMiddleware = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error)
    return res
      .status(409)
      .json({ status: false, message: error.details[0].message });
  next();
};
