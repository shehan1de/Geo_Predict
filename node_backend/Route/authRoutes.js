const express = require("express");
const { registerUser, loginUser, logoutUser } = require("../Controller/authController");
const { validateRegistration, validateLogin } = require("../Middleware/validationMiddleware");

const router = express.Router();

router.post("/register", validateRegistration, registerUser);
router.post("/login", validateLogin, loginUser);
router.post("/logout", logoutUser);

module.exports = router;
