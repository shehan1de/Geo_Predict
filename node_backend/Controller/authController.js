const express = require("express");
const User = require("../Model/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendResetEmail = require("../Service/emailService");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({ name, email, password, role });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Debugging logs
        console.log("🔎 User Password from DB:", user.password);
        console.log("🔎 Entered Password:", password);

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("🔍 Password Match:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET, // Ensure you have a secret key in your .env file
            { expiresIn: "1h" } // Token expiration time
        );

        // Send user details along with the token
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { login };
const logoutUser = (req, res) => {
    res.status(200).json({ message: "User logged out successfully. Clear token on frontend." });
};

const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const resetToken = crypto.randomInt(100000, 999999).toString();

        const hashedToken = await bcrypt.hash(resetToken, 10);
        user.resetToken = hashedToken;
        user.resetTokenExpiry = Date.now() + 10 * 60 * 1000;

        await user.save();

        await sendResetEmail(email, resetToken);

        res.json({ message: "Verification code sent to email" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { registerUser, login, logoutUser, requestPasswordReset, resetPassword };
