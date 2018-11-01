var mongoose = require('mongoose');
var BookCategorySchema = require('../schemas/book.category');
var BookCategory = mongoose.model('BookCategory', BookCategorySchema);

module.exports = BookCategory;