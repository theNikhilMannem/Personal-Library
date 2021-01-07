const mongoose = require('mongoose')
const { Schema } = mongoose

const bookSchema = new Schema({
  title: { type: String, required: true },
  comments: [String],
  commentcount: Number
})

const Book = mongoose.model('Book', bookSchema)

exports.Book = Book
