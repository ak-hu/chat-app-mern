const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup
} = require("../controller/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);

router.route('/accessChat').post(protect, accessChat);
router.route('/fetchChats').get(protect, fetchChats);

module.exports = router;