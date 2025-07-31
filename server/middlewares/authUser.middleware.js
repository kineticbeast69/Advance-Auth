import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const authUserMiddleware = (req, res, next) => {
  const { token } = req.cookies;
  if (!token)
    return res.status(409).json({ status: false, message: "Invalid token." });
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = { id: decode.id };
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Invalid user token." });
  }
};
