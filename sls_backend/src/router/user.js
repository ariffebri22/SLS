const express = require("express");
const router = express.Router();
const { registerUser, getUser } = require("../controller/userController");
const { verifyEmail, verifyRecover, loginUser } = require("../controller/authController");
const { sendResetEmail } = require("../controller/forgotPasswordController");
const { reset } = require("../controller/resetPasswordController");
const { storeLoginSession, updateLogoutSession, getUserLoginSessions } = require("../controller/sessionController");

router.post("/", registerUser);
router.get("/", getUser);
router.get("/verify-email", verifyEmail);
router.get("/verify-recover", verifyRecover);
router.post("/forgot-password", sendResetEmail);
router.post("/login", loginUser);
router.post("/reset-password", reset);
router.post("/login-session", storeLoginSession);
router.put("/logout-session", updateLogoutSession);
router.get("/login-session", getUserLoginSessions);

module.exports = router;
