const express = require("express");
const {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    removeFromGroup,
    addToGroup,
    groupPicUpdate,
    deleteChat,
} = require("../controller/chatController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) { 
        cb(null, path.join(__dirname, "../images/profile_pictures")) 
    },
    filename: function (req, file, cb) { 
        cb(null, Date.now() + "_" + file.originalname) 
    }
})
const upload = multer({ storage: storage });
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);
router.route("/grouppic").put(protect, upload.single("groupPic"), groupPicUpdate);
router.route("/accessChat").post(protect, accessChat);
router.route("/fetchChats").get(protect, fetchChats);
router.route("/deleteChat").put(protect, deleteChat);
module.exports = router;