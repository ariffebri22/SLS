<img src="https://ik.imagekit.io/ucgcz7azi/shieldtag_cover.jpg?updatedAt=1748094227313" width="1200" alt="Cover"/>

# 🔐 Shieldtag Login System

This is a complete authentication system project developed for a technical test at [Shieldtag.co](https://shieldtag.co).  
It includes modern, secure, and scalable features to simulate real-world authentication scenarios, built with both frontend and backend separation.

---

## 🧑‍💻 About the Project

This system is designed to reflect industry-standard practices for authentication, authorization, session handling, and account security — all built with the purpose of demonstrating real-world implementation readiness.

> If you encounter any issues with this submission, feel free to reach me at: **iam@arif.site**

---

## 🚀 Features

-   ✅ **User Registration**

    -   Secure input validation & sanitization
    -   Auto-generate email verification token

-   ✅ **Email Verification**

    -   Link-based one-time verification
    -   Expired/invalid token handling
    -   Re-verification flow with new link

-   ✅ **Login System**

    -   Credential-based authentication
    -   Limited login attempts (lockout after 3 failed tries for 30 seconds)
    -   Full account freeze after 9 failed tries
    -   CAPTCHA-ready protection

-   ✅ **Session Tracking**

    -   Store IP address, device info, login & logout time
    -   Calculate active session duration

-   ✅ **Forgot Password**

    -   Email-based reset link (valid 1 hour)
    -   Secure password reset form
    -   reCAPTCHA integration

-   ✅ **Reset Password**

    -   Token-based validation
    -   Password confirmation & strength enforcement

-   ✅ **Protected Pages**
    -   Server/client route guard via middleware and session check

---

## 📁 Project Structure

-   Frontend → Next.js App Router (Auth UI)
-   Backend → Express.js API with MVC Model (Auth logic)
-   README.md → General documentation (this file)

---

## 🌐 Deployment

-   Frontend deployed on:  
    **https://sls.ariff.site**

-   Backend:  
    **https://sls-backend-two.vercel.app/**

---

## 🙋‍♂️ Contact

Regards,  
**Arif Febriansyah**  
Fullstack Developer  
_Based in Jakarta Central, Indonesia_

---

## 📩 Feedback

Thank you for reviewing this project.  
I’m open to any feedback or suggestions for improvement.

---
