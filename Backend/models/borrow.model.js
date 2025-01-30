const mongoose = require("mongoose");

let borrowSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User ",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    borrowDate: {
      type: Date,
      default: Date.now, // Automatically set to the current date
    },
    returnDate: {
      type: Date, // No default value; set when the book is returned
    },
    status: {
      type: String,
      enum: ['borrowed', 'returned', 'available'],
      default: 'available'
    }
  },
  {
    versionKey: false, // Disable the __v field
    timestamps: true, // Add createdAt and updatedAt fields
  }
);

const Borrow = mongoose.model("Borrow", borrowSchema);
module.exports = Borrow;
