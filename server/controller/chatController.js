const User = require("../model/userModel");
const Chat = require("../model/chatModel");
const Messages = require("../model/messageModel");
const mongoose = require('mongoose');

const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

module.exports.accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }
  var isChat = await Chat.find(
    {
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    }
  )
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "username profilePic",
  });

  const user2_id = await User.findOne({ _id: mongoose.Types.ObjectId(`${userId}`) });
  const username = user2_id.username;

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: `${username}`,
      isGroupChat: false,
      groupPic: '',
      users: [
        req.user._id,
        userId
      ],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage");
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw Error(error.message);
    }
  }
};

module.exports.fetchChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "username profilePic",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports.createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }
  const groupPicUrl = 'default-group.svg';
  var users = JSON.parse(req.body.users);
  
  if (users.length < 1) {
    return res
      .status(400)
      .send("More than 1 user are required to form a group chat");
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupPic: groupPicUrl,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports.renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    { new: true, }
  )
  .populate("users", "-password")
  .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
};

module.exports.groupPicUpdate = async (req, res) => {
  const { chatId } = req.body;
  const profilePicUrl = (req.file) ? req.file.filename : 'default.svg';

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      groupPic: profilePicUrl,
    },
    { new: true, }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
};

module.exports.removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true, }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
};

module.exports.addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: {
        users: userId
      },
    },
    { new: true, }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
};

module.exports.deleteChat = async (req, res) => {
  const { chatId } = req.body;
  const chat = await Chat.find({ _id: chatId });
  const groupPicUrl = chat.groupPic;

  if (groupPicUrl && groupPicUrl !== 'default-group.svg') {
    await unlinkAsync(path.join(__dirname, '../profile_pictures/', groupPicUrl));
  }
  const removed = await Chat.deleteOne({ _id: chatId });
  const removedMessages = await Messages.deleteMany({ chat: chatId });
  if (!removed || !removedMessages) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
};