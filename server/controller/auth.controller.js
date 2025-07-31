import AuthModel from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import { transporter } from "../config/mailer.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
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
    const Otp = String(Math.floor(100000 + Math.random() * 900000));
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    // email template
    const emailTemplate = `<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP Code</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100">
        <div class="max-w-2xl mx-auto my-8 bg-white rounded-lg shadow-md overflow-hidden">
            <div class="bg-indigo-600 py-6 px-8">
                <h1 class="text-3xl font-bold text-white text-center">Two Factor OTP</h1>
            </div>
            <div class="p-8">
                <p class="text-gray-700 mb-6">Hello,${name}</p>
                <p class="text-gray-700 mb-6">Your One-Time Password (OTP) for  verification is:</p>
                <div class="bg-gray-100 rounded-lg p-4 mb-6">
                    <p class="text-4xl font-bold text-center text-indigo-600">${Otp}</p>
                </div>
                <p class="text-gray-700 mb-6">This OTP is valid for <span class="font-semibold">2 minutes</span>. Please do not share this code with anyone.</p>
                <p class="text-gray-700 mb-2">If you didn't request this code, please ignore this email.</p>
                <p class="text-gray-700">Thank you for using our service!</p>
            </div>
            <div class="bg-gray-100 py-4 px-8">
                <p class="text-sm text-gray-600 text-center">&copy; 2024 AD-Auth. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`;
    // // mailing the otp
    await transporter.sendMail(
      {
        from: process.env.SMTP_SENDER_EMAIL,
        to: email,
        subject: "OTP verification",
        html: emailTemplate,
      },
      (error, info) => {
        if (error) return console.log(error);
        console.log(info.response);
      }
    );

    // saving the user info
    const user = new AuthModel({
      name: name,
      email: email,
      password: hashedPassword,
      twoFactorOTP: Otp,
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
    const emailTemplate = `<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP Code</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100">
        <div class="max-w-2xl mx-auto my-8 bg-white rounded-lg shadow-md overflow-hidden">
            <div class="bg-indigo-600 py-6 px-8">
                <h1 class="text-3xl font-bold text-white text-center">OTP Verification</h1>
            </div>
            <div class="p-8">
                <p class="text-gray-700 mb-6">Hello,${user.name}</p>
                <p class="text-gray-700 mb-6">Your login One-Time Password (OTP) for  verification is:</p>
                <div class="bg-gray-100 rounded-lg p-4 mb-6">
                    <p class="text-4xl font-bold text-center text-indigo-600">${otp}</p>
                </div>
                <p class="text-gray-700 mb-6">This OTP is valid for <span class="font-semibold">2 minutes</span>. Please do not share this code with anyone.</p>
                <p class="text-gray-700 mb-2">If you didn't request this code, please ignore this email.</p>
                <p class="text-gray-700">Thank you for using our service!</p>
            </div>
            <div class="bg-gray-100 py-4 px-8">
                <p class="text-sm text-gray-600 text-center">&copy; 2024 AD-Auth. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`;

    // // sending the email
    await transporter.sendEmail({
      from: process.env.SMTP_SENDER_EMAIL,
      to: user.email,
      subject: "OTP verification",
      html: emailTemplate,
    });

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

    // email template
    const emailTemplate = `<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP Code</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100">
        <div class="max-w-2xl mx-auto my-8 bg-white rounded-lg shadow-md overflow-hidden">
            <div class="bg-indigo-600 py-6 px-8">
                <h1 class="text-3xl font-bold text-white text-center">Two Factor OTP</h1>
            </div>
            <div class="p-8">
                <p class="text-gray-700 mb-6">Hello,${user.name}</p>
                <p class="text-gray-700 mb-6">Your One-Time Password (OTP) for  verification is:</p>
                <div class="bg-gray-100 rounded-lg p-4 mb-6">
                    <p class="text-4xl font-bold text-center text-indigo-600">${otp}</p>
                </div>
                <p class="text-gray-700 mb-6">This OTP is valid for <span class="font-semibold">2 minutes</span>. Please do not share this code with anyone.</p>
                <p class="text-gray-700 mb-2">If you didn't request this code, please ignore this email.</p>
                <p class="text-gray-700">Thank you for using our service!</p>
            </div>
            <div class="bg-gray-100 py-4 px-8">
                <p class="text-sm text-gray-600 text-center">&copy; 2024 AD-Auth. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`;

    // sending the email
    await transporter.sendEmail({
      from: process.env.SMTP_SENDER_EMAIL,
      to: user.email,
      subject: "OTP verification",
      html: emailTemplate,
    });

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

    // email tempalte
    const emailTemplate = `<html lang="en">
    // <head>
    //     <meta charset="UTF-8">
    //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //     <title>Your OTP Code</title>
    //     <script src="https://cdn.tailwindcss.com"></script>
    // </head>
    // <body class="bg-gray-100">
    //     <div class="max-w-2xl mx-auto my-8 bg-white rounded-lg shadow-md overflow-hidden">
    //         <div class="bg-indigo-600 py-6 px-8">
    //             <h1 class="text-3xl font-bold text-white text-center">Two Factor OTP</h1>
    //         </div>
    //         <div class="p-8">
    //             <p class="text-gray-700 mb-6">Hello,${user.name}</p>
    //             <p class="text-gray-700 mb-6">Your Reset Password One-Time Password (OTP) for  verification is:</p>
    //             <div class="bg-gray-100 rounded-lg p-4 mb-6">
    //                 <p class="text-4xl font-bold text-center text-indigo-600">${otp}</p>
    //             </div>
    //             <p class="text-gray-700 mb-6">This OTP is valid for <span class="font-semibold">2 minutes</span>. Please do not share this code with anyone.</p>
    //             <p class="text-gray-700 mb-2">If you didn't request this code, please ignore this email.</p>
    //             <p class="text-gray-700">Thank you for using our service!</p>
    //         </div>
    //         <div class="bg-gray-100 py-4 px-8">
    //             <p class="text-sm text-gray-600 text-center">&copy; 2024 AD-Auth. All rights reserved.</p>
    //         </div>
    //     </div>
    // </body>
    // </html>`;

    // sending the email
    await transporter.sendEmail({
      from: process.env.SMTP_SENDER_EMAIL,
      to: user.email,
      subject: "Reset Password OTP",
      html: emailTemplate,
    });

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
    const emailTemplate = `<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP Code</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100">
        <div class="max-w-2xl mx-auto my-8 bg-white rounded-lg shadow-md overflow-hidden">
            <div class="bg-indigo-600 py-6 px-8">
                <h1 class="text-3xl font-bold text-white text-center">Two Factor OTP</h1>
            </div>
            <div class="p-8">
                <p class="text-gray-700 mb-6">Hello,${user.name}</p>
                <p class="text-gray-700 mb-6">Your One-Time Password (OTP) for email verification is:</p>
                <div class="bg-gray-100 rounded-lg p-4 mb-6">
                    <p class="text-4xl font-bold text-center text-indigo-600">${otp}</p>
                </div>
                <p class="text-gray-700 mb-6">This OTP is valid for <span class="font-semibold">2 minutes</span>. Please do not share this code with anyone.</p>
                <p class="text-gray-700 mb-2">If you didn't request this code, please ignore this email.</p>
                <p class="text-gray-700">Thank you for using our service!</p>
            </div>
            <div class="bg-gray-100 py-4 px-8">
                <p class="text-sm text-gray-600 text-center">&copy; 2024 AD-Auth. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`;
    await transporter.sendMail({
      from: process.env.SMTP_SENDER_EMAIL,
      to: user.email,
      subject: "Reset Password OTP",
      html: emailTemplate,
    });

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
