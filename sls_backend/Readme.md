<img src="https://ik.imagekit.io/ucgcz7azi/shieldtag_logo.png?updatedAt=1748094227284" widht="2000" alt="Cover"/>

# 🛠️ Backend – Shieldtag Login System

This is the backend API service for the Shieldtag Login System, responsible for all authentication logic, secure session management, and sensitive operations such as password reset and email verification.

---

## 🔧 Tech Stack

-   **Express.js** for routing and API logic
-   **MySQL** as relational database
-   **Nodemailer** for email delivery (SMTP)
-   **bcryptjs** for password hashing
-   **jwt** for tokenirize
-   **xss** for input sanitization
-   **uuid** for unique token generation
-   **moment.js** for time calculations

---

## 🌐 Deployed On

-   **https://sls-backend-two.vercel.app/**

---

## 📌 API Endpoints Overview

| Method | Endpoint                       | Description                         |
| ------ | ------------------------------ | ----------------------------------- |
| POST   | `/api/v1/user`                 | Register new user                   |
| GET    | `/api/v1/user/verify-email`    | Verify email via token              |
| GET    | `/api/v1/user/verify-recover`  | Reverify account (after login lock) |
| POST   | `/api/v1/user/login`           | Login with rate limiting            |
| POST   | `/api/v1/user/login-session`   | Store login session info            |
| PUT    | `/api/v1/user/logout-session`  | Update logout time & duration       |
| POST   | `/api/v1/user/forgot-password` | Request password reset email        |
| POST   | `/api/v1/user/reset-password`  | Reset password (with CAPTCHA)       |
| GET    | `/api/v1/user?email=...`       | Fetch user by email                 |

---

## 🔐 Security Overview by Feature

### ✅ Registration

-   Input sanitization using `xss`
-   Duplicate email check
-   Secure password hashing with `bcryptjs`
-   Email verification link generation with `uuid`

### ✅ Login

-   Limited to 3 failed attempts per 30s window
-   Freeze account after 9 total failed attempts
-   Reverification email sent automatically if frozen
-   Password comparison using `bcrypt`
-   Reset loginAttempts to 0 on success

### ✅ Email Verification

-   Token stored in separate `EmailVerification` table
-   Updates `emailVerified` with `NOW()` only if token valid
-   Deletes used token after verification

### ✅ Session Tracking

-   Records `user_id`, `email`, `device_info`, `ip_address`
-   Calculates and stores `login_duration` at logout
-   Logout API required for clean tracking

### ✅ Forgot & Reset Password

-   Generates time-limited token (1 hour expiry)
-   Stores token securely in `reset_tokens` table
-   Verifies token validity + expiration
-   Hashes new password with `bcrypt`
-   Deletes used token after success
-   reCAPTCHA validated via Google API (`/api/siteverify`)

---

## ⚙️ Database Schema Notes

-   Tables: `User`, `EmailVerification`, `ReverifyToken`, `Reset_Tokens`, `Login_Sessions`
-   Tokens are time-limited and one-time use

---

## 📎 Notes

-   This backend is designed to be fully stateless and secure.
-   Sensitive logic (rate limiting, token handling, reactivation) is handled here, not on the frontend.

Feel free to integrate with any frontend that supports RESTful JSON API.

---

For backend issues or contribution questions, please reach out via contact info listed in the root project README.
