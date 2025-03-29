const express = require("express");
const User = require("../Model/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendResetEmail = require("../Service/emailService");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const path = require("path");


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

        const profilePicture = 'image/defaultProfile.jpg';

        const newUser = new User({
            name,
            email,
            password,
            role,
            profilePicture,
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: savedUser._id,
                userId: savedUser.userId,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
                createdAt: savedUser.createdAt,
                profilePicture: savedUser.profilePicture
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { registerUser };




const login = async (req, res) => {
try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("User Password from DB:", user.password);
    console.log("Entered Password:", password);

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password Match:", isMatch);

    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { userId: user.userId, name: user.name, email: user.email, role: user.role, profilePicture:user.profilePicture},
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return res.status(200).json({
        message: "Login successful",
        token,
        user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture:user.profilePicture
        },
    });

    } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { login };

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

        const hashedToken = await bcrypt.hash(resetToken, 3);
        user.resetToken = hashedToken;
        user.resetTokenExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();
        await sendResetEmail(email, resetToken);
        res.json({ message: "Verification code sent to email" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const verifyResetCode = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        
        const { email, code } = req.body;
        
        if (!email || !code) {
            return res.status(400).json({ message: "Email and verification code are required" });
        }
        const user = await User.findOne({ email });
        if (!user || !user.resetToken) {
            return res.status(400).json({ message: "Invalid or expired code" });
        }

        const isMatch = await bcrypt.compare(code, user.resetToken);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid verification code" });
        }
        res.json({ message: "Code verified successfully" });

    } catch (error) {
        console.error("Verification Error:", error);
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



module.exports = { registerUser, login, logoutUser, requestPasswordReset, verifyResetCode, resetPassword };
