const express = require("express");
const {addBook, updateBook, deleteBook, getBook} = require('../controllers/book.controller');
const {authT, authR} = require("../middleware/userAuth");

const app = express.Router();



//get all book to both lib.. & stu...
app.get("/all" ,getBook);

//add a new book lib...
app.post("/add", authT, authR(["librarian"]), addBook);

//updating the book lib...
app.put("/:id", authT, authR(["librarian"]), updateBook);

//deleting the book
app.delete("/:id", authT, authR(["librarian"]), deleteBook);

module.exports = app