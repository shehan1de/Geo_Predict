const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');

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

module.exports = router;
