const User = require('../model/userModel');
const Chat = require("../model/chatModel");
const Messages = require("../model/messageModel");
const bcrypt = require('bcrypt');
const config = require('config');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const { generateToken } = require('../config/generateToken');

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

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const keyword = req.query.search
            ? { username: { $regex: req.query.search, $options: "i" } }
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
            username: newUsername
        },
        { new: true, }
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
    if (emailCheck) return res.json({ msg: "The email is already used", status: false });
    const updatedUser = await User.findByIdAndUpdate(userId, { email: newEmail, }, { new: true, });
    if (!updatedUser) {
        res.status(404);
        throw new Error("User Not Found");
    } else {
        res.json({
            status: true, updatedUser: {
                _id: updatedUser._id, username: updatedUser.username,
                email: updatedUser.email, profilePic: updatedUser.profilePic,
                isAdmin: updatedUser.isAdmin, token: generateToken(updatedUser._id),
            }
        });
    }
};

module.exports.profilePicUpdate = async (req, res) => {
    const { userId } = req.body;
    const profilePicUrl = (req.file) ? req.file.filename : 'default.svg';
    const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: profilePicUrl, }, { new: true, });
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
    const user = await User.findOne({ _id: userId });
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
        return res.json({ msg: "Incorrect password", status: false });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            password: hashedPassword,
        },
        { new: true, }
    );

    if (!updatedUser) {
        res.status(404);
        throw new Error("User Not Found");
    } else {
        delete updatedUser.password;
        res.json({ status: true })
    }
};

module.exports.deleteProfile = async (req, res) => {
    const { userId } = req.body;
    const user = await User.findById(userId);
    const allChats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } });
    const groupAdminChats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } }, groupAdmin: userId });
    const profilePicUrl = user.profilePic;

    if (groupAdminChats.length !== 0 && groupAdminChats !== undefined) {
        let groupPicArr = [];
        groupAdminChats.map((chat) => { groupPicArr.push(chat.groupPic) });
        const filtered = groupPicArr.filter(pic => pic !== 'default-group.svg');
        filtered.map(async (pic) => { await unlinkAsync(path.join(__dirname, '../profile_pictures/', pic)); })
    }

    if (profilePicUrl && profilePicUrl !== 'default.svg') {
        await unlinkAsync(path.join(__dirname, '../profile_pictures/', profilePicUrl));
    }

    const removedMessages = await Messages.deleteMany({ chat: allChats });
    await Chat.deleteMany({ users: { $elemMatch: { $eq: req.user._id } }, groupAdmin: userId });
    await Chat.updateMany(
        { users: { $elemMatch: { $eq: req.user._id } }, isGroupChat: true },
        { $pull: { users: userId } },
        { new: true }
    );

    const removedNotGroupChats = await Chat.deleteMany({ users: { $elemMatch: { $eq: req.user._id } }, isGroupChat: false });
    const removed = await User.deleteOne({ _id: userId });
    if (!removed || !removedNotGroupChats || !removedMessages) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json({ status: true });
    }
};