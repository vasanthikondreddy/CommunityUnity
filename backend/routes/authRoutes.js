const express = require("express");
const { registerUser, loginUser, getProfile } = require("../controllers/authController");
const auth = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", auth, getProfile); 

module.exports = router;
