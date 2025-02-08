const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklists = require("../blacklist");

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Input validation
  if (!name || !email || !password || !role) {
    return res.status(400).send({ msg: "All fields are required" });
  }

  // Role validation
  const validRoles = ["student", "librarian"];
  if (!validRoles.includes(role)) {
    return res.status(400).send({ msg: "Invalid role" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .send({ msg: "User  with this email already exists" });
    }

    // Hash password
    bcrypt.hash(password, 7, async (err, hash) => {
      if (err) {
        return res
          .status(500)
          .send({ msg: "Error hashing password", error: err });
      }

      // Create and save new user
      const user = new User({ name, email, password: hash, role });
      await user.save();
      return res.status(201).send({ msg: "User  registered successfully" });
    });
  } catch (error) {
    return res.status(500).send({ msg: "Internal Server Error", error: error });
  }
};

//User Login

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).send({ msg: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).send({ msg: "Invalid email or password" });
    }

    // Compare passwords
    bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result) {
        return res.status(401).send({ msg: "Invalid email or password" });
      }

      // Generate token
      const token = jwt.sign({ id: user._id, role: user.role }, "codingrank", {
        expiresIn: "2h",
      });

      return res.status(200).send({
        msg: "Logged in successfully",
        token: token,
        role: user.role, // Optionally return the user's role
      });
    });
  } catch (error) {
    return res.status(500).send({ msg: "Internal Server Error", error: error });
  }
};

exports.logoutUser = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    if (!token) {
      return res.status(400).send({ msg: "No token provided" });
    }
    if (blacklists.includes(token)) {
      return res.status(200).send({ msg: "You're already logged out." });
    }
    blacklists.push(token);
    // console.log("Logged out successfully");
    return res.status(200).send({ msg: "Logged out successfully" });
  } catch (error) {
    return res
      .status(500)
      .send({ msg: "Something went wrong while logging out", error: error });
  }
};

exports.userInfo = async (req, res) => {
  try {

    const user = await User.findOne({email: req.body.email})

    if( !user ){
      return res.status(404).send({ message: "Unauthorized access", success: false })
    }
    return res.status(200).send({ success: true, data: user })
    
  } catch (error) {
    return res.status(500).send({ message: "Internal server error", success: false, error })
  }
}