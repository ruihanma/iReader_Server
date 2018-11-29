var mongoose = require('mongoose');
var BookAuthorSchema = require('../schemas/book.author');
var BookAuthor = mongoose.model('BookAuthor', BookAuthorSchema);

module.exports = BookAuthor;