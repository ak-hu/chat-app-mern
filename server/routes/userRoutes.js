const { login, 
    register, 
    getAllUsers, 
    renameUser, 
    emailUpdate, 
    profilePicUpdate, 
    passwordUpdate,
    deleteProfile,
 } = require("../controller/userController");
const router = require("express").Router();
const multer = require("multer");
const path = require("path"); 
const { protect } = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
    destination: function (req, file, cb) { 
        cb(null, path.join(__dirname, "../images/profile_pictures")) 
    },
    filename: function (req, file, cb) { 
        cb(null, Date.now() + "_" + file.originalname) 
    }
})
const upload = multer({ storage: storage });

router.post("/register", upload.single("profilePic"), register);
router.post("/login", login);

router.route("/allUsers").get(protect, getAllUsers);
router.route("/deleteUser").put(protect, deleteProfile);
router.route("/renameUser").put(protect, renameUser);
router.route("/emailUpdate").put(protect, emailUpdate);
router.route("/profilePicUpdate").put(protect, upload.single("profilePic"), profilePicUpdate);
router.route("/passwordUpdate").put(protect, passwordUpdate);

module.exports = router;