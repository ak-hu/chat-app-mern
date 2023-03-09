const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const config = require('config');

const fs = require('fs');
const { json } = require('docker/src/languages');
const generateToken = require('../config/generateToken');

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username });
        const emailCheck = await User.findOne({ email });
        const profilePicUrl = (req.file) ? req.file.filename : 'default.svg';

        if (usernameCheck) {
            return res.json({ msg: "The username is already used", status: false });
        }
        if (emailCheck) {
            return res.json({ msg: "The email is already used", status: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            profilePic: profilePicUrl,
        });

        delete user.password;
        return res.json({
            status: true, user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePic: user.profilePic,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            }
        });
    } catch (e) {
        next(e);
    };
};

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.json({ msg: "Incorrect username or password", status: false });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({ msg: "Incorrect username or password", status: false });
        }

        if (user && isPasswordValid) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePic: user.profilePic,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
                status: true,
            });
        } else {
            res.status(401);
        }
    } catch (e) {
        next(e);
    }
};
//@route GET /api/auth?search=
module.exports.getAllUsers = async (req, res, next) => {
    try {
        const keyword = req.query.search
            ? {
                username: { $regex: req.query.search, $options: "i" }
            }
            : {};
        const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
        res.send(users);
    } catch (e) {
        next(e);
    }
};

module.exports.renameUser = async (req, res) => {
    const { userId, newUsername } = req.body;
    const usernameCheck = await User.findOne({ username: newUsername });

    if (usernameCheck) {
        return res.json({ msg: "The username is already used", status: false });
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            username: newUsername,
        },
        {
            new: true,
        }
    );
    if (!updatedUser) {
        res.status(404);
        throw new Error("User Not Found");
    } else {
        res.json({
            status: true, updatedUser: {
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                profilePic: updatedUser.profilePic,
                isAdmin: updatedUser.isAdmin,
                token: generateToken(updatedUser._id),
            }
        });
    }
};


module.exports.emailUpdate = async (req, res) => {
    const { userId, newEmail } = req.body;
    const emailCheck = await User.findOne({ email: newEmail });

    if (emailCheck) {
        return res.json({ msg: "The email is already used", status: false });
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            email: newEmail,
        },
        {
            new: true,
        }
    );
    if (!updatedUser) {
        res.status(404);
        throw new Error("User Not Found");
    } else {
        res.json({
            status: true, updatedUser: {
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                profilePic: updatedUser.profilePic,
                isAdmin: updatedUser.isAdmin,
                token: generateToken(updatedUser._id),
            }
        });
    }
};

// @desc    Update Profile Pic
// @route   PUT /api/auth/rename
// @access  Protected
module.exports.profilePicUpdate = async (req, res) => {
    const { userId } = req.body;
    const profilePicUrl = (req.file) ? req.file.filename : 'default.svg';

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            profilePic: profilePicUrl,
        },
        {
            new: true,
        }
    );
    if (!updatedUser) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json({
            status: true, updatedUser: {
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                profilePic: updatedUser.profilePic,
                isAdmin: updatedUser.isAdmin,
                token: generateToken(updatedUser._id),
            }
        });
    }
};

module.exports.passwordUpdate = async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;
    console.log('--------------------------------------------------------------------------------------');

    const user = await User.findOne({ _id: userId });
    console.log(user);

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
        console.log("Incorrect password");
        return res.json({ msg: "Incorrect password", status: false });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(hashedPassword);
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            password: hashedPassword,
        },
        {
            new: true,
        }
    );
    if (!updatedUser) {
        res.status(404);
        throw new Error("User Not Found");
    } else {
        delete updatedUser.password;
        res.json({status: true})
        console.log('password changed')
    }
};
