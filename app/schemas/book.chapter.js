const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const BookChapterSchema = new Schema({
  name: {
    type: String
  },
  name_en: {
    type: String
  },
  sort: {
    type: Number,
    default: 100
  },
  open: {
    type: Boolean,
    default: false
  },
  r18: {
    type: Boolean,
    default: false
  },
  thumbnail: String,
  book: [{type: ObjectId, ref: 'Book'}],
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});

// const ObjectId = mongoose.Schema.Types.ObjectId
BookChapterSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  next()
});

BookChapterSchema.statics = {
  fetch: function (cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function (id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
};

module.exports = BookChapterSchema;