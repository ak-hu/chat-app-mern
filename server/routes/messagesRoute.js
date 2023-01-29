const { addMessage, getMessages } = require("../controller/messagesController");
const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");

router.post("/addmsg/", addMessage);
router.route("/getmsg/:chatId",).get(protect, getMessages);

module.exports = router;