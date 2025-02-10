const express = require("express");
const { registerUser , loginUser , logoutUser, userInfo, forgotPswrd, restPswrd} = require("../controllers/user.controller");
const { authT, authR } = require("../middleware/userAuth");

const router = express.Router();

// User registration route
router.post("/register", registerUser );

// User login route
router.post("/login", loginUser );

router.post("/forget", forgotPswrd);


// router.post("/restPswrd", restPswrd)

// User logout route (requires authentication)
router.get("/logout", authT,  logoutUser );

router.post("/get-user-info-by-id", authT, userInfo)


module.exports = router;