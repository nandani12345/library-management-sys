const express = require("express");
const {borrowBook, borrowReturn, getBorrowedBooks} = require("../controllers/borrow.controller");
const {authT, authR} = require("../middleware/userAuth");

const app = express.Router(); //middleware

app.post("/borrowBook", authT, authR(["student"]), borrowBook); //borrow a book

app.post("/returnBook", authT, authR(["student"]), borrowReturn); //return a book

app.get("/borrowed-books", authT, authR(["student"]), getBorrowedBooks); //return a book

module.exports = app;

