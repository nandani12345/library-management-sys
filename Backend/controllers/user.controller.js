const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklists = require("../blacklist");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

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
        message: "Logged in successfully",
        token: token,
        role: user.role, // Optionally return the user's role
        success: true
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

exports.forgotPswrd = async (req, res) => {

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send({ msg: "User not found" });
    }
   
    const token = crypto.randomBytes(20).toString("hex");
    const createdAt = Date.now();

    // Construct the reset link
    const resetLink = `http://localhost:3000/change-password?token=${token}&createdAt=${createdAt}`;
    user.token = token;

    // Send the reset link via email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
    });

    const mailOptions = {
      from: "lovenandu12345@gmail.com",
      to: user.email,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      http://localhost:3000/reset/${resetLink}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);

    await user.save();

    res.status(200).send({
      message: "Password reset link sent to your email",
      success: true,
    });
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .send({ msg: "Something went wrong while sending email", error });
  }
};
// exports.restPswrd = async (req, res) => {
//   const { token, password } = req.body;

//   if (!token || !password) {
//     return res.status(400).send({ msg: "Token and password are required" });
//   }

//   try {
//     const user = await User.findOne({
//       resetToken: token,
//       resetTokenExpiration: { $gt: Date.now() },
//     });
//     if (!user) {
//       return res.status(400).send({ msg: "Invalid token" });
//     }

//     //Hash Pasword
//     bcrypt.hash(password, 7, async (err, hash) => {
//       if (err) {
//         return res
//           .status(500)
//           .send({ msg: "Error hashing password", error: err });
//       }

//       //UPDATE-USER-PASSWORD

//       user.password = hash;
//       user.resetToken = undefined;
//       user.resetTokenExpiration = undefined;
//       await user.save();

//       return res.status(200).send({ msg: "Password reset successfully" });
//     });
//   } catch (error) {
//     return res.status(500).send({ msg: "Internal Server Error", error: error });
//   }
// };

exports.userInfo = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(404)
        .send({ message: "Unauthorized access", success: false });
    }
    return res.status(200).send({ success: true, data: user });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal server error", success: false, error });
  }
};
