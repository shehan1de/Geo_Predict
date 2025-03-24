const User = require('../Model/User');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const defaultProfilePath = "images/defaultProfile.jpg";

const getProfilePictureUrl = (profilePicture) => {
    return `${process.env.BASE_URL}/${profilePicture}`;
};

const addUser = async (req, res) => {
    try {
        const { name, email, password, role, profilePicture } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const defaultProfilePath = "/uploads/defaultProfile.jpg";

        const newUser = new User({
            name,
            email,
            password,
            role,
            profilePicture: profilePicture || defaultProfilePath
        });

        await newUser.save();

        res.status(201).json({
            ...newUser._doc,
            profilePicture: getProfilePictureUrl(newUser.profilePicture)
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users.map(user => ({
            ...user._doc,
            profilePicture: getProfilePictureUrl(user.profilePicture)
        })));
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get a single user by userId
const getUserByUserId = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            ...user._doc,
            profilePicture: getProfilePictureUrl(user.profilePicture)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const updateUser = async (req, res) => {
  try {
      const { name, email, password, role } = req.body;
      const user = await User.findOne({ userId: req.params.userId });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      user.name = name || user.name;
      user.email = email || user.email;
      user.role = role || user.role;
      user.updatedAt = new Date();

      if (password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);
      }

      if (req.file) {
          const oldProfilePath = user.profilePicture;

          if (oldProfilePath && oldProfilePath !== defaultProfilePath && fs.existsSync(oldProfilePath)) {
              fs.unlinkSync(oldProfilePath);
          }

          user.profilePicture = req.file.path;
      }

      await user.save();

      res.status(200).json({
          ...user._doc,
          profilePicture: getProfilePictureUrl(user.profilePicture)
      });
  } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
  }
};



const deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ userId: req.params.userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.profilePicture !== defaultProfilePath && fs.existsSync(user.profilePicture)) {
            fs.unlinkSync(user.profilePicture);
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const editUserRole = async (req, res) => {
    const { role } = req.body;

    if (!role) {
        return res.status(400).json({ message: 'Role is required' });
    }

    try {
        const user = await User.findOneAndUpdate(
            { userId: req.params.userId },
            { role, updatedAt: Date.now() },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    addUser,
    getAllUsers,
    getUserByUserId,
    updateUser,
    deleteUser,
    editUserRole,
};
