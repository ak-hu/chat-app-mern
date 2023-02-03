const { login, register, getAllUsers } = require("../controller/userController");
const router = require("express").Router();
const multer = require('multer');
const path = require('path'); 
const { protect } = require("../middleware/authMiddleware");

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

router.post("/register", upload.single('profilePic'), register);
router.post("/login", login);
router.route("/allUsers").get(protect, getAllUsers);

module.exports = router;