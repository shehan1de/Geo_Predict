const express = require("express");
const { registerUser, login, logoutUser, requestPasswordReset, verifyResetCode, resetPassword } = require("../Controller/authController");
const { validateRegistration, validateLogin } = require("../Middleware/validationMiddleware");

const router = express.Router();

console.log("Loading Authentication Routes...");

router.use((req, res, next) => {
    console.log(`Route Accessed: ${req.method} ${req.originalUrl}`);
    next();
});

router.get("/", (req, res) => {
    res.json({ message: "Auth Routes Working!" });
});

router.post("/register", validateRegistration, registerUser);
router.post("/login", validateLogin, login);
router.post("/logout", logoutUser);
router.post("/request-reset", requestPasswordReset);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);

module.exports = router;
