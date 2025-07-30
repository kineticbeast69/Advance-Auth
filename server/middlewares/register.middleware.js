import registerSchema from "./Schema/register.schema.js";

export const registerMiddleware = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error)
    return res
      .status(409)
      .json({ status: false, message: error.details[0].message });
  next();
};
