const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
  groupPicUpdate
} = require("../controller/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
const multer = require('multer');
const path = require('path'); 


//saving profile pictures using multer
const storage = multer.diskStorage({
    //setting destination to save pics
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../profile_pictures'))
    },
    //creating name for pics
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname)
    }
})

const upload = multer({ storage: storage });

router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);
router.route("/grouppic").put(protect, upload.single('groupPic'), groupPicUpdate);

router.route('/accessChat').post(protect, accessChat);
router.route('/fetchChats').get(protect, fetchChats);

module.exports = router;