const { addMessage, getMessages } = require("../controller/messagesController");
const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");

router.route("/addmsg/",).post(protect, addMessage);
router.route("/getmsg/:chatId",).get(protect, getMessages);

module.exports = router;