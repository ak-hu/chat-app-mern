const Messages = require("../model/messageModel");
const User = require("../model/userModel");
const Chat = require("../model/chatModel");

module.exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Messages.find({ chat: req.params.chatId })
      .populate("sender", "username profilePic email")
      .populate("chat");
    res.json(messages);
    console.log(messages)
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports.addMessage = async (req, res, next) => {
  // try {
  //   const { from, to, message } = req.body;
  //   const data = await Messages.create({
  //     message: { text: message },
  //     users: [from, to],
  //     sender: from,
  //   });

  //   if (data) return res.json({ msg: "Message added successfully." });
  //   else return res.json({ msg: "Failed to add message to the database" });
  // } catch (ex) {
  //   next(ex);
  // }
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

    message = await message.populate("sender", "username profilePic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "username profilePic",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
    console.log(message)
  } catch (error) {
    res.status(400);
    next(error);
  }
};