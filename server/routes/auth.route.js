import express from "express";

// controller function
import {
  login,
  register,
  verifyTwoFactorOtp,
  resendOtp,
  logout,
  resetPasswordOtp,
  expiredResetPasswordOtp,
  expiredEmailOtp,
  emailVerificationOtp,
} from "../controller/auth.controller.js";

// middlewares
import { loginMiddleware } from "../middlewares/login.middleware.js";
import { registerMiddleware } from "../middlewares/register.middleware.js";
import { twoFactorOtpMiddleware } from "../middlewares/twoFactorOtp.middleware.js";
import { resendOtpMiddleware } from "../middlewares/resendOtp.middleware.js";
import { resetPasswordMiddleware } from "../middlewares/resetPassword.middleware.js";
import { updatePasswordMiddleware } from "../middlewares/updatePassword.middleware.js";
import { authUserMiddleware } from "../middlewares/authUser.middleware.js";

const AuthRoute = express.Router();

// routes
AuthRoute.post("/register", registerMiddleware, register); //regsiter route
AuthRoute.post("/login", loginMiddleware, login); //login route
AuthRoute.post("/verify-user-otp", twoFactorOtpMiddleware, verifyTwoFactorOtp); //two factor otp
AuthRoute.get("/resend-otp", resendOtpMiddleware, resendOtp); //resending the otp
AuthRoute.delete("/logout", logout); //loggin out the user
AuthRoute.post("/reset-password", resetPasswordMiddleware, resetPasswordOtp); //reseting the password otp
AuthRoute.put(
  "/update-password",
  updatePasswordMiddleware,
  expiredResetPasswordOtp
); //updating the password
AuthRoute.get(
  //sending the email verification otp
  "/email-verification-otp",
  authUserMiddleware,
  emailVerificationOtp
);
AuthRoute.put(
  "/verifying-email",
  authUserMiddleware,
  twoFactorOtpMiddleware,
  expiredEmailOtp
); //verfiying the otp

export default AuthRoute;
