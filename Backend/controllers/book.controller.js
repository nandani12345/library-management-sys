const Book = require("../models/book.model");

//add new book

exports.addBook = async (req, res) => {
  const { title, author, ISBN, availableCopies } = req.body;
  const existingBook = await Book.findOne({ ISBN });
  try {
    const book = new Book({ title, author, ISBN, availableCopies });
    await book.save();
    return res.status(201).send({ msg: "Book added successFully...", book });
  } catch (error) {
    return res
      .status(401)
      .send({ msg: "Error adding book", error: error.message });
  }
};

//Updating the book
exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const book = await Book.findByIdAndUpdate(id, updateData, { new: true });
    if (!book) {
      return res.status(404).send({ msg: "Book not found" });
    }
    res.status(201).send({ msg: "Book update successfully..." });
  } catch (error) {
    console.error("Error update book:", error);
    res.status(500).send({ msg: "Error updating book...", err: err.message });
  }
};

//Deleting the book

exports.deleteBook = async (req, res) => {
  const bookId = req.params.id;
  try {
    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return res.status(404).send({ message: "Book not found" });
    }

    res.status(200).send({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).send({ message: "Error deleting the book...", err: err.message });
  }
};

//Get all Book (students and librarian)

exports.getBook = async (req, res) => {
  try {
    const book = await Book.find();
    return res.status(200).send({ book: book });
  } catch (error) {
    return res.status(401).send({ msg: "Error fetching the book..." });
  }
};


