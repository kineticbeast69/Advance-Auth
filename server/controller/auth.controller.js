import AuthModel from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import { transporter } from "../config/mailer.js";
import jwt from "jsonwebtoken";

// register function for adding new user
const register = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const userExist = await AuthModel.findOne({ email }); //find the user exists or not
    if (userExist)
      return res
        .status(409)
        .json({ message: "User already exists.Please login", status: false });

    // crypting the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); //hashed password

    // otp generation and saving otp
    const registerOtp = String(Math.floor(100000 + Math.random() * 900000));
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    // email template
    // const emailTemplate = `
    //   <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    //     <table width="100%" cellpadding="0" cellspacing="0" border="0">
    //       <tr>
    //         <td align="center">
    //           <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 20px; border-radius: 6px; box-shadow: 0 0 5px rgba(0,0,0,0.1);">
    //             <tr>
    //               <td align="center" style="padding-bottom: 20px;">
    //                 <h2 style="color: #333;">Thank You for Registering!</h2>
    //               </td>
    //             </tr>
    //             <tr>
    //               <td style="font-size: 16px; color: #555;">
    //                 <p>Hello ${name.replace(/</g, "&lt;")},</p>
    //                 <p>Thanks for signing up. Please use the following One-Time Password (OTP) to verify your account:</p>
    //                 <p style="font-size: 24px; font-weight: bold; color: #222; background-color: #f2f2f2; padding: 10px 20px; display: inline-block; border-radius: 4px;">
    //                   ${otp}
    //                 </p>
    //                 <p>This OTP is valid for the next 2 minutes.</p>
    //                 <p>If you did not request this, you can safely ignore this email.</p>
    //                 <p>Regards,<br>Advance Auth</p>
    //               </td>
    //             </tr>
    //           </table>
    //         </td>
    //       </tr>
    //     </table>
    //   </body>
    // `;
    // // mailing the otp
    // await transporter.sendMail({
    //   from: process.env.SMTP_SENDER_EMAIL,
    //   to: email,
    //   subject: "OTP verification",
    //   html: emailTemplate,
    // });

    // saving the user info
    const user = new AuthModel({
      name: name,
      email: email,
      password: hashedPassword,
      twoFactorOTP: registerOtp,
      isExpiredTwoFactorOTP: otpExpiry,
    });
    await user.save();
    return res.status(200).json({
      message: "OTP has been sent to your registered Email.",
      status: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error." });
  }
};

