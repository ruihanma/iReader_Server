var mongoose = require('mongoose');
var BookChapterSchema = require('../schemas/book.chapter');
var BookChapter = mongoose.model('BookChapter', BookChapterSchema);

module.exports = BookChapter;