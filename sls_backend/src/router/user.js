const express = require("express");
const router = express.Router();
const { registerUser } = require("../controller/userController");
const { verifyEmail, verifyRecover } = require("../controller/authController");
const { sendResetEmail } = require("../controller/forgotPasswordController");
const { reset } = require("../controller/resetPasswordController");
const {
    storeLoginSession,
    updateLogoutSession,
} = require("../controller/sessionController");

router.post("/", registerUser);
router.get("/verify-email", verifyEmail);
router.get("/verify-recover", verifyRecover);
router.post("/forgot-password", sendResetEmail);
router.post("/reset-password", reset);
router.post("/login-session", storeLoginSession);
router.put("/logout-session", updateLogoutSession);

module.exports = router;
