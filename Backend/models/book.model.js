const mongoose = require("mongoose");

let bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    ISBN: {
      type: String,
      required: true,
    },
    availableCopies: {
      type: Number,
      default: 0,
    },
    borrowedId: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
