# 🔐 Advanced Authentication System - MERN Stack

This project is an **Advanced Authentication System** built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). It includes modern authentication features such as:

- ✅ Email verification
- 🔐 Two-Factor Authentication (2FA) via OTP (Email-based)
- 🔄 Password reset / recovery via email
- 🛡️ Role-based access control (User, Admin, etc.)
- 🍪 Secure sessions using JWT and cookies

---

## 🚀 Features

### ✅ Signup with Email Verification
- New users must verify their email address before logging in.
- A secure token is sent via email with an expiration time.

### 🔐 Two-Factor Authentication (2FA)
- After successful login, a 6-digit OTP is sent to the user's email.
- Login is completed only after OTP verification.

### 🔄 Password Reset / Recovery
- Users can request a password reset link via email.
- Secure reset token with expiration is sent to the registered email.

### 🛡️ Role-Based Access
- Middleware to restrict routes based on user roles (e.g., `admin`, `user`)
- Dynamic rendering of UI elements based on role

---
# Project Images

Register Page
![alt text](<project-images/register page.png>)

Login Page
![alt text](<project-images/login page.png>)

Restting Password
![alt text](<project-images/resetting the password.png>)

Recovering the Password
![alt text](<project-images/resetting the password page.png>)

Two factor Authenication
![alt text](<project-images/two factor verification.png>)

Email Verification
![alt text](<project-images/verifying the email.png>)

Role-Based Action

- Admin role UI
![alt text](<project-images/Admin UI.png>)

- Author role UI
![alt text](<project-images/Author UI.png>)

- User role UI
![alt text](<project-images/User UI.png>)