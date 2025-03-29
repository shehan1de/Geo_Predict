const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const userController = require('../Controller/userController');

// Storage configuration for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../image')); // Path where image will be saved
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + path.extname(file.originalname); // Unique filename
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

// Add new user
router.post('/user', userController.addUser);

// Get all users
router.get('/users', userController.getAllUsers);

// Get user by userId
router.get('/user/:userId', userController.getUserByUserId);

// Update user
router.put('/user/:userId', userController.updateUser);

// Delete user
router.delete('/user/:userId', userController.deleteUser);

// Edit user role
router.put('/user/:userId/role', userController.editUserRole);

// Update profile, including image upload
router.put('/user/:userId/profile', upload.single('image'), userController.updateProfile);

module.exports = router;
