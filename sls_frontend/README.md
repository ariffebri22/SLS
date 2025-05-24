<img src="https://ik.imagekit.io/ucgcz7azi/shieldtag_logo.png?updatedAt=1748094227284" width="3000" alt="cover" />

# 🖥️ Frontend – Shieldtag Login System

This is the frontend interface for the Shieldtag Login System. It is built with **Next.js (App Router)** and includes fully responsive pages for user authentication and account management.

---

## 🔧 Tech Stack

-   **Next.js** (App Router)
-   **Tailwind CSS** for styling
-   **Axios** for API communication
-   **NextAuth.js** for login session management
-   **React Google reCAPTCHA** for spam protection
-   **Sonner** for user-friendly toast notifications

---

## 🌐 Deployed On

-   Live URL: `https://sls.ariff.site`

---

## 📌 Available Routes

| Path                          | Description                     |
| ----------------------------- | ------------------------------- |
| `/auth/login`                 | Login page                      |
| `/auth/register`              | Registration page               |
| `/auth/forgot-password`       | Forgot password form            |
| `/auth/reset-password`        | Reset password form (via token) |
| `/auth/verify-email`          | Success page for verification   |
| `/auth/verify-email-expired`  | Expired token page              |
| `/auth/verify-recover`         | Account re-activation success   |
| `/auth/verify-recover-expired` | Reverify token expired          |
| `/`                           | Home (protected)                |

---

## 🔐 Page-wise Security Overview

### ✅ `/auth/login`

-   Validates email format and password length
-   Disables submit button during cooldown (30s)
-   reCAPTCHA protection (server side via backend)
-   Prevents login if `emailVerified` is `null`
-   Rate limiting & lockout logic integrated

### ✅ `/auth/register`

-   Input validation (name, email, password)
-   Prevents duplicate email registration
-   Sends verification email via secure backend
-   reCAPTCHA check on form submission

### ✅ `/auth/forgot-password`

-   Validates input email format
-   Sends tokenized reset link only to valid users
-   No user enumeration in error messages

### ✅ `/auth/reset-password`

-   Requires strong password & confirmation
-   Token validity check (via backend)
-   reCAPTCHA enforced before allowing reset

### ✅ `/`

-   Protected route: Only accessible if authenticated
-   Checks session via `useSession` from `next-auth`
-   Logs out also updates login session status in backend

---

## 📎 Note

This frontend integrates with a separate secure backend built with Express.js. All sensitive operations (token validation, password reset, rate-limiting) are handled server-side.

Feel free to adapt the UI or styling as needed.
