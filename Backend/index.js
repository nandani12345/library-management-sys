const express = require("express");
const mongoose = require("mongoose")
require("dotenv").config()
require("./connection/config");
const userRouter = require("./routes/user.route");
const bookRouter = require("./routes/book.route");
const borrowRouter = require("./routes/borrow.route");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

let port = process.env.PORT || 5000;

app.listen(port, async () => {
  console.log(`Server is running on port number ${port}`)
});

app.use("/", userRouter);
app.use("/",  bookRouter);
app.use("/", borrowRouter);
