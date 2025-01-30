const mongoose = require("mongoose");
const Borrow = require("../models/borrow.model");
const Book = require("../models/book.model");

// STUDENT BORROW A BOOK
exports.borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    // console.log(`bookId: ${bookId}`);
    // console.log(`userId: ${userId}`);

    // Validate bookId format
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).send({ message: "Invalid book ID format." });
    }

    // Check if user has exceeded the borrow limit
    const borrowCount = await Borrow.countDocuments({
      user: userId,
      status: "borrowed",
    });

    // console.log(`borrowCount: ${borrowCount}`);

    if (borrowCount >= 3) {
      return res
        .status(400)
        .send({ message: "Book limit exceeded (3 books only)." });
    }

    // Fetch the book by the book's _id
    const book = await Book.findById(bookId);

    // console.log(`book: ${book}`);

    if (!book) {
      return res.status(404).send({ message: "Book not found." });
    }

    if (book.availableCopies < 1) {
      return res.status(400).send({ message: "Book not available." });
    }

    // Create a new borrow record
    const borrowRecord = await Borrow.create({
      user: userId,
      book: bookId,
      status: "borrowed",
    });

    // console.log(`borrowRecord: ${borrowRecord}`);

    if (!borrowRecord) {
      return res.status(500).send({ message: "Error creating borrow record." });
    }

    // Update the book's available copies
    book.availableCopies -= 1;
    const updatedBook = await book.save();

    // console.log(`updatedBook: ${updatedBook}`);

    if (!updatedBook) {
      return res.status(500).send({ message: "Error updating book." });
    }

    res.status(201).send({ message: "Book borrowed successfully." });
  } catch (error) {
    console.error("Error borrowing book:", error);
    res
      .status(500)
      .send({ message: "Error borrowing book.", error: error.message });
  }
};

// GET BORROWED BOOKS
exports.getBorrowedBooks = async (req, res) => {
  try {
    const userId = req.query.userId || req.user.id;

    // Fetch all borrow records for the user
    const borrowedBooks = await Borrow.find({ user: userId }).populate("book");
    
    // if (!borrowedBooks.length) {
    //   return res.status(404);
    // }

    // Map the borrow records to a simplified format
    const books = borrowedBooks
      .filter((borrow) => borrow.book)
      .map((borrow) => ({
        id: borrow.book._id,
        title: borrow.book.title,
        author: borrow.book.author,
        borrowDate: borrow.createdAt,
        status: borrow.status,
      }));

    res.status(200).send(books);
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving borrowed books.",
      error: error.message,
    });
  }
};

// STUDENTS RETURN A BOOK
exports.borrowReturn = async (req, res) => {
  try {
    const { bookId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).send({ message: "Invalid book ID." });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).send({ message: "Book not found." });
    }

    const borrowRecord = await Borrow.findOne({
      user: req.user.id,
      book: bookId,
    });
    if (!borrowRecord) {
      return res.status(404).send({ message: "Borrow record not found." });
    }

    if (borrowRecord.status === "returned") {
      return res.status(200).send({ message: "Book is already returned." });
    }

    // Delete borrow record instead of updating it
    await Borrow.findByIdAndDelete(borrowRecord._id);

    // Update the book's available copies
    book.availableCopies += 1;
    const updatedBook = await book.save();

    res
      .status(200)
      .send({ message: "Book returned successfully.", book: updatedBook });
  } catch (error) {
    console.error("Error returning book:", error);
    res
      .status(500)
      .send({
        message: "An error occurred while returning the book.",
        error: error.message,
      });
  }
};