// login function the existing user
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await AuthModel.findOne({ email: email });
    // user registered or not
    if (!user)
      return res.status(409).json({
        status: false,
        message: "No user found.Try again",
      });
    // passsowrd matching
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(409)
        .json({ status: false, message: "Invalid Password! try again" });

    // otp generation
    const loginOtp = String(Math.floor(100000 + Math.random() * 900000));
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    // saving the otp
    user.twoFactorOTP = loginOtp;
    user.isExpiredTwoFactorOTP = otpExpiry;
    await user.save();

    // email template
    // const emailTemplate = `
    //   <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    //     <table width="100%" cellpadding="0" cellspacing="0" border="0">
    //       <tr>
    //         <td align="center">
    //           <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 20px; border-radius: 6px; box-shadow: 0 0 5px rgba(0,0,0,0.1);">
    //             <tr>
    //               <td align="center" style="padding-bottom: 20px;">
    //                 <h2 style="color: #333;">Thank You for Login!</h2>
    //               </td>
    //             </tr>
    //             <tr>
    //               <td style="font-size: 16px; color: #555;">
    //                 <p>Hello ${user.name},</p>
    //                 <p>Thanks for Login. Please use the following One-Time Password (OTP) to verify your account:</p>
    //                 <p style="font-size: 24px; font-weight: bold; color: #222; background-color: #f2f2f2; padding: 10px 20px; display: inline-block; border-radius: 4px;">
    //                   ${otp}
    //                 </p>
    //                 <p>This OTP is valid for the next 2 minutes.</p>
    //                 <p>If you did not request this, you can safely ignore this email.</p>
    //                 <p>Regards,<br>Advance Auth</p>
    //               </td>
    //             </tr>
    //           </table>
    //         </td>
    //       </tr>
    //     </table>
    //   </body>
    // `;

    // // sending the email
    // await transporter.sendEmail({
    //   from: process.env.SMTP_SENDER_EMAIL,
    //   to: user.email,
    //   subject: "OTP verification",
    //   html: emailTemplate,
    // });

    return res.status(200).json({
      status: true,
      message: "Login OTP has been send to your registered email",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};

// verifying otp for login and register
const verifyTwoFactorOtp = async (req, res) => {
  const { otp, email } = req.body;
  if (!email) return res.status(400).json({ message: "Can't find the email" });
  try {
    const user = await AuthModel.findOne({
      email: email,
    });
    if (!user) return res.status(409).json({ message: "Invalid user." });

    // checking the otp expires
    if (user.isExpiredTwoFactorOTP < Date.now())
      return res
        .status(409)
        .json({ status: false, message: "OTP expires!Try again" });

    // checking the otp
    if (user.twoFactorOTP !== String(otp))
      return res.status(409).json({ status: false, message: "Invalid OTP!" });

    // token generation
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    // saving the token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_COOKIE_ENV === "production",
      sameSite:
        process.env.NODE_COOKIE_ENV === "production" ? "none" : "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // setting the twoFactorotp and expires to its default state
    user.twoFactorOTP = "";
    user.isExpiredTwoFactorOTP = 0;
    await user.save();

    return res
      .status(200)
      .json({ status: true, message: "Logged in succesfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error." });
  }
};

// re-sending the two factor otp
const resendOtp = async (req, res) => {
  const { email } = req.query;
  if (!email)
    return res
      .status(409)
      .json({ status: false, message: "Email is required." });
  try {
    const user = await AuthModel.findOne({ email: email });
    if (!user) return res.status(409).json({ message: "No user found." });

    // otp generation
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    // saving the otp and expiry time

    user.twoFactorOTP = otp;
    user.isExpiredTwoFactorOTP = otpExpiry;
    await user.save();

    // // email template
    // const emailTemplate = `
    //   <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    //     <table width="100%" cellpadding="0" cellspacing="0" border="0">
    //       <tr>
    //         <td align="center">
    //           <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 20px; border-radius: 6px; box-shadow: 0 0 5px rgba(0,0,0,0.1);">
    //             <tr>
    //               <td align="center" style="padding-bottom: 20px;">
    //                 <h2 style="color: #333;">Thank You for Login!</h2>
    //               </td>
    //             </tr>
    //             <tr>
    //               <td style="font-size: 16px; color: #555;">
    //                 <p>Hello ${user.name},</p>
    //                 <p>Thanks for Login. Please use the following One-Time Password (OTP) to verify your account:</p>
    //                 <p style="font-size: 24px; font-weight: bold; color: #222; background-color: #f2f2f2; padding: 10px 20px; display: inline-block; border-radius: 4px;">
    //                   ${otp}
    //                 </p>
    //                 <p>This OTP is valid for the next 2 minutes.</p>
    //                 <p>If you did not request this, you can safely ignore this email.</p>
    //                 <p>Regards,<br>Advance Auth</p>
    //               </td>
    //             </tr>
    //           </table>
    //         </td>
    //       </tr>
    //     </table>
    //   </body>
    // `;

    // // sending the email
    // await transporter.sendEmail({
    //   from: process.env.SMTP_SENDER_EMAIL,
    //   to: user.email,
    //   subject: "OTP verification",
    //   html: emailTemplate,
    // });

    return res
      .status(200)
      .json({ status: true, message: "Otp sent to your registered email." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error." });
  }
};

// logout function
const logout = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(409).json({ message: "cookies is not set" });
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_COOKIE_ENV === "production",
      sameSite:
        process.env.NODE_COOKIE_ENV === "production" ? "none" : "strict",
    });
    return res.status(200).json({ message: "Logged out succesfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};

// sending the reset password otp through email
const resetPasswordOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await AuthModel.findOne({ email: email });
    if (!user)
      return res.status(409).json({
        status: false,
        message: "Inavlid email credentials! Try again.",
      });

    // otp generation
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otpExpire = Date.now() + 5 * 60 * 1000;

    // saving the otp
    user.resetPasswordOTP = otp;
    user.isExpiredResetPasswordOTP = otpExpire;
    await user.save();

    // email template
    // const emailTemplate = `
    //   <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    //     <table width="100%" cellpadding="0" cellspacing="0" border="0">
    //       <tr>
    //         <td align="center">
    //           <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 20px; border-radius: 6px; box-shadow: 0 0 5px rgba(0,0,0,0.1);">
    //             <tr>
    //               <td align="center" style="padding-bottom: 20px;">
    //                 <h2 style="color: #333;">Reset Password OTP!</h2>
    //               </td>
    //             </tr>
    //             <tr>
    //               <td style="font-size: 16px; color: #555;">
    //                 <p>Hello ${user.name},</p>
    //                 <p>Please use the following One-Time Password (OTP) to reset your password:</p>
    //                 <p style="font-size: 24px; font-weight: bold; color: #222; background-color: #f2f2f2; padding: 10px 20px; display: inline-block; border-radius: 4px;">
    //                   ${otp}
    //                 </p>
    //                 <p>This OTP is valid for the next 2 minutes.</p>
    //                 <p>If you did not request this, you can safely ignore this email.</p>
    //                 <p>Regards,<br>Advance Auth</p>
    //               </td>
    //             </tr>
    //           </table>
    //         </td>
    //       </tr>
    //     </table>
    //   </body>
    // `;

    // sending the email
    // await transporter.sendEmail({
    //   from: process.env.SMTP_SENDER_EMAIL,
    //   to: user.email,
    //   subject: "Reset Password OTP",
    //   html: emailTemplate,
    // });

    return res
      .status(200)
      .json({ status: true, message: "OTP sent to your registered email." });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

// verifying the reset password otp and updating the password
const expiredResetPasswordOtp = async (req, res) => {
  const { email, password, otp } = req.body;
  try {
    const user = await AuthModel.findOne({ email: email });
    if (!user)
      return res.status(409).json({
        status: false,
        message: "Invalid email credentials ! Try again",
      });

    // otp expires or not
    if (user.isExpiredResetPasswordOTP < Date.now())
      return res
        .status(409)
        .json({ status: false, message: "OTP expires try again." });

    // verifying the otp
    if (!user.resetPasswordOTP === otp)
      return res
        .status(409)
        .json({ status: false, message: "Invalid otp! Try again" });

    // hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // saving the user info
    user.password = hashedPassword;
    user.resetPasswordOTP = "";
    user.isExpiredResetPasswordOTP = 0;
    await user.save();

    return res
      .status(200)
      .json({ status: true, message: "Password reset succesfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};

// verifying the email verification otp
const expiredEmailOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await AuthModel.findOne({ email: email });

    // otp expiraton
    if (user.isEmailVerificationOTPExpired < Date.now)
      return res
        .status(409)
        .json({ status: false, message: "OTp expires! Try again." });

    // otp verification
    if (!user.emailVerificationOTP === otp)
      return res
        .status(409)
        .json({ status: false, message: "Invalid OTP! Try again." });

    // saving the user info
    user.emailVerificationOTP = "";
    user.isEmailVerificationOTPExpired = 0;
    user.isVerifiedEmail = true;
    await user.save();

    return res
      .status(200)
      .json({ status: true, message: "Email verified succesfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};

// sending the email verification otp
const emailVerificationOtp = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await AuthModel.findById(id); //finding the user

    // otp generaiton
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otpExpires = Date.now() + 1 * 60 * 1000;

    // saving the otp
    user.emailVerificationOTP = otp;
    user.isEmailVerificationOTPExpired = otpExpires;
    await user.save();

    // sending the email
    // const emailTemplate = ``;
    // await transporter.sendMail({
    //   from: process.env.SMTP_SENDER_EMAIL,
    //   to: user.email,
    //   subject: "Reset Password OTP",
    //   html: emailTemplate,
    // });

    return res.status(200).json({
      status: true,
      message: "Email verification otp send on your email.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};
export {
  register,
  login,
  verifyTwoFactorOtp,
  resendOtp,
  logout,
  resetPasswordOtp,
  expiredResetPasswordOtp,
  expiredEmailOtp,
  emailVerificationOtp,
};
