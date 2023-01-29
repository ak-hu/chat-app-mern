const { login, getAllUsers } = require("../controller/userController");
const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");

router.post("/login", login);
router.route("/allUsers").get(protect, getAllUsers);

module.exports = router;