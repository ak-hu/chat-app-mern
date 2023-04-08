const { addMessage, getMessages } = require("../controller/messagesController");
const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path"); 

const storage = multer.diskStorage({
    destination: function (req, file, cb) { 
        cb(null, path.join(__dirname, "../images/attachments"))
    },
    filename: function (req, file, cb) { 
        cb(null, Date.now() + "_" + file.originalname)
    }
});
const upload = multer({ storage: storage });
router.route("/addmsg/",).put(protect, upload.single("attachment"), addMessage);
router.route("/getmsg/:chatId",).get(protect, getMessages);
module.exports = router;