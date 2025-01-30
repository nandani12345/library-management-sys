const express = require("express");
const mongoose = require("mongoose")
const connection = require("./connection/config");
const userRouter = require("./routes/user.route");
const bookRouter = require("./routes/book.route");
const borrowRouter = require("./routes/borrow.route");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.listen(9000, async () => {
  try {
    await connection;
    console.log("Connect to database");
    console.log("Server has started at http://localhost:9000/");
  } catch (error) {
    console.log("Error is", error);
  }
});

app.use("/", userRouter);
app.use("/",  bookRouter);
app.use("/", borrowRouter);
