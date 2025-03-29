const User = require('../Model/User');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const defaultProfilePath = "image/defaultProfile.jpg";

const getProfilePictureUrl = (profilePicture) => {
    return `${process.env.BASE_URL}/${profilePicture}`;
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../image"));
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

const addUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const profilePicturePath = req.file ? `/image/${req.file.filename}` : defaultProfilePath;

        const newUser = new User({
            name,
            email,
            password,
            role,
            profilePicture: profilePicturePath
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

            if (oldProfilePath && oldProfilePath !== defaultProfilePath && fs.existsSync(path.join(__dirname, oldProfilePath))) {
                fs.unlinkSync(path.join(__dirname, oldProfilePath));
            }

            user.profilePicture = `/image/${req.file.filename}`;
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

        if (user.profilePicture !== defaultProfilePath && fs.existsSync(path.join(__dirname, user.profilePicture))) {
            fs.unlinkSync(path.join(__dirname, user.profilePicture));
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

const updateProfile = async (req, res) => {
    try {
        const { name, email, password, currentPassword, newPassword, confirmPassword } = req.body;
        const userId = req.params.userId;

        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Request body:', req.body);

        if (currentPassword && newPassword && confirmPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            console.log('Password match:', isMatch);

            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }

            if (newPassword !== confirmPassword) {
                return res.status(400).json({ message: 'New password and confirm password do not match' });
            }

            user.password = hashedPassword;
        }

        if (name) {
            user.name = name;
        }

        if (email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: "Email already in use" });
            }
            user.email = email;
        }

        if (req.file) {
            const oldProfilePath = user.profilePicture;
            if (oldProfilePath && oldProfilePath !== defaultProfilePath && fs.existsSync(path.join(__dirname, oldProfilePath))) {
                fs.unlinkSync(path.join(__dirname, oldProfilePath));
            }

            user.profilePicture = `/image/${req.file.filename}`;
        }

        user.updatedAt = new Date();
        console.log('User before saving:', user);
        await user.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                name: user.name,
                email: user.email,
                profilePicture: getProfilePictureUrl(user.profilePicture)
            }
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
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
    updateProfile,
    upload
};
