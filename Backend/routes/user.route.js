const express = require("express");
const { registerUser , loginUser , logoutUser  } = require("../controllers/user.controller");
const { authT, authR } = require("../middleware/userAuth");

const router = express.Router();

// User registration route
router.post("/register", registerUser );

// User login route
router.post("/login", loginUser );

// User logout route (requires authentication)
router.get("/logout", authT,  logoutUser );


module.exports = router;