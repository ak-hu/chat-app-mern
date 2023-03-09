const Messages = require("../model/messageModel");
const User = require("../model/userModel");
const Chat = require("../model/chatModel");

module.exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Messages.find({ chat: req.params.chatId })
      .populate("sender", "username profilePic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports.addMessage = async (req, res, next) => {
  const { sender, content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: sender,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Messages.create(newMessage);

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message }, {
      new: true,
    });
    message = await message.populate("sender", "username profilePic");
    message = await User.populate(message, {
      path: "chat.users",
      select: "username profilePic",
    });

    message = await message.populate({ path: 'chat', populate: { path: 'latestMessage' } });

    res.json(message);
  } catch (error) {
    res.status(400);
    next(error);
  }
};